import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Flame,
  HelpCircle,
  Key,
  LayoutDashboard,
  Lightbulb,
  ListOrdered,
  Lock,
  LockKeyhole,
  LogOut,
  Maximize2,
  Minimize2,
  Play,
  QrCode,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Unlock,
  UserCheck,
  UserPlus,
  Users,
  Wifi,
  X,
  Zap
} from "lucide-react";
import axios from "axios";
import QRCode from "qrcode";
import { toast } from "sonner";
import {
  playClickSound,
  playCorrectSound,
  playErrorSound,
  playHintSound
} from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

type AdminTab =
  | "dashboard"
  | "registrations"
  | "qr_control"
  | "contest_control"
  | "live_participants"
  | "question_bank"
  | "results_release"
  | "leaderboard"
  | "reset_attempt"
  | "audit_logs"
  | "export";

export function HostAdminScreen() {
  const [, setLocation] = useLocation();

  // Host Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loading, setLoading] = useState(false);

  // Live Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [networkIps, setNetworkIps] = useState<string[]>([]);
  const [selectedIp, setSelectedIp] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [projectorMode, setProjectorMode] = useState(false);

  // Search & Filters
  const [regSearch, setRegSearch] = useState("");
  const [attemptSearch, setAttemptSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [qbSearch, setQbSearch] = useState("");
  const [qbDiffFilter, setQbDiffFilter] = useState("ALL");
  const [qbLangFilter, setQbLangFilter] = useState("ALL");
  const [qbPage, setQbPage] = useState(1);
  const [qbViewMode, setQbViewMode] = useState<"list" | "analytics">("list");

  // Host Leaderboard & Analytics State
  const [hostLeaderboard, setHostLeaderboard] = useState<any[]>([]);
  const [questionAnalytics, setQuestionAnalytics] = useState<any[]>([]);
  const [hlSearch, setHlSearch] = useState("");
  const [hlStatusFilter, setHlStatusFilter] = useState("ALL");
  const [hlScoreFilter, setHlScoreFilter] = useState("ALL");

  // Actions state
  const [releasePasskey, setReleasePasskey] = useState("");
  const [resetRollNumber, setResetRollNumber] = useState("");
  const [resetSecretKey, setResetSecretKey] = useState("");

  // New Registration Modal
  const [newRegModal, setNewRegModal] = useState(false);
  const [newRoll, setNewRoll] = useState("");
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("Mechanical Engineering");
  const [newYear, setNewYear] = useState("2nd Year");
  const [newSec, setNewSec] = useState("A");

  // Purge State
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgePasskey, setPurgePasskey] = useState("");

  // Host Login
  const handleHostLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/host/login", { password: passkeyInput });
      if (res.data.success) {
        playCorrectSound();
        setIsAuthenticated(true);
        toast.success("Event Host Console Unlocked");
        fetchDashboardData();
        fetchNetworkIps();
      }
    } catch {
      playErrorSound();
      toast.error("Access Denied: Invalid Host Credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    playClickSound();
    setIsAuthenticated(false);
    setPasskeyInput("");
    setLocation("/");
    toast.info("Host Console Locked.");
  };

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const [dashRes, lbRes, qaRes] = await Promise.all([
        axios.get("/api/host/dashboard", { headers: { "x-host-key": "BOOYAHBOY" } }),
        axios.get("/api/host/leaderboard", { headers: { "x-host-key": "BOOYAHBOY" } }),
        axios.get("/api/host/question-analytics", { headers: { "x-host-key": "BOOYAHBOY" } })
      ]);
      if (dashRes.data.success) {
        setDashboardData(dashRes.data.data);
      }
      if (lbRes.data.success) {
        setHostLeaderboard(lbRes.data.leaderboard || []);
      }
      if (qaRes.data.success) {
        setQuestionAnalytics(qaRes.data.analytics || []);
      }
    } catch {}
  };

  // Fetch Network IPs
  const fetchNetworkIps = async () => {
    try {
      const res = await axios.get("/api/network-ip");
      if (res.data.success && res.data.ips?.length > 0) {
        setNetworkIps(res.data.ips);
        const best = res.data.ips.find((ip: string) => !ip.startsWith("127.")) || res.data.ips[0];
        setSelectedIp(best);
      }
    } catch {}
  };

  // Auto-refresh interval when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchDashboardData, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Generate QR Canvas whenever token or IP changes
  useEffect(() => {
    if (!dashboardData?.qr_session) return;
    const port = window.location.port || "3000";
    const hostIp = selectedIp || window.location.hostname || "localhost";
    const token = dashboardData.qr_session.token;
    const contestUrl = `http://${hostIp}:${port}/contest?token=${token}`;

    QRCode.toDataURL(
      contestUrl,
      {
        width: 600,
        margin: 2,
        color: {
          dark: "#020617",
          light: "#ffffff"
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [dashboardData?.qr_session?.token, selectedIp]);

  // QR Controls
  const handleQRAction = async (action: "generate" | "activate" | "deactivate" | "expire") => {
    playClickSound();
    try {
      const res = await axios.post(`/api/host/qr/${action}`, {}, {
        headers: { "x-host-key": "BOOYAHBOY" }
      });
      if (res.data.success) {
        toast.success(`QR Code ${action.toUpperCase()}D successfully!`);
        fetchDashboardData();
      }
    } catch {
      toast.error(`Failed to ${action} QR code.`);
    }
  };

  // Results Release Toggle
  const handleToggleResults = async (release: boolean) => {
    if (!releasePasskey) {
      toast.error("Please enter the result release passkey.");
      return;
    }
    playClickSound();
    try {
      const endpoint = release ? "/api/host/results/release" : "/api/host/results/lock";
      const res = await axios.post(endpoint, { passkey: releasePasskey });
      if (res.data.success) {
        playCorrectSound();
        toast.success(release ? "🟢 Results RELEASED to Leaderboard!" : "🔒 Results LOCKED.");
        setReleasePasskey("");
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Invalid passkey.");
    }
  };

  // Host-Authorized Reset Reattempt
  const handleResetAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetRollNumber || !resetSecretKey) {
      toast.error("Roll Number and Reset Secret Key are required.");
      return;
    }
    playClickSound();
    try {
      const res = await axios.post("/api/host/attempt/reset", {
        roll_number: resetRollNumber.trim().toUpperCase(),
        reset_key: resetSecretKey.trim()
      });
      if (res.data.success) {
        playCorrectSound();
        toast.success(res.data.message);
        setResetRollNumber("");
        setResetSecretKey("");
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Reset failed. Check Reset Key.");
    }
  };

  // Host Purge Contest (Authorized by BOOYAHBOY)
  const handlePurgeContest = async () => {
    if (!purgePasskey.trim()) {
      toast.error("Please enter the Event Host passkey to authorize database purge.");
      return;
    }
    playClickSound();
    try {
      const key = purgePasskey.trim();
      const res = await axios.post(
        "/api/host/purge",
        { passkey: key, host_key: key },
        { headers: { "x-host-key": key } }
      );
      if (res.data.success) {
        playCorrectSound();
        toast.success("Contest database purged. Clean live contest initialized!");
        setPurgePasskey("");
        setShowPurgeModal(false);
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Invalid passkey. Purge denied.");
    }
  };

  // Manual Registration
  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoll.trim() || !newName.trim()) {
      toast.error("Roll Number and Name are required.");
      return;
    }
    try {
      const res = await axios.post("/api/register", {
        roll_number: newRoll.trim().toUpperCase(),
        student_name: newName.trim(),
        department: newDept,
        year: newYear,
        section: newSec
      });
      if (res.data.success) {
        playCorrectSound();
        toast.success(`Registered ${newRoll} successfully!`);
        setNewRegModal(false);
        setNewRoll("");
        setNewName("");
        fetchDashboardData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    playClickSound();
    window.open("/api/host/export?format=csv&host_key=BOOYAHBOY", "_blank");
  };

  // -------------------------------------------------------------
  // LOGIN PROMPT SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3 flex flex-col items-center">
            <PragatiLogo variant="header" size="md" className="justify-center" subtitleText="DEPARTMENT OF MECHANICAL ENGINEERING" />
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              <LockKeyhole className="w-3.5 h-3.5" /> Event Host Command Console
            </div>
            <p className="text-xs text-slate-400">
              Enter official conducting committee passkey to access host control panel.
            </p>
          </div>

          <form onSubmit={handleHostLogin} className="space-y-4">
            <input
              type="password"
              required
              autoFocus
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Enter Event Host Passkey"
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-center text-white text-base tracking-widest placeholder:text-slate-600 focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={loading || !passkeyInput}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              {loading ? "Authenticating..." : "Unlock Host Console"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                playClickSound();
                setLocation("/");
              }}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Back to Main Arena Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const counts = dashboardData?.counts || {
    registered: 0,
    started: 0,
    active: 0,
    submitted: 0,
    time_expired: 0,
    abandoned: 0,
    reset: 0
  };

  const qrSession = dashboardData?.qr_session || {
    token: "N/A",
    status: "INACTIVE",
    scan_count: 0
  };

  const config = dashboardData?.config || {};
  const registrations: any[] = dashboardData?.registrations || [];
  const attempts: any[] = dashboardData?.attempts || [];
  const auditLogs: any[] = dashboardData?.recent_logs || [];
  const questions: any[] = dashboardData?.questions || [];

  // Filtered lists
  const filteredRegistrations = registrations.filter(
    (r) =>
      r.roll_number.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.student_name.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.department.toLowerCase().includes(regSearch.toLowerCase())
  );

  const filteredAttempts = attempts.filter(
    (a) =>
      a.roll_number.toLowerCase().includes(attemptSearch.toLowerCase()) ||
      a.student_name.toLowerCase().includes(attemptSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      (l.roll_number && l.roll_number.toLowerCase().includes(logSearch.toLowerCase()))
  );

  const port = window.location.port || "3000";
  const contestUrl = `http://${selectedIp || "localhost"}:${port}/contest?token=${qrSession.token}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Event Host Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <PragatiLogo variant="header" size="sm" subtitleText="EVENT HOST COMMAND CENTER" />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badges */}
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              config.is_active
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            {config.is_active ? "🟢 CONTEST LIVE" : "🔴 PAUSED"}
          </span>

          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              config.results_released
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}
          >
            {config.results_released ? "🏆 RESULTS RELEASED" : "🔒 RESULTS LOCKED"}
          </span>

          <button
            onClick={() => setProjectorMode(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Projector View
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Lock Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Event Host Layout with Sidebar Tabs */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-3 space-y-1 shrink-0 overflow-x-auto flex md:flex-col">
          {[
            { id: "dashboard", label: "Dashboard Metrics", icon: LayoutDashboard },
            { id: "registrations", label: `Registrations (${counts.registered})`, icon: Users },
            { id: "qr_control", label: "QR Access Control", icon: QrCode },
            { id: "live_participants", label: `Live Attempts (${counts.active})`, icon: Activity },
            { id: "results_release", label: "Results Release", icon: Award },
            { id: "leaderboard", label: "Leaderboard", icon: Trophy },
            { id: "reset_attempt", label: "Reset Reattempt", icon: RotateCcw },
            { id: "question_bank", label: "Question Bank (10)", icon: Code2 },
            { id: "audit_logs", label: "Audit Event Logs", icon: FileText },
            { id: "export", label: "Export Records", icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id as AdminTab);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl">
          {/* 1. DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white uppercase">Live Contest Overview</h2>
                <p className="text-xs text-slate-400">Pragati University · Engineering Olympics (MG-7 Core Block)</p>
              </div>

              {/* 7 Core Examination Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">REGISTERED</p>
                  <p className="text-2xl font-black text-amber-400 font-mono">{counts.registered}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">STARTED</p>
                  <p className="text-2xl font-black text-blue-400 font-mono">{counts.started}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">ACTIVE</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono animate-pulse">{counts.active}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">SUBMITTED</p>
                  <p className="text-2xl font-black text-teal-400 font-mono">{counts.submitted}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">TIME EXPIRED</p>
                  <p className="text-2xl font-black text-orange-400 font-mono">{counts.time_expired}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">ABANDONED</p>
                  <p className="text-2xl font-black text-red-400 font-mono">{counts.abandoned}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">RESET (REATTEMPTS)</p>
                  <p className="text-2xl font-black text-purple-400 font-mono">{counts.reset}</p>
                </div>
              </div>

              {/* Quick Actions & QR Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-amber-400" /> Active QR Portal
                  </h3>
                  <div className="flex items-center gap-4">
                    {qrDataUrl && (
                      <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 rounded-lg bg-white p-1" />
                    )}
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-400">Token: <span className="text-amber-400 font-mono font-bold">{qrSession.token}</span></p>
                      <p className="text-slate-400">Status: <span className="text-emerald-400 font-bold">{qrSession.status}</span></p>
                      <p className="text-slate-400">Verified Real Scans: <span className="text-white font-bold">{qrSession.scan_count}</span></p>
                    </div>
                  </div>
                  <button
                    onClick={() => setProjectorMode(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase transition"
                  >
                    Open Fullscreen Projector
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 lg:col-span-2">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" /> Recent Security & Audit Logs
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs font-mono">
                    {auditLogs.slice(0, 6).map((log: any) => (
                      <div key={log.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-amber-400 font-bold">[{log.event_type}]</span>{" "}
                          <span className="text-slate-300">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. REGISTRATIONS TAB */}
          {activeTab === "registrations" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white uppercase">Contestant Registrations</h2>
                  <p className="text-xs text-slate-400">Permanent university registration records</p>
                </div>
                <button
                  onClick={() => setNewRegModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Add Manual Registration
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search by Roll Number, Name, or Department..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Roll Number</th>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5">Year / Sec</th>
                        <th className="p-3.5">Reg Time</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {filteredRegistrations.map((r: any) => (
                        <tr key={r.registration_id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5 font-bold text-amber-400">{r.roll_number}</td>
                          <td className="p-3.5 font-sans font-medium text-white">{r.student_name}</td>
                          <td className="p-3.5 text-slate-300">{r.department}</td>
                          <td className="p-3.5 text-slate-400">{r.year} · Sec {r.section}</td>
                          <td className="p-3.5 text-slate-500">{new Date(r.registration_time).toLocaleTimeString()}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold text-[10px]">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredRegistrations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500 font-sans">
                            No registration records match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. QR ACCESS CONTROL TAB */}
          {activeTab === "qr_control" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white uppercase">Host-Controlled QR Access</h2>
                <p className="text-xs text-slate-400">Generate, activate, deactivate, or expire official contest access QR code</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Display Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    STATUS: {qrSession.status}
                  </div>

                  <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-2xl">
                    {qrDataUrl && <img src={qrDataUrl} alt="Contest QR" className="w-56 h-56" />}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-mono">TOKEN: <strong className="text-amber-400">{qrSession.token}</strong></p>
                    <p className="text-[11px] text-slate-500 break-all font-mono">{contestUrl}</p>
                  </div>

                  <button
                    onClick={() => setProjectorMode(true)}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition"
                  >
                    Enter Projector View (MG-7)
                  </button>
                </div>

                {/* Host Control Actions */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 lg:col-span-2">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" /> QR Session Controls
                  </h3>

                  {/* Network Adapter Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase">
                      Select Host Network IP (Wi-Fi / LAN)
                    </label>
                    <select
                      value={selectedIp}
                      onChange={(e) => setSelectedIp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    >
                      {networkIps.map((ip) => (
                        <option key={ip} value={ip}>{ip} (Port {port})</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500">
                      Ensures contestants on mobile Wi-Fi connect to the correct machine address.
                    </p>
                  </div>

                  {/* 4 Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleQRAction("generate")}
                      className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition"
                    >
                      GENERATE QR
                    </button>
                    <button
                      onClick={() => handleQRAction("activate")}
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase transition"
                    >
                      ACTIVATE QR
                    </button>
                    <button
                      onClick={() => handleQRAction("deactivate")}
                      className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase transition"
                    >
                      DEACTIVATE QR
                    </button>
                    <button
                      onClick={() => handleQRAction("expire")}
                      className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase transition"
                    >
                      EXPIRE QR
                    </button>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
                    <p className="font-bold text-amber-400 uppercase">Contest Access Rule:</p>
                    <p>
                      When the QR code is deactivated or expired, any contestant scanning or loading the URL will see:
                      <strong className="text-white"> "Contest access is currently closed."</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. LIVE ATTEMPTS & PARTICIPANTS TAB */}
          {activeTab === "live_participants" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-white uppercase">Live Participant Attempts</h2>
                <p className="text-xs text-slate-400">Real-time attempt statuses and security monitoring (Scores visible only to host)</p>
              </div>

              {/* Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Roll Number</th>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Score (Host Only)</th>
                        <th className="p-3.5">Tab Switches</th>
                        <th className="p-3.5">Started At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredAttempts.map((a: any) => (
                        <tr key={a.attempt_id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5 font-bold text-amber-400">{a.roll_number}</td>
                          <td className="p-3.5 font-sans font-medium text-white">{a.student_name}</td>
                          <td className="p-3.5 text-slate-400">{a.department}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                a.status === "ACTIVE"
                                  ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                                  : a.status === "SUBMITTED"
                                  ? "bg-teal-500/20 text-teal-400"
                                  : a.status === "DISQUALIFIED"
                                  ? "bg-red-600/30 border border-red-500 text-red-300 font-black"
                                  : a.status === "ABANDONED"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-white">
                            {a.score} / 21
                          </td>
                          <td className="p-3.5">
                            <span className={a.tab_switch_count > 0 ? "text-red-400 font-bold" : "text-slate-500"}>
                              {a.tab_switch_count} violations
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500">{new Date(a.started_at).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                      {filteredAttempts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                            No live attempts recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. RESULTS RELEASE TAB */}
          {activeTab === "results_release" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white uppercase">Official Results Release Gate</h2>
                <p className="text-xs text-slate-400">Only the host can unlock scores and release the public leaderboard</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">CURRENT STATUS:</span>
                    <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                      {config.results_released ? (
                        <>
                          <Unlock className="w-5 h-5 text-emerald-400" />
                          <span className="text-emerald-400">🟢 RESULTS RELEASED</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 text-amber-400" />
                          <span className="text-amber-400">🔒 RESULTS LOCKED</span>
                        </>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Enter Official Release Passkey:
                  </label>
                  <input
                    type="password"
                    value={releasePasskey}
                    onChange={(e) => setReleasePasskey(e.target.value)}
                    placeholder="Enter Passkey"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-mono tracking-widest uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleToggleResults(true)}
                    className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
                  >
                    RELEASE RESULTS
                  </button>
                  <button
                    onClick={() => handleToggleResults(false)}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    LOCK RESULTS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. LEADERBOARD TAB */}
          {activeTab === "leaderboard" && (() => {
            const filteredLb = hostLeaderboard.filter((entry: any) => {
              const matchesSearch =
                !hlSearch ||
                entry.roll_number.toLowerCase().includes(hlSearch.toLowerCase()) ||
                entry.student_name.toLowerCase().includes(hlSearch.toLowerCase()) ||
                entry.department.toLowerCase().includes(hlSearch.toLowerCase());

              const matchesStatus =
                hlStatusFilter === "ALL" || entry.status === hlStatusFilter;

              const matchesScore =
                hlScoreFilter === "ALL" ||
                (hlScoreFilter === "10" && entry.correct_count === 10) ||
                (hlScoreFilter === "9" && entry.correct_count === 9) ||
                (hlScoreFilter === "8" && entry.correct_count === 8) ||
                (hlScoreFilter === "7" && entry.correct_count === 7) ||
                (hlScoreFilter === "BELOW_7" && entry.correct_count < 7);

              return matchesSearch && matchesStatus && matchesScore;
            });

            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-white uppercase flex items-center gap-2">
                      <span>Official Host Master Leaderboard</span>
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono">
                        {hostLeaderboard.length} Ranked
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Authoritative 4-Tier Sorting: 1. Correct (X/10) DESC → 2. Difficulty Score (/21) DESC → 3. Completion Time ASC → 4. Earliest Timestamp
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCsv}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Full CSV
                    </button>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={hlSearch}
                      onChange={(e) => setHlSearch(e.target.value)}
                      placeholder="Search by Roll Number, Name, Department..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={hlScoreFilter}
                      onChange={(e) => setHlScoreFilter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="ALL">All Scores (0..10)</option>
                      <option value="10">Perfect 10/10</option>
                      <option value="9">9/10 Correct</option>
                      <option value="8">8/10 Correct</option>
                      <option value="7">7/10 Correct</option>
                      <option value="BELOW_7">&lt; 7 Correct</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={hlStatusFilter}
                      onChange={(e) => setHlStatusFilter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="TIME_EXPIRED">TIME_EXPIRED</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DISQUALIFIED">DISQUALIFIED (CHEATING)</option>
                      <option value="ABANDONED">ABANDONED</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                        <tr>
                          <th className="p-3">Rank</th>
                          <th className="p-3">Roll Number</th>
                          <th className="p-3">Contestant Name</th>
                          <th className="p-3">Correct</th>
                          <th className="p-3">Wrong</th>
                          <th className="p-3">Unanswered</th>
                          <th className="p-3">Simple (/3)</th>
                          <th className="p-3">Medium (/3)</th>
                          <th className="p-3">Hard (/4)</th>
                          <th className="p-3">Final Score (/21)</th>
                          <th className="p-3">Hint Pen</th>
                          <th className="p-3">Time</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredLb.map((entry: any) => (
                          <tr key={entry.attempt_id} className="hover:bg-slate-800/40 transition">
                            <td className="p-3 font-bold">
                              {entry.rank === 1 ? (
                                <span className="text-amber-400 font-black">🥇 #1</span>
                              ) : entry.rank === 2 ? (
                                <span className="text-slate-200 font-black">🥈 #2</span>
                              ) : entry.rank === 3 ? (
                                <span className="text-amber-600 font-black">🥉 #3</span>
                              ) : (
                                <span className="text-slate-400">#{entry.rank}</span>
                              )}
                            </td>
                            <td className="p-3 font-bold text-white">{entry.roll_number}</td>
                            <td className="p-3 font-sans font-medium text-slate-200">{entry.student_name}</td>
                            <td className="p-3 font-black text-emerald-400 text-sm">{entry.correct_count}/10</td>
                            <td className="p-3 text-red-400 font-bold">{entry.incorrect_count}</td>
                            <td className="p-3 text-slate-500">{entry.unanswered_count}</td>
                            <td className="p-3 text-emerald-300 font-bold">{entry.simple_correct}/3</td>
                            <td className="p-3 text-blue-300 font-bold">{entry.medium_correct}/3</td>
                            <td className="p-3 text-purple-300 font-bold">{entry.hard_correct}/4</td>
                            <td className="p-3 font-black text-amber-400 text-sm">{entry.score}/21</td>
                            <td className="p-3 text-red-400 font-mono">-{entry.hint_penalty_total || 0}</td>
                            <td className="p-3 text-purple-300 font-bold">{entry.time_formatted}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  entry.status === "DISQUALIFIED"
                                    ? "bg-red-600/30 border border-red-500 text-red-300 font-black"
                                    : entry.status === "SUBMITTED"
                                    ? "bg-teal-500/20 text-teal-400"
                                    : entry.status === "TIME_EXPIRED"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : entry.status === "ACTIVE"
                                    ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                                    : "bg-slate-800 text-slate-300"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredLb.length === 0 && (
                          <tr>
                            <td colSpan={13} className="p-6 text-center text-slate-500 font-sans">
                              No contestant records match your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 7. RESET ATTEMPT TAB */}
          {activeTab === "reset_attempt" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white uppercase">Host-Authorized Reattempt / Reset</h2>
                <p className="text-xs text-slate-400">Preserves previous history & logs, and creates permission for a new attempt</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <form onSubmit={handleResetAttempt} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase">
                      Student Roll Number:
                    </label>
                    <input
                      type="text"
                      required
                      value={resetRollNumber}
                      onChange={(e) => setResetRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 25A31A0356"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-amber-500 uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase">
                      Reset Authorization Secret Key:
                    </label>
                    <input
                      type="password"
                      required
                      value={resetSecretKey}
                      onChange={(e) => setResetSecretKey(e.target.value)}
                      placeholder="Enter Reset Key"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono tracking-widest focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
                  >
                    Authorize Official Reattempt
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 8. QUESTION BANK & ANALYTICS TAB */}
          {activeTab === "question_bank" && (() => {
            const allQ = dashboardData?.questions || questions || [];
            const filtered = allQ.filter((q: any) => {
              const matchesSearch = !qbSearch ||
                q.title?.toLowerCase().includes(qbSearch.toLowerCase()) ||
                q.topic?.toLowerCase().includes(qbSearch.toLowerCase()) ||
                q.code_snippet?.toLowerCase().includes(qbSearch.toLowerCase()) ||
                q.id?.toLowerCase().includes(qbSearch.toLowerCase());

              const matchesDiff = qbDiffFilter === "ALL" || q.difficulty === qbDiffFilter;
              const matchesLang = qbLangFilter === "ALL" || q.language?.toLowerCase() === qbLangFilter.toLowerCase();

              return matchesSearch && matchesDiff && matchesLang;
            });

            const pageSize = 15;
            const totalPages = Math.ceil(filtered.length / pageSize) || 1;
            const currentPage = Math.min(qbPage, totalPages);
            const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

            return (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-white uppercase flex items-center gap-2">
                      <span>Master Question Pool & Analytics</span>
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono">
                        {allQ.length} Questions Loaded
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Zero-Repetition Multi-Contestant Engine · 10 unique questions assigned per participant (3 Simple, 3 Medium, 4 Hard = 21 Difficulty pts)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQbViewMode("list")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                        qbViewMode === "list"
                          ? "bg-amber-500 text-slate-950 font-black shadow"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Question Browser
                    </button>
                    <button
                      onClick={() => setQbViewMode("analytics")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                        qbViewMode === "analytics"
                          ? "bg-amber-500 text-slate-950 font-black shadow"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Question Analytics ({questionAnalytics.length})
                    </button>
                  </div>
                </div>

                {qbViewMode === "analytics" ? (
                  /* Question-Level Analytics View */
                  <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                            <tr>
                              <th className="p-3.5">Question ID</th>
                              <th className="p-3.5">Difficulty</th>
                              <th className="p-3.5">Language</th>
                              <th className="p-3.5">Topic / Concept</th>
                              <th className="p-3.5">Total Assigned</th>
                              <th className="p-3.5">Correct Attempts</th>
                              <th className="p-3.5">Incorrect Attempts</th>
                              <th className="p-3.5">Unanswered</th>
                              <th className="p-3.5">Accuracy (% Correct)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {questionAnalytics.map((qa: any) => (
                              <tr key={qa.id} className="hover:bg-slate-800/40 transition">
                                <td className="p-3.5 font-bold text-amber-400">{qa.id}</td>
                                <td className="p-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                      qa.difficulty === "HARD"
                                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                                        : qa.difficulty === "MEDIUM"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    }`}
                                  >
                                    {qa.difficulty} ({qa.difficulty_points} pt)
                                  </span>
                                </td>
                                <td className="p-3.5 uppercase text-slate-300 font-bold">{qa.language}</td>
                                <td className="p-3.5 text-white font-sans">{qa.topic}</td>
                                <td className="p-3.5 font-bold text-white">{qa.attempts_count}</td>
                                <td className="p-3.5 text-emerald-400 font-bold">{qa.correct_count}</td>
                                <td className="p-3.5 text-red-400 font-bold">{qa.incorrect_count}</td>
                                <td className="p-3.5 text-slate-500">{qa.unanswered_count}</td>
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                                      <div
                                        className={`h-full ${
                                          qa.accuracy_percentage >= 70
                                            ? "bg-emerald-500"
                                            : qa.accuracy_percentage >= 40
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                        }`}
                                        style={{ width: `${qa.accuracy_percentage}%` }}
                                      />
                                    </div>
                                    <span className="font-bold text-white">{qa.accuracy_percentage}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {questionAnalytics.length === 0 && (
                              <tr>
                                <td colSpan={9} className="p-6 text-center text-slate-500 font-sans">
                                  No question attempts recorded yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Question List Cards Browser */
                  <div className="space-y-4">
                    {/* Filters & Search Toolbar */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                      <div className="sm:col-span-6">
                        <input
                          type="text"
                          value={qbSearch}
                          onChange={(e) => {
                            setQbSearch(e.target.value);
                            setQbPage(1);
                          }}
                          placeholder="Search by topic, concept, keyword, code snippet..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <select
                          value={qbDiffFilter}
                          onChange={(e) => {
                            setQbDiffFilter(e.target.value);
                            setQbPage(1);
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="ALL">All Difficulties (1000+)</option>
                          <option value="EASY">Easy (10 Points)</option>
                          <option value="MEDIUM">Medium (15 Points)</option>
                          <option value="HARD">Hard (20 Points)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <select
                          value={qbLangFilter}
                          onChange={(e) => {
                            setQbLangFilter(e.target.value);
                            setQbPage(1);
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        >
                          <option value="ALL">All Languages (C & Python)</option>
                          <option value="python">Python Only</option>
                          <option value="c">C Only</option>
                        </select>
                      </div>
                    </div>

                    {/* Question List Cards */}
                    <div className="grid grid-cols-1 gap-4">
                      {paginated.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                          No questions matched your search criteria.
                        </div>
                      ) : (
                        paginated.map((q: any) => (
                          <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-amber-400">
                                QUESTION ID: {q.id} · {q.topic}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 uppercase">
                                  {q.language?.toUpperCase() || "CODE"}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                    q.difficulty === "HARD"
                                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                                      : q.difficulty === "MEDIUM"
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  }`}
                                >
                                  {q.difficulty} ({q.points} PTS)
                                </span>
                              </div>
                            </div>

                            <h3 className="text-base font-bold text-white">{q.title}</h3>
                            <p className="text-xs text-slate-300">{q.description}</p>

                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-200 overflow-x-auto">
                              <pre>{q.code_snippet}</pre>
                            </div>

                            {/* Expected vs Current Output */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 space-y-0.5">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase">🎯 Expected Output:</span>
                                <div className="text-white font-bold text-xs">{q.expected_output}</div>
                              </div>
                              {q.current_output && (
                                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-2.5 space-y-0.5">
                                  <span className="text-[10px] font-bold text-red-400 uppercase">❌ Current Buggy Output:</span>
                                  <div className="text-red-200 text-xs">{q.current_output}</div>
                                </div>
                              )}
                            </div>

                            {/* Multiple Choice Solution Options */}
                            <div className="space-y-1.5 pt-1">
                              <div className="text-[11px] font-bold text-slate-400 uppercase">Fix Options (Key: Option {q.correct_option_id}):</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.options?.map((opt: any) => (
                                  <div
                                    key={opt.id}
                                    className={`p-2.5 rounded-xl border font-mono text-[11px] ${
                                      opt.id === q.correct_option_id
                                        ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-bold"
                                        : "bg-slate-950 border-slate-800 text-slate-300"
                                    }`}
                                  >
                                    <span className="font-bold mr-1.5">[{opt.id}]</span>
                                    <span>{opt.text}</span>
                                    {opt.id === q.correct_option_id && (
                                      <span className="ml-2 text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">
                                        CORRECT FIX
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {q.hint && (
                              <p className="text-xs text-amber-400 font-medium bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 font-mono">
                                {q.hint}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
                        <span className="text-slate-400">
                          Showing page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filtered.length} matching questions)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            disabled={currentPage <= 1}
                            onClick={() => setQbPage((p) => Math.max(1, p - 1))}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold transition"
                          >
                            ← Previous
                          </button>
                          <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setQbPage((p) => Math.min(totalPages, p + 1))}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold transition"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* 9. AUDIT LOGS TAB */}
          {activeTab === "audit_logs" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-white uppercase">Complete Audit Logs</h2>
                <p className="text-xs text-slate-400">Timestamped record of all competition events</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[70vh] overflow-y-auto font-mono text-xs">
                {auditLogs.map((log: any) => (
                  <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-amber-400 font-bold">[{log.event_type}]</span>{" "}
                      {log.roll_number && <span className="text-white font-bold">({log.roll_number})</span>}{" "}
                      <span className="text-slate-300">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. EXPORT TAB */}
          {activeTab === "export" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white uppercase">Export University Records</h2>
                <p className="text-xs text-slate-400">Download complete results and logs for official documentation</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase">Official Data Export</h3>
                <button
                  onClick={handleExportCsv}
                  className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-5 h-5" /> Download Full Results CSV
                </button>
              </div>

              {/* Danger Zone: Clean Live Reset */}
              <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h3 className="text-sm font-bold uppercase">Pre-Contest Database Purge</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Before the live contest begins in MG-7 hall, click here to clear all simulation test data and reset registration/attempt counters to 0 while keeping the 1,120+ master question bank intact.
                </p>
                <button
                  onClick={() => setShowPurgeModal(true)}
                  className="w-full py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  🧹 Purge Test Data & Start Clean Live Contest
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FULLSCREEN PROJECTOR VIEW (FOR AUDITORIUM MG-7 CORE BLOCK) */}
      {/* ------------------------------------------------------------- */}
      {projectorMode && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-between p-6 sm:p-10 select-none">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Official Examination Portal
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                PRAGATI UNIVERSITY · ENGINEERING OLYMPICS
              </h1>
              <p className="text-sm sm:text-base font-bold text-amber-400 uppercase tracking-widest">
                Department of Mechanical Engineering · MG-7 Core Block
              </p>
            </div>

            <button
              onClick={() => setProjectorMode(false)}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-2 transition"
            >
              <Minimize2 className="w-5 h-5" /> Exit Projector
            </button>
          </div>

          {/* Large Center QR & Instructions */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 my-auto">
            <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-amber-500">
              {qrDataUrl && <img src={qrDataUrl} alt="Contest QR" className="w-72 h-72 sm:w-96 sm:h-96" />}
            </div>

            <div className="max-w-md space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  HOW TO PARTICIPATE
                </span>
                <h2 className="text-3xl font-black text-white uppercase">
                  Scan QR with your phone camera
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base font-medium text-slate-300">
                <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span>Ensure you are connected to the campus Wi-Fi / Hotspot</span>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span>Scan QR & enter your registered <strong>Roll Number</strong></span>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                    3
                  </div>
                  <span>Read the 22 rules and start your official 10-minute exam</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300">
                Direct URL: {contestUrl}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-500">
            MG-7 Core Block · 16 September 2026 · Pragati University
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MANUAL REGISTRATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {newRegModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase">Add Manual Registration</h3>
              <button onClick={() => setNewRegModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualRegister} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Roll Number:</label>
                <input
                  type="text"
                  required
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value.toUpperCase())}
                  placeholder="e.g. 25A31A0399"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Full Name:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Student Full Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Department:</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                  <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase transition mt-2"
              >
                Save Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PURGE DATABASE MODAL */}
      {/* ------------------------------------------------------------- */}
      {showPurgeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-600/60 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase">
                <AlertTriangle className="w-5 h-5" />
                <span>Confirm Contest Data Purge</span>
              </div>
              <button onClick={() => setShowPurgeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will <strong>wipe all test registrations, simulation attempts, and scores</strong> to prepare a 100% clean, fresh database for the real contestants. The <strong>1,120+ master questions will remain safe</strong>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePurgeContest();
              }}
              className="space-y-3 pt-2"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-400 uppercase">
                  Enter Event Host Passkey to Authorize:
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={purgePasskey}
                  onChange={(e) => setPurgePasskey(e.target.value)}
                  placeholder="Enter Event Host Passkey"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPurgeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase transition cursor-pointer shadow-lg shadow-red-600/30"
                >
                  Confirm Purge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
