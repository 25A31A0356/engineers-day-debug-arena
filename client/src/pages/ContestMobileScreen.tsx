import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  HelpCircle,
  Lightbulb,
  Lock,
  LogOut,
  Maximize2,
  Minimize2,
  QrCode,
  Radio,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wifi,
  WifiOff,
  Zap
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  playClickSound,
  playCorrectSound,
  playErrorSound,
  playHintSound,
  playStartMissionSound
} from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

type ContestPhase =
  | "ROLL_ENTRY"
  | "ATTEMPT_BLOCKED"
  | "NETWORK_NOTICE"
  | "RULES_SCREEN"
  | "ARENA"
  | "SUBMITTED"
  | "ABANDONED"
  | "DISQUALIFIED";

interface Question {
  id: string;
  number: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  points: number;
  title: string;
  description: string;
  code_snippet: string;
  language: string;
  expected_output?: string;
  current_output?: string;
  options: { id: string; text: string }[];
  has_hint: boolean;
}

const OFFICIAL_RULES_LIST = [
  "This is an official Engineering Olympics competition.",
  "You have ONE attempt only.",
  "Total time is 15 MINUTES.",
  "There are exactly 10 questions.",
  "3 questions are EASY (1 point difficulty).",
  "3 questions are MEDIUM (2 points difficulty).",
  "4 questions are HARD (3 points difficulty).",
  "No hints are provided. All debugging and analysis must be performed independently.",
  "Maintain a stable and reliable internet connection throughout the contest.",
  "Do NOT refresh the page.",
  "Do NOT close the browser.",
  "Do NOT press the browser BACK button.",
  "Do NOT switch away from the contest to external applications.",
  "Do NOT use AI chatbots or AI assistants.",
  "Do NOT use external websites/search engines to obtain answers.",
  "Do NOT use another device to obtain assistance.",
  "Do NOT share questions or answers with other contestants.",
  "Do NOT attempt to manipulate the browser, API, timer, or contest system.",
  "Your submission will be automatically recorded when the timer reaches zero.",
  "Once submitted, the answers cannot be changed.",
  "Scores and leaderboard information remain hidden until officially released by the host.",
  "Any technical issue must be immediately reported to the host."
];

export function ContestMobileScreen() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<ContestPhase>("ROLL_ENTRY");

  // Authentication & Verification
  const [rollNumber, setRollNumber] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedDetails, setBlockedDetails] = useState<any>(null);

  // Contest Session State
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

  // Timer & Security Monitoring
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [backModalOpen, setBackModalOpen] = useState(false);
  const [tabViolationModalOpen, setTabViolationModalOpen] = useState(false);

  // Read URL QR token and register verified live scan
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      const cleanToken = token.toUpperCase().trim();
      setQrToken(cleanToken);
      // Register verified live QR scan on server
      axios.post("/api/qr/scan", { token: cleanToken }).catch(() => {});
    }
  }, []);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Network connection restored.", { icon: "🟢" });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("NETWORK CONNECTION LOST — Preserving contest session.", { duration: 8000 });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // -------------------------------------------------------------
  // Anti-Cheat: Keyboard & Clipboard Protection (F12, Ctrl+U, Copy)
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== "ARENA") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u" || e.key === "C" || e.key === "c"))
      ) {
        e.preventDefault();
        toast.error("Security Alert: Developer tools and clipboard copying are blocked!", { icon: "🛡️" });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [phase]);

  // -------------------------------------------------------------
  // Anti-Cheat: Visibility Change (Tab / App switch detection)
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== "ARENA" || !attemptId) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // Contestant minimized browser or switched app/tab
        try {
          const res = await axios.post("/api/contest/log-event", {
            attempt_id: attemptId,
            event_type: "TAB_SWITCH",
            details: `Window hidden / app switch detected at ${new Date().toLocaleTimeString()}`
          });

          if (res.data.terminated) {
            playErrorSound();
            setPhase("DISQUALIFIED");
            setErrorMessage(res.data.reason || "Contest session disqualified due to multiple window violations.");
          } else {
            playErrorSound();
            setTabSwitchCount(res.data.switch_count || 1);
            setTabViolationModalOpen(true);
          }
        } catch {
          // Ignore network errors in background
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [phase, attemptId]);

  // -------------------------------------------------------------
  // Anti-Cheat: Browser Back Button Trap
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== "ARENA") return;

    // Push dummy history state to trap back button
    window.history.pushState({ contestActive: true }, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Re-push state so URL doesn't revert
      window.history.pushState({ contestActive: true }, "", window.location.href);
      setBackModalOpen(true);
      playErrorSound();

      if (attemptId) {
        axios.post("/api/contest/log-event", {
          attempt_id: attemptId,
          event_type: "BACK_NAVIGATION",
          details: "Back button intercepted."
        }).catch(() => {});
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Leaving the contest will terminate your official attempt!";
      return e.returnValue;
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [phase, attemptId]);

  // -------------------------------------------------------------
  // Authoritative Server Timer Sync Interval
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== "ARENA" || !attemptId) return;

    // Local 1-second countdown ticker
    const ticker = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(ticker);
          handleAutoSubmitOnExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Periodic 15-second server synchronization heartbeat
    const syncInterval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/contest/session/${attemptId}`);
        if (res.data.success) {
          setRemainingSeconds(res.data.remaining_seconds);
          if (res.data.status === "SUBMITTED" || res.data.status === "TIME_EXPIRED") {
            setPhase("SUBMITTED");
          } else if (res.data.status === "ABANDONED") {
            setPhase("ABANDONED");
          }
        }
      } catch {
        // Ignore periodic sync network blips
      }
    }, 15000);

    return () => {
      clearInterval(ticker);
      clearInterval(syncInterval);
    };
  }, [phase, attemptId]);

  const handleAutoSubmitOnExpiry = async () => {
    if (!attemptId) return;
    try {
      await axios.post("/api/contest/submit", { attempt_id: attemptId });
    } catch {}
    setPhase("SUBMITTED");
    toast.info("Time expired! Your answers have been automatically submitted.");
  };

  // -------------------------------------------------------------
  // Step 0: Verify Roll Number & QR Access
  // -------------------------------------------------------------
  const handleVerifyEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const roll = rollNumber.trim().toUpperCase();
    if (!roll) {
      toast.error("Please enter your registered Roll Number.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await axios.post("/api/contest/verify-entry", {
        roll_number: roll,
        token: qrToken || undefined
      });

      if (res.data.can_start) {
        playClickSound();
        setStudentDetails(res.data.registration);
        // Check if resuming active attempt or starting new
        if (res.data.existing_attempt) {
          // Resume active
          setAttemptId(res.data.existing_attempt.attempt_id);
          setSelectedAnswers(res.data.existing_attempt.answers || {});
          setPhase("ARENA");
        } else {
          // Move to Network Notice -> Rules -> Start
          setPhase("NETWORK_NOTICE");
        }
      } else {
        playErrorSound();
        if (res.data.requires_reattempt_reset) {
          setBlockedDetails(res.data.existing_attempt);
          setPhase("ATTEMPT_BLOCKED");
        } else {
          setErrorMessage(res.data.reason || "Access denied.");
        }
      }
    } catch (err: any) {
      playErrorSound();
      setErrorMessage(err.response?.data?.message || "Server verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Step 2 -> Step 3: Start Official Contest
  // -------------------------------------------------------------
  const handleStartContest = async () => {
    if (!rulesAccepted) {
      toast.error("You must agree to the contest rules before starting.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/contest/start", {
        roll_number: rollNumber.trim().toUpperCase(),
        token: qrToken || undefined
      });

      if (res.data.success) {
        playStartMissionSound();
        setAttemptId(res.data.attempt.attempt_id);
        setQuestions(res.data.questions);
        setSelectedAnswers(res.data.attempt.answers || {});
        const now = Date.now();
        const expiry = new Date(res.data.attempt.expires_at).getTime();
        setRemainingSeconds(Math.max(0, Math.floor((expiry - now) / 1000)));
        setPhase("ARENA");
        toast.success("Official Contest Started! Timer: 15:00");
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Failed to start contest session.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Step 3: Save Answer for Current Question
  // -------------------------------------------------------------
  const handleSelectOption = async (optionId: string) => {
    if (!attemptId || phase !== "ARENA") return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    playClickSound();
    const updated = { ...selectedAnswers, [currentQ.id]: optionId };
    setSelectedAnswers(updated);

    // Save progressively to server backend
    try {
      await axios.post("/api/contest/save-answer", {
        attempt_id: attemptId,
        question_id: currentQ.id,
        option_id: optionId
      });
    } catch {
      // Background retry on next sync
    }
  };

  // -------------------------------------------------------------
  // Final Manual Submit
  // -------------------------------------------------------------
  const handleFinalSubmit = async () => {
    if (!attemptId) return;
    setSubmitConfirmOpen(false);
    setLoading(true);

    try {
      const res = await axios.post("/api/contest/submit", { attempt_id: attemptId });
      if (res.data.success) {
        playCorrectSound();
        setPhase("SUBMITTED");
        toast.success("Contest Submitted Successfully!");
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  // Abandon handler
  const handleConfirmAbandon = async () => {
    setBackModalOpen(false);
    if (!attemptId) return;

    try {
      await axios.post("/api/contest/abandon", {
        attempt_id: attemptId,
        reason: "Contestant confirmed exit through back button modal."
      });
    } catch {}
    setPhase("ABANDONED");
  };

  // Timer format mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = Math.max(0, seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const currentQ = questions[currentIndex];

  // =========================================================================
  // 1. PHASE: ROLL NUMBER ENTRY & QR GATEWAY
  // =========================================================================
  if (phase === "ROLL_ENTRY") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2.5 flex flex-col items-center">
            <PragatiLogo variant="stacked" size="md" subtitleText="DEPARTMENT OF MECHANICAL ENGINEERING" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Debug The Code · Official Contest
            </div>
          </div>

          {/* Roll Entry Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Enter your registered Roll Number:
              </label>
              <form onSubmit={handleVerifyEntry} className="space-y-4 pt-1">
                <input
                  type="text"
                  required
                  autoFocus
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 25A31A0356"
                  maxLength={15}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3.5 text-center text-xl font-mono font-bold tracking-widest text-amber-300 placeholder:text-slate-600 focus:outline-none uppercase transition"
                />

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !rollNumber.trim()}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "ENTER CONTEST"}
                </button>
              </form>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-center space-y-2">
              <p className="text-[11px] text-slate-400">
                Not registered yet? Register before starting.
              </p>
              <button
                onClick={() => {
                  playClickSound();
                  setLocation("/register");
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
              >
                Go to Registration Portal <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. PHASE: ATTEMPT ALREADY USED
  // =========================================================================
  if (phase === "ATTEMPT_BLOCKED") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-red-400 tracking-tight uppercase">
              ATTEMPT ALREADY USED
            </h2>
            <p className="text-sm text-slate-300">
              You have already participated in this contest.
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Please contact the host in <strong>MG-7 Core Block</strong> if you believe this is an error or require an authorized reattempt.
            </p>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">ROLL NUMBER:</span>
              <span className="text-amber-400 font-bold">{rollNumber}</span>
            </div>
            {blockedDetails && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-red-400 font-bold">{blockedDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TIMESTAMP:</span>
                  <span className="text-slate-300">{new Date(blockedDetails.started_at).toLocaleTimeString()}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => {
              playClickSound();
              setPhase("ROLL_ENTRY");
              setRollNumber("");
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold tracking-wider uppercase transition"
          >
            Back to Roll Entry
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. PHASE: IMPORTANT NETWORK NOTICE
  // =========================================================================
  if (phase === "NETWORK_NOTICE") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                IMPORTANT NETWORK NOTICE
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                Mandatory Connectivity Verification
              </p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 space-y-3">
            <p className="text-slate-300">
              This contest requires a stable internet connection throughout the 15-minute examination.
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 font-medium">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4 shrink-0" /> Mobile data / Wi-Fi is stable
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4 shrink-0" /> Your device has sufficient battery
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4 shrink-0" /> You have sufficient internet data
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4 shrink-0" /> Do not move to an area with poor network coverage
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              If your connection is unstable, answers may take longer to synchronize. The original server-side 15-minute expiry time remains unchanged.
            </p>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setPhase("RULES_SCREEN");
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 active:scale-[0.98] transition cursor-pointer"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. PHASE: OFFICIAL CONTEST RULES SCREEN
  // =========================================================================
  if (phase === "RULES_SCREEN") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 py-8 select-none">
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 text-center space-y-1">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              OFFICIAL CONTEST RULES
            </h2>
            <p className="text-xs text-amber-400 font-semibold">
              Read all rules carefully before initiating the 15-minute timer
            </p>
          </div>

          {/* Scrollable Rules Container */}
          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-2 text-xs text-slate-300 font-sans">
            {OFFICIAL_RULES_LIST.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80"
              >
                <span className="font-mono font-bold text-amber-400 text-[11px] shrink-0 w-5">
                  {idx + 1}.
                </span>
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>

          {/* Mandatory Checkbox */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={rulesAccepted}
                onChange={(e) => setRulesAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-amber-500 rounded border-slate-700 focus:ring-amber-500"
              />
              <span className="text-xs font-semibold text-white select-none">
                I have read and agree to the official contest rules.
              </span>
            </label>
          </div>

          <button
            onClick={handleStartContest}
            disabled={!rulesAccepted || loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {loading ? "Initializing Exam Session..." : "START CONTEST"}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. PHASE: SUBMITTED SUCCESS / RESULTS LOCKED
  // =========================================================================
  if (phase === "SUBMITTED") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              CONTEST SUBMITTED SUCCESSFULLY
            </h2>
            <p className="text-sm text-emerald-400 font-semibold">
              Your submission has been recorded.
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2 mt-4">
              <p className="font-semibold text-amber-300 flex items-center justify-center gap-1.5">
                <Lock className="w-4 h-4" /> Results are currently locked.
              </p>
              <p className="text-slate-400">
                Please wait for the official result announcement and prize release in MG-7 Core Block.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            ROLL NUMBER: {rollNumber} · SESSION COMPLETE
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. PHASE: ABANDONED / TERMINATED
  // =========================================================================
  if (phase === "ABANDONED") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-red-400 tracking-tight uppercase">
              CONTEST CLOSED
            </h2>
            <p className="text-sm text-slate-300">
              Your contest session was closed because you left the official contest interface.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Please contact the event host if this happened accidentally.
            </p>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-400">
            ROLL NUMBER: {rollNumber} · STATUS: ABANDONED
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. PHASE: DISQUALIFIED (ANTI-CHEAT TRIGGER)
  // =========================================================================
  if (phase === "DISQUALIFIED") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-md bg-slate-900 border border-red-500 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border-2 border-red-500 animate-pulse">
            <ShieldAlert className="w-11 h-11" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-red-500 tracking-tight uppercase">
              DISQUALIFIED
            </h2>
            <p className="text-sm font-semibold text-red-300">
              ANTI-CHEAT VIOLATION DETECTED
            </p>
            <p className="text-xs text-slate-300 pt-1 leading-relaxed">
              Your contest session was automatically terminated and disqualified because you repeatedly left the contest window or switched applications.
            </p>
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 font-mono mt-3">
              Violation Logged to Host Audit Trail · Score: 0 / 155
            </div>
            <p className="text-xs text-slate-400 pt-2">
              Report immediately to the Event Host in MG-7 Core Block for verification.
            </p>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-400">
            ROLL NUMBER: {rollNumber} · STATUS: DISQUALIFIED
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. PHASE: ARENA (Strict Mobile-First Exam Mode)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      {/* Offline banner alert */}
      {!isOnline && (
        <div className="bg-red-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 animate-pulse" />
          NETWORK CONNECTION LOST — Your contest session is being preserved. Reconnect immediately.
        </div>
      )}

      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-3 px-4 sm:px-6 sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="text-xs font-black text-amber-400 uppercase tracking-wider">
            ENGINEERING OLYMPICS
          </h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase">
            DEBUG THE CODE
          </p>
        </div>

        {/* Server Authoritative 15-Minute Countdown */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm sm:text-base border ${
              remainingSeconds < 180
                ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                : "bg-slate-950 text-amber-400 border-slate-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTimer(remainingSeconds)}
          </div>

          <button
            onClick={() => setSubmitConfirmOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition"
          >
            SUBMIT
          </button>
        </div>
      </header>

      {/* Main Question Body (Mobile Optimized) */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4 pb-24">
        {currentQ ? (
          <>
            {/* Question Progress & Difficulty Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                QUESTION {currentIndex + 1} / {questions.length}
              </span>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                  currentQ.points === 20
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                    : currentQ.points === 15
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {currentQ.points} PTS
              </span>
            </div>

            {/* Question Title & Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {currentQ.number}. {currentQ.title}
                </h2>
                {currentQ.topic && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase shrink-0">
                    {currentQ.topic}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.description}
              </p>

              {/* Buggy Code Block (Horizontal Scrollable) */}
              <div className="pt-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" /> Buggy Source Code:
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-x-auto font-mono text-xs text-amber-200/90 leading-relaxed shadow-inner">
                  <pre>{currentQ.code_snippet}</pre>
                </div>
              </div>

              {/* Expected vs Current Output Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono text-xs">
                {/* Expected Output */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Expected Output:
                  </div>
                  <div className="text-white font-bold text-xs bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 break-words">
                    {currentQ.expected_output || "Correct Program Output"}
                  </div>
                </div>

                {/* Current Buggy Output */}
                {currentQ.current_output && (
                  <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3 space-y-1">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Current Buggy Output:
                    </div>
                    <div className="text-red-200/90 text-xs bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-red-500/20 break-words">
                      {currentQ.current_output}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Options List (Large Mobile Tap Targets) */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Select the correct fix:
              </span>
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition flex items-start gap-3 active:scale-[0.99] cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-400">Loading questions...</div>
        )}
      </main>

      {/* Bottom Sticky Navigation & Question Matrix */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-3 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <button
            onClick={() => {
              playClickSound();
              setCurrentIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentIndex === 0}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold uppercase transition flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Prev
          </button>

          {/* Question Dots */}
          <div className="flex items-center gap-1 overflow-x-auto px-1 py-1 max-w-[50%]">
            {questions.map((q, idx) => {
              const isAnswered = !!selectedAnswers[q.id];
              const isCurrent = currentIndex === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    playClickSound();
                    setCurrentIndex(idx);
                  }}
                  className={`w-6 h-6 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 transition ${
                    isCurrent
                      ? "bg-amber-500 text-slate-950 ring-2 ring-white"
                      : isAnswered
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => {
                playClickSound();
                setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase transition flex items-center gap-1 cursor-pointer"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitConfirmOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition flex items-center gap-1 cursor-pointer"
            >
              Finish <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Back Button Navigation Warning */}
      {/* ------------------------------------------------------------- */}
      {backModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white uppercase">WARNING</h3>
              <p className="text-xs text-red-300">
                You attempted to leave the official contest.
              </p>
              <p className="text-xs text-slate-400 pt-1">
                Leaving the contest may terminate your attempt as <strong>ABANDONED</strong>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setBackModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold uppercase"
              >
                STAY IN CONTEST
              </button>
              <button
                onClick={handleConfirmAbandon}
                className="py-2.5 px-4 rounded-xl bg-red-800 text-white text-xs font-bold uppercase"
              >
                LEAVE CONTEST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Tab Violation Warning */}
      {/* ------------------------------------------------------------- */}
      {tabViolationModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-amber-400 uppercase">
                WARNING: YOU LEFT THE CONTEST WINDOW
              </h3>
              <p className="text-xs text-slate-300">
                Violation {tabSwitchCount} / 3 recorded.
              </p>
              <p className="text-xs text-slate-400 pt-1">
                Repeated window or tab switching will automatically terminate your contest session!
              </p>
            </div>
            <button
              onClick={() => setTabViolationModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold uppercase"
            >
              I UNDERSTAND & RETURN
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Final Submit Confirmation */}
      {/* ------------------------------------------------------------- */}
      {submitConfirmOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white uppercase">FINAL SUBMISSION</h3>
              <p className="text-xs text-slate-300">Are you sure?</p>
              <p className="text-xs text-amber-400/90 pt-1">
                You will not be able to change your answers after submission.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setSubmitConfirmOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase"
              >
                {loading ? "Submitting..." : "CONFIRM SUBMIT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
