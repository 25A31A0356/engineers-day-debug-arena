import express, { type Request, type Response, type Router } from "express";
import os from "node:os";
import { contestDb } from "./db";

export function createApiRouter(): Router {
  const router = express.Router();
  router.use(express.json());

  // CORS headers for all API requests
  router.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-host-key");
    if (_req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // 1. Network IP Discovery for Multi-Device QR Code Access
  router.get("/network-ip", (_req, res) => {
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          ips.push(iface.address);
        }
      }
    }
    const port = process.env.PORT || 3000;
    res.json({ success: true, ips, port: Number(port) });
  });

  // 2. Public Contest Info
  router.get("/contest/info", (_req, res) => {
    const config = contestDb.getConfig();
    const qr = contestDb.getQRSession();
    res.json({
      success: true,
      contest: {
        contest_id: config.contest_id,
        title: config.title,
        institution: config.institution,
        department: config.department,
        event_name: config.event_name,
        competition_name: config.competition_name,
        venue: config.venue,
        date: config.date,
        time_window: config.time_window,
        duration_minutes: config.duration_minutes,
        is_active: config.is_active,
        results_released: config.results_released,
        allow_registration: config.allow_registration,
        qr_active: qr.status === "ACTIVE"
      }
    });
  });

  // 3. Registration
  router.post("/register", (req, res) => {
    const { roll_number, student_name, department, year, section } = req.body;
    if (!roll_number || !student_name) {
      res.status(400).json({ success: false, message: "Roll Number and Student Name are required." });
      return;
    }

    const result = contestDb.registerStudent({
      roll_number,
      student_name,
      department: department || "Mechanical Engineering",
      year: year || "2nd Year",
      section: section || "A"
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  });

  // 4. Check Registration Status
  router.get("/registration/:rollNumber", (req, res) => {
    const reg = contestDb.getRegistration(req.params.rollNumber);
    if (!reg) {
      res.status(404).json({ success: false, message: "Registration record not found." });
      return;
    }
    res.json({ success: true, registration: reg });
  });

  // 5. Verified Real-Time QR Scan Registration
  router.post("/qr/scan", (req, res) => {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: "QR Token is required." });
      return;
    }
    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;
    const ua = req.headers["user-agent"];
    const result = contestDb.recordRealScan(token, ip, ua);
    res.json(result);
  });

  // 6. Contestant QR Entry Verification
  router.post("/contest/verify-entry", (req, res) => {
    const { roll_number, token } = req.body;
    if (!roll_number) {
      res.status(400).json({ success: false, message: "Roll Number is required." });
      return;
    }

    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;
    const ua = req.headers["user-agent"];
    if (token) {
      contestDb.recordRealScan(token, ip, ua);
    }

    const result = contestDb.verifyEntry(roll_number, token);
    res.json(result);
  });

  // 6. Start Official Contest Attempt
  router.post("/contest/start", (req, res) => {
    const { roll_number, token } = req.body;
    if (!roll_number) {
      res.status(400).json({ success: false, message: "Roll Number is required." });
      return;
    }

    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;
    const ua = req.headers["user-agent"];

    const result = contestDb.startAttempt(roll_number, token, ip, ua);
    if (!result.success) {
      res.status(403).json(result);
      return;
    }

    res.json(result);
  });

  // 7. Get Contest Session State & Authoritative Remaining Time
  router.get("/contest/session/:attemptId", (req, res) => {
    const dashboard = contestDb.getHostDashboardData();
    const attempt = dashboard.attempts.find((a) => a.attempt_id === req.params.attemptId);
    if (!attempt) {
      res.status(404).json({ success: false, message: "Contest session not found." });
      return;
    }

    const now = Date.now();
    const expiry = new Date(attempt.expires_at).getTime();
    const remainingSeconds = Math.max(0, Math.floor((expiry - now) / 1000));

    if (remainingSeconds <= 0 && (attempt.status === "ACTIVE" || attempt.status === "STARTED")) {
      contestDb.submitAttempt(attempt.attempt_id);
    }

    res.json({
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
      questions: contestDb.getAttemptPublicQuestions(attempt.attempt_id)
    });
  });

  // 8. Progressive Answer Auto-Save
  router.post("/contest/save-answer", (req, res) => {
    const { attempt_id, question_id, option_id } = req.body;
    if (!attempt_id || !question_id || !option_id) {
      res.status(400).json({ success: false, message: "Missing required parameters." });
      return;
    }

    const result = contestDb.saveAnswer(attempt_id, question_id, option_id);
    res.json(result);
  });

  // 9. Hint Request (Hard Questions Only)
  router.post("/contest/hint", (req, res) => {
    const { attempt_id, question_id } = req.body;
    if (!attempt_id || !question_id) {
      res.status(400).json({ success: false, message: "Missing required parameters." });
      return;
    }

    const result = contestDb.getHint(attempt_id, question_id);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  });

  // 10. Anti-Cheat Event Logger (Tab Switches & Back Button)
  router.post("/contest/log-event", (req, res) => {
    const { attempt_id, event_type, details } = req.body;
    if (!attempt_id || !event_type) {
      res.status(400).json({ success: false, message: "Missing parameters." });
      return;
    }

    const result = contestDb.logContestantEvent(attempt_id, event_type, details || "");
    res.json(result);
  });

  // 11. Abandon Contest Session
  router.post("/contest/abandon", (req, res) => {
    const { attempt_id, reason } = req.body;
    if (!attempt_id) {
      res.status(400).json({ success: false, message: "Attempt ID required." });
      return;
    }

    const result = contestDb.abandonAttempt(attempt_id, reason);
    res.json(result);
  });

  // 12. Final Contest Submission
  router.post("/contest/submit", (req, res) => {
    const { attempt_id } = req.body;
    if (!attempt_id) {
      res.status(400).json({ success: false, message: "Attempt ID required." });
      return;
    }

    const result = contestDb.submitAttempt(attempt_id);
    res.json({
      success: true,
      message: "CONTEST SUBMITTED SUCCESSFULLY\nYour submission has been recorded.\nResults are currently locked.\nPlease wait for the official result announcement."
    });
  });

  // 13. Public Leaderboard
  router.get("/leaderboard", (req, res) => {
    const data = contestDb.getLeaderboard(false);
    const searchRoll = typeof req.query.search_roll === "string" ? req.query.search_roll.trim().toUpperCase() : undefined;

    let userRankEntry = null;
    if (searchRoll) {
      // Look in full host leaderboard to find student's position safely
      const fullData = contestDb.getLeaderboard(true);
      userRankEntry = fullData.leaderboard.find((e) => e.roll_number === searchRoll) || null;
    }

    res.json({
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
    });
  });

  // =========================================================================
  // HOST ADMIN ENDPOINTS
  // =========================================================================

  // Verify Host Auth Helper
  const requireHost = (req: Request, res: Response, next: () => void) => {
    const key = req.headers["x-host-key"] || req.body?.host_key || req.query?.host_key;
    if (key !== "BOOYAHBOY") {
      res.status(401).json({ success: false, message: "Access Denied: Invalid Host Key." });
      return;
    }
    next();
  };

  // Host Login Verification
  router.post("/host/login", (req, res) => {
    const { password } = req.body;
    if (password === "BOOYAHBOY") {
      res.json({ success: true, message: "Event Host Console Unlocked." });
      return;
    }
    res.status(401).json({ success: false, message: "Invalid passkey. Access denied." });
  });

  // Host Full Dashboard Data
  router.get("/host/dashboard", requireHost, (_req, res) => {
    const data = contestDb.getHostDashboardData();
    res.json({ success: true, data });
  });

  // Host Config Update
  router.post("/host/config", requireHost, (req, res) => {
    contestDb.updateConfig(req.body);
    res.json({ success: true, config: contestDb.getConfig() });
  });

  // Host QR Controls
  router.post("/host/qr/generate", requireHost, (req, res) => {
    const qr = contestDb.generateQR(req.body.activateImmediately ?? true);
    res.json({ success: true, qr_session: qr });
  });

  router.post("/host/qr/activate", requireHost, (_req, res) => {
    const qr = contestDb.activateQR();
    res.json({ success: true, qr_session: qr });
  });

  router.post("/host/qr/deactivate", requireHost, (_req, res) => {
    const qr = contestDb.deactivateQR();
    res.json({ success: true, qr_session: qr });
  });

  router.post("/host/qr/expire", requireHost, (_req, res) => {
    const qr = contestDb.expireQR();
    res.json({ success: true, qr_session: qr });
  });

  // Host Result Release
  router.post("/host/results/release", (req, res) => {
    const { passkey } = req.body;
    const result = contestDb.releaseResults(passkey || "");
    if (!result.success) {
      res.status(403).json(result);
      return;
    }
    res.json(result);
  });

  router.post("/host/results/lock", (req, res) => {
    const { passkey } = req.body;
    const result = contestDb.lockResults(passkey || "");
    if (!result.success) {
      res.status(403).json(result);
      return;
    }
    res.json(result);
  });

  // Host Authorized Reattempt Reset (Requires key "2008")
  router.post("/host/attempt/reset", (req, res) => {
    const { roll_number, reset_key } = req.body;
    if (!roll_number || !reset_key) {
      res.status(400).json({ success: false, message: "Roll Number and Reset Key are required." });
      return;
    }

    const result = contestDb.resetAttemptForRoll(roll_number, reset_key);
    if (!result.success) {
      res.status(403).json(result);
      return;
    }

    res.json(result);
  });

  // Host Unmasked Leaderboard
  router.get("/host/leaderboard", requireHost, (_req, res) => {
    const data = contestDb.getLeaderboard(true);
    res.json({ success: true, ...data });
  });

  // Host Question-Level Analytics
  router.get("/host/question-analytics", requireHost, (_req, res) => {
    const analytics = contestDb.getQuestionAnalytics();
    res.json({ success: true, analytics });
  });

  // Host Audit Logs
  router.get("/host/audit-logs", requireHost, (_req, res) => {
    res.json({ success: true, logs: contestDb.getAuditLogs() });
  });

  // Host Export (CSV/JSON)
  router.get("/host/export", requireHost, (req, res) => {
    const format = req.query.format || "json";
    const data = contestDb.getHostDashboardData();

    if (format === "csv") {
      const headers = [
        "Rank",
        "Roll Number",
        "Student Name",
        "Department",
        "Year",
        "Section",
        "Final Score (/21)",
        "Correct Count (/10)",
        "Correct Points (+)",
        "Negative Marking Penalty (-)",
        "Hint Penalty (-)",
        "Simple Correct (/3)",
        "Simple Wrong (/3)",
        "Medium Correct (/3)",
        "Medium Wrong (/3)",
        "Hard Correct (/4)",
        "Hard Wrong (/4)",
        "Unanswered Count",
        "Time Taken (MM:SS)",
        "Time Taken (Seconds)",
        "Status",
        "Submission Timestamp"
      ];
      const rows = [headers.join(",")];
      const leaderboard = contestDb.getLeaderboard(true).leaderboard;
      for (const entry of leaderboard) {
        rows.push(
          [
            entry.rank,
            `"${entry.roll_number}"`,
            `"${entry.student_name}"`,
            `"${entry.department}"`,
            `"${entry.year}"`,
            `"${entry.section}"`,
            entry.score,
            entry.correct_count,
            entry.correct_points || 0,
            entry.negative_marking_penalty || 0,
            entry.hint_penalty_total || 0,
            entry.simple_correct,
            entry.simple_wrong || 0,
            entry.medium_correct,
            entry.medium_wrong || 0,
            entry.hard_correct,
            entry.hard_wrong || 0,
            entry.incorrect_count,
            entry.unanswered_count,
            `"${entry.time_formatted}"`,
            entry.time_taken_seconds,
            entry.status,
            `"${entry.submitted_at || ""}"`
          ].join(",")
        );
      }

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="engineering_olympics_scores_2026.csv"');
      res.send(rows.join("\n"));
      return;
    }

    res.json({ success: true, data });
  });

  // Host Purge Test Data & Reset to Clean State (Requires Event Host key BOOYAHBOY)
  router.post("/host/purge", (req, res) => {
    const passkey = req.body?.passkey || req.body?.host_key || req.headers["x-host-key"] || "";
    const result = contestDb.purgeAllContestData(String(passkey).trim());
    if (!result.success) {
      res.status(403).json(result);
      return;
    }
    res.json(result);
  });

  return router;
}
