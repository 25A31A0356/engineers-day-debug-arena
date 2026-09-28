import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { clientContestDb } from "./clientDb";

export function setupClientApiBridge() {
  // Use custom adapter / interceptor that handles /api calls directly in browser
  axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    // If external VITE_API_BASE_URL is configured and not empty, let axios proceed to external server
    if (import.meta.env.VITE_API_BASE_URL && !config.url?.startsWith("/api")) {
      return config;
    }

    const url = config.url || "";
    // Only intercept /api routes
    if (!url.startsWith("/api") && !url.includes("/api/")) {
      return config;
    }

    // Strip prefix or host if needed
    const apiPath = url.includes("/api/") ? "/api/" + url.split("/api/")[1] : url;
    const method = (config.method || "get").toLowerCase();
    let body: any = {};
    if (config.data) {
      body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    }
    const params = config.params || {};

    let responseData: any = null;
    let status = 200;

    try {
      // 1. Network IP
      if (apiPath === "/api/network-ip") {
        responseData = {
          success: true,
          ips: [window.location.hostname || "127.0.0.1"],
          port: window.location.port ? Number(window.location.port) : 80
        };
      }

      // 2. Contest Info
      else if (apiPath === "/api/contest/info") {
        const conf = clientContestDb.getConfig();
        const qr = clientContestDb.getQRSession();
        responseData = {
          success: true,
          contest: {
            contest_id: conf.contest_id,
            title: conf.title,
            institution: conf.institution,
            department: conf.department,
            event_name: conf.event_name,
            competition_name: conf.competition_name,
            venue: conf.venue,
            date: conf.date,
            time_window: conf.time_window,
            duration_minutes: conf.duration_minutes,
            is_active: conf.is_active,
            results_released: conf.results_released,
            allow_registration: conf.allow_registration,
            qr_active: qr.status === "ACTIVE"
          }
        };
      }

      // 3. Register
      else if (apiPath === "/api/register" && method === "post") {
        const { roll_number, student_name, department, year, section } = body;
        if (!roll_number || !student_name) {
          status = 400;
          responseData = { success: false, message: "Roll Number and Student Name are required." };
        } else {
          const res = clientContestDb.registerStudent({
            roll_number,
            student_name,
            department,
            year,
            section
          });
          if (!res.success) {
            status = 400;
          }
          responseData = res;
        }
      }

      // 4. Registration Lookup
      else if (apiPath.startsWith("/api/registration/")) {
        const roll = decodeURIComponent(apiPath.replace("/api/registration/", ""));
        const reg = clientContestDb.getRegistration(roll);
        if (!reg) {
          status = 404;
          responseData = { success: false, message: "Registration record not found." };
        } else {
          responseData = { success: true, registration: reg };
        }
      }

      // 5. QR Scan
      else if (apiPath === "/api/qr/scan" && method === "post") {
        const { token } = body;
        responseData = clientContestDb.recordRealScan(token || "");
      }

      // 6. Verify Entry
      else if (apiPath === "/api/contest/verify-entry" && method === "post") {
        const { roll_number, token } = body;
        if (!roll_number) {
          status = 400;
          responseData = { success: false, message: "Roll Number is required." };
        } else {
          if (token) {
            clientContestDb.recordRealScan(token);
          }
          responseData = clientContestDb.verifyEntry(roll_number, token);
        }
      }

      // 7. Contest Start
      else if (apiPath === "/api/contest/start" && method === "post") {
        const { roll_number, token } = body;
        if (!roll_number) {
          status = 400;
          responseData = { success: false, message: "Roll Number is required." };
        } else {
          const result = clientContestDb.startAttempt(roll_number, token);
          if (!result.success) {
            status = 403;
          }
          responseData = result;
        }
      }

      // 8. Contest Session
      else if (apiPath.startsWith("/api/contest/session/")) {
        const attemptId = decodeURIComponent(apiPath.replace("/api/contest/session/", ""));
        const dashboard = clientContestDb.getHostDashboardData();
        const attempt = dashboard.attempts.find((a) => a.attempt_id === attemptId);
        if (!attempt) {
          status = 404;
          responseData = { success: false, message: "Contest session not found." };
        } else {
          const now = Date.now();
          const expiry = new Date(attempt.expires_at).getTime();
          const remainingSeconds = Math.max(0, Math.floor((expiry - now) / 1000));

          if (remainingSeconds <= 0 && (attempt.status === "ACTIVE" || attempt.status === "STARTED")) {
            clientContestDb.submitAttempt(attempt.attempt_id);
          }

          responseData = {
            success: true,
            attempt_id: attempt.attempt_id,
            roll_number: attempt.roll_number,
            student_name: attempt.student_name,
            status: attempt.status,
            started_at: attempt.started_at,
            expires_at: attempt.expires_at,
            remaining_seconds: remainingSeconds,
            answers: attempt.answers,
            hints_used: attempt.hints_used,
            hint_penalty_total: attempt.hint_penalty_total || 0,
            tab_switch_count: attempt.tab_switch_count,
            questions: clientContestDb.getAttemptPublicQuestions(attempt.attempt_id)
          };
        }
      }

      // 9. Save Answer
      else if (apiPath === "/api/contest/save-answer" && method === "post") {
        const { attempt_id, question_id, option_id } = body;
        responseData = clientContestDb.saveAnswer(attempt_id, question_id, option_id);
      }

      // 10. Hint Request
      else if (apiPath === "/api/contest/hint" && method === "post") {
        const { attempt_id, question_id } = body;
        const result = clientContestDb.getHint(attempt_id, question_id);
        if (!result.success) {
          status = 400;
        }
        responseData = result;
      }

      // 11. Log Anti-Cheat Event
      else if (apiPath === "/api/contest/log-event" && method === "post") {
        const { attempt_id, event_type, details } = body;
        responseData = clientContestDb.logContestantEvent(attempt_id, event_type, details || "");
      }

      // 12. Abandon Contest
      else if (apiPath === "/api/contest/abandon" && method === "post") {
        const { attempt_id, reason } = body;
        responseData = clientContestDb.abandonAttempt(attempt_id, reason);
      }

      // 13. Submit Contest
      else if (apiPath === "/api/contest/submit" && method === "post") {
        const { attempt_id } = body;
        clientContestDb.submitAttempt(attempt_id);
        responseData = {
          success: true,
          message: "CONTEST SUBMITTED SUCCESSFULLY\nYour submission has been recorded.\nResults are currently locked.\nPlease wait for the official result announcement."
        };
      }

      // 14. Leaderboard
      else if (apiPath === "/api/leaderboard") {
        const searchRoll = typeof params.search_roll === "string" ? params.search_roll.trim().toUpperCase() : undefined;
        const data = clientContestDb.getLeaderboard(false);
        let userRankEntry = null;
        if (searchRoll) {
          const fullData = clientContestDb.getLeaderboard(true);
          userRankEntry = fullData.leaderboard.find((e) => e.roll_number === searchRoll || e.raw_roll_number === searchRoll) || null;
        }
        responseData = {
          success: true,
          results_released: data.results_released,
          stats: data.stats,
          leaderboard: data.leaderboard,
          user_position: userRankEntry
            ? {
                rank: userRankEntry.rank,
                roll_number: userRankEntry.roll_number,
                student_name: userRankEntry.student_name,
                department: userRankEntry.department,
                correct_count: userRankEntry.correct_count,
                difficulty_score: userRankEntry.score,
                score: userRankEntry.score,
                max_score: 21,
                simple_correct: userRankEntry.simple_correct,
                medium_correct: userRankEntry.medium_correct,
                hard_correct: userRankEntry.hard_correct,
                time_formatted: userRankEntry.time_formatted,
                status: userRankEntry.status
              }
            : null
        };
      }

      // 15. Host Login (Password: BOOYAHBOY)
      else if (apiPath === "/api/host/login" && method === "post") {
        const { password } = body;
        if (password === "BOOYAHBOY") {
          responseData = { success: true, message: "Event Host Console Unlocked." };
        } else {
          status = 401;
          responseData = { success: false, message: "Invalid passkey. Access denied." };
        }
      }

      // 16. Host Dashboard
      else if (apiPath === "/api/host/dashboard") {
        responseData = { success: true, data: clientContestDb.getHostDashboardData() };
      }

      // 17. Host Config
      else if (apiPath === "/api/host/config" && method === "post") {
        clientContestDb.updateConfig(body);
        responseData = { success: true, config: clientContestDb.getConfig() };
      }

      // 18. Host QR
      else if (apiPath === "/api/host/qr/generate" && method === "post") {
        const qr = clientContestDb.generateQR(body.activateImmediately ?? true);
        responseData = { success: true, qr_session: qr };
      } else if (apiPath === "/api/host/qr/activate" && method === "post") {
        const qr = clientContestDb.activateQR();
        responseData = { success: true, qr_session: qr };
      } else if (apiPath === "/api/host/qr/deactivate" && method === "post") {
        const qr = clientContestDb.deactivateQR();
        responseData = { success: true, qr_session: qr };
      } else if (apiPath === "/api/host/qr/expire" && method === "post") {
        const qr = clientContestDb.expireQR();
        responseData = { success: true, qr_session: qr };
      }

      // 19. Host Results Release & Lock
      else if (apiPath === "/api/host/results/release" && method === "post") {
        const { passkey } = body;
        const result = clientContestDb.releaseResults(passkey || "");
        if (!result.success) status = 403;
        responseData = result;
      } else if (apiPath === "/api/host/results/lock" && method === "post") {
        const { passkey } = body;
        const result = clientContestDb.lockResults(passkey || "");
        if (!result.success) status = 403;
        responseData = result;
      }

      // 20. Host Reset Re-attempt (Reset Key: 2008)
      else if (apiPath === "/api/host/attempt/reset" && method === "post") {
        const { roll_number, reset_key } = body;
        const result = clientContestDb.resetAttemptForRoll(roll_number || "", reset_key || "");
        if (!result.success) status = 403;
        responseData = result;
      }

      // 21. Host Leaderboard
      else if (apiPath === "/api/host/leaderboard") {
        responseData = { success: true, ...clientContestDb.getLeaderboard(true) };
      }

      // 22. Host Question Analytics
      else if (apiPath === "/api/host/question-analytics") {
        responseData = { success: true, analytics: clientContestDb.getQuestionAnalytics() };
      }

      // 23. Host Audit Logs
      else if (apiPath === "/api/host/audit-logs") {
        responseData = { success: true, logs: clientContestDb.getHostDashboardData().audit_logs };
      }

      // 24. Host Purge
      else if (apiPath === "/api/host/purge" && method === "post") {
        const passkey = body?.passkey || body?.host_key || "";
        const result = clientContestDb.purgeAllContestData(String(passkey).trim());
        if (!result.success) status = 403;
        responseData = result;
      }

      else {
        status = 404;
        responseData = { success: false, message: `Route not handled in clientApi: ${apiPath}` };
      }
    } catch (err: any) {
      status = 500;
      responseData = { success: false, message: err?.message || "Internal client engine error" };
    }

    if (status >= 400) {
      const error: any = new Error(responseData?.message || "Request failed");
      error.response = {
        data: responseData,
        status,
        statusText: status === 401 ? "Unauthorized" : status === 403 ? "Forbidden" : "Bad Request",
        headers: {},
        config
      };
      return Promise.reject(error);
    }

    // Return a mocked Axios response directly
    const mockResponse: AxiosResponse = {
      data: responseData,
      status,
      statusText: "OK",
      headers: {},
      config
    };

    // Override adapter for this request to return mockResponse immediately
    config.adapter = () => Promise.resolve(mockResponse);
    return config;
  });
}
