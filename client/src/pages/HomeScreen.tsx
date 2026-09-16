import { useState } from "react";
import { useLocation } from "wouter";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  Eye,
  FileCheck2,
  Flame,
  HelpCircle,
  Info,
  Layers,
  LockKeyhole,
  MapPin,
  Megaphone,
  QrCode,
  Recycle,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  Wrench,
  Zap
} from "lucide-react";
import { isSoundEnabled, playClickSound, setSoundEnabled } from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

export function HomeScreen() {
  const [, setLocation] = useLocation();
  const [soundOn, setSoundOnState] = useState(isSoundEnabled());
  const [showRulesModal, setShowRulesModal] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOnState(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const navTo = (path: string) => {
    playClickSound();
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-[#070e18] text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden font-sans">
      {/* Blueprint Grid & Atmospheric Backgrounds */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP NOTIFICATION & QUICK STATUS BAR */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 py-2 z-20 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white tracking-wide">
              PRAGATI UNIVERSITY · ENGINEERS' DAY 2026
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:inline-block text-amber-400 font-medium">
              15th – 19th SEPTEMBER 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition text-[11px]"
              title={soundOn ? "Mute Audio SFX" : "Enable Audio SFX"}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span>{soundOn ? "SFX On" : "SFX Muted"}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setShowRulesModal(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-[11px] transition"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Contest Rules (22)</span>
            </button>

            <button
              onClick={() => navTo("/admin")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold text-[11px] transition"
            >
              <LockKeyhole className="w-3.5 h-3.5" />
              <span>Host Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN BANNER CONTAINER */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 z-10 space-y-8 flex-1">
        
        {/* POSTER-ACCURATE HEADER HERO */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-gradient-to-b from-[#0e1d32] via-[#0b1626] to-[#070e18] shadow-2xl p-6 sm:p-10 text-center">
          
          {/* Mechanical Blueprint Watermark & Gears */}
          <div className="absolute -top-12 -left-12 opacity-10 pointer-events-none text-slate-400">
            <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div className="absolute -bottom-12 -right-12 opacity-10 pointer-events-none text-amber-400">
            <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>

          {/* Top Institutions & Brand Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
            
            {/* Left University Official Emblem & Logo */}
            <PragatiLogo variant="header" size="lg" subtitleText="DEPARTMENT OF MECHANICAL ENGINEERING" />

            {/* Right Brand & Slogan Badge: PATHUB */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-md flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">POWERED BY:</span>
                <div className="flex items-center font-black tracking-widest text-base font-mono">
                  <span className="text-blue-400">P</span>
                  <span className="text-red-400">A</span>
                  <span className="text-yellow-400">T</span>
                  <span className="text-emerald-400">H</span>
                  <span className="text-cyan-400">U</span>
                  <span className="text-purple-400">B</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspirational Engineering Keywords Sub-Banner */}
          <div className="hidden sm:flex items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Precision • Creativity • Progress
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Ideas • Design • Excellence
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Skills • Knowledge • Innovation
            </span>
          </div>

          {/* GRAND FESTIVAL TITLE: ENGINEERS' DAY */}
          <div className="space-y-3 my-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-inner">
              ✨ Let's Celebrate the Spirit of Engineering! ✨
            </div>

            <h1 className="text-4xl sm:text-7xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-amber-300 drop-shadow-[0_4px_16px_rgba(245,158,11,0.25)]">
              ENGINEERS' DAY
            </h1>

            <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-full text-sm sm:text-base uppercase tracking-widest shadow-lg shadow-amber-500/30">
              <Calendar className="w-4 h-4" /> 15TH – 19TH SEPTEMBER 2026
            </div>
          </div>

          {/* CALLOUT BANNER: OPEN TO STUDENTS ACROSS ALL DEPARTMENTS */}
          <div className="mt-8 mx-auto max-w-2xl bg-gradient-to-r from-amber-600/30 via-amber-500/40 to-amber-600/30 border-2 border-amber-400/80 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur flex items-center justify-center gap-3 text-amber-200">
            <Megaphone className="w-6 h-6 text-amber-400 flex-shrink-0 animate-bounce" />
            <span className="font-black text-sm sm:text-lg tracking-wide uppercase text-white drop-shadow">
              OPEN TO STUDENTS ACROSS ALL DEPARTMENTS
            </span>
          </div>
        </div>

        {/* FEATURED: EVENT 2 — "ENGINEERING OLYMPICS: DEBUG THE CODE" (LIVE ACTION ARENA) */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#12233f] via-[#0d1d33] to-[#12233f] border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
            LIVE EXAM ARENA · DAY 2
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono uppercase">
                <Trophy className="w-4 h-4 text-emerald-400" /> Official Competition Track
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <span>ENGINEERING OLYMPICS</span>
                </h2>
                <p className="text-base sm:text-xl font-bold text-amber-400 mt-1 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" /> "Debug The Code" Championship Arena
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Official 15-minute examination contest for 100+ contestants. Solve 10 C and Python debugging questions (5 C + 5 Python = 3 Simple, 3 Medium, 4 Hard) with clear Expected Outputs. 100% server-authoritative scoring and anti-cheat protection.
              </p>

              {/* Quick Specs Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">DATE</div>
                  <div className="font-bold text-white text-xs mt-0.5">16 Sept 2026</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">TIME</div>
                  <div className="font-bold text-emerald-400 text-xs mt-0.5">2:00 – 4:00 PM</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">VENUE</div>
                  <div className="font-bold text-amber-400 text-xs mt-0.5">MG-7 Core Block</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">TOTAL POOL</div>
                  <div className="font-bold text-yellow-300 text-xs mt-0.5">21 Points</div>
                </div>
              </div>
            </div>

            {/* Right Action Launcher Column */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>CONTEST QUICK LAUNCHPAD</span>
                <span className="text-emerald-400 font-mono">100+ SEATS READY</span>
              </div>

              {/* Action 1: Register */}
              <button
                onClick={() => navTo("/register")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wide transition shadow-lg shadow-amber-500/20 group"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-5 h-5" />
                  <span>1. Register For Contest</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              {/* Action 2: Enter Arena */}
              <button
                onClick={() => navTo("/contest")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wide transition shadow-lg shadow-emerald-600/20 group"
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-5 h-5" />
                  <span>2. Enter Mobile Exam (Roll No)</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              {/* Action 3: Public Leaderboard */}
              <button
                onClick={() => navTo("/leaderboard")}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wide transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-blue-400" />
                  <span>3. Official Live Leaderboard</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-DAY EVENT SCHEDULE (ALL EVENTS FROM POSTER) */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" /> Engineers' Day Official Event Schedule
              </h3>
              <p className="text-xs text-slate-400">
                Department of Mechanical Engineering · Complete 4-day competition track
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              🕒 ALL EVENTS: 2:00 PM – 4:00 PM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Event 1: Mystery Material Challenge */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                    📅 15TH SEPT 2026
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">DAY 1</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <Layers className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-base font-black text-white uppercase group-hover:text-blue-400 transition">
                    MYSTERY MATERIAL CHALLENGE
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                    Identify unknown alloys, calculate material properties, density anomalies, and mechanical tensile behavior.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" /> MG-6 Core Block
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  COMPLETED
                </span>
              </div>
            </div>

            {/* Event 2: Engineering Olympics (Active Today) */}
            <div className="bg-slate-900/95 border-2 border-amber-500/80 rounded-2xl p-5 shadow-xl shadow-amber-500/10 flex flex-col justify-between transition relative group">
              <div className="absolute -top-2.5 right-4 bg-amber-500 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                FEATURED · TODAY
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono">
                    📅 16TH SEPT 2026
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> DAY 2
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center group-hover:scale-110 transition">
                  <Trophy className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-base font-black text-amber-400 uppercase">
                    ENGINEERING OLYMPICS
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Debug The Code" 15-minute challenge. 10 C & Python questions with expected output & live scoring.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-bold text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> MG-7 Core Block
                </span>
                <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded">
                  LIVE ARENA
                </span>
              </div>
            </div>

            {/* Event 3: Build A Tiny Bot Challenge */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                    📅 17TH SEPT 2026
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">DAY 3</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <Cpu className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-base font-black text-white uppercase group-hover:text-cyan-400 transition">
                    BUILD A TINY BOT CHALLENGE
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                    Fabricate miniature robotic rovers, calibrate motor drivers, and navigate an obstacle course with precision.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> MF-1 Core Block
                </span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  UPCOMING
                </span>
              </div>
            </div>

            {/* Event 4: Trash to Tech */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                    📅 18TH SEPT 2026
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">DAY 4</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <Recycle className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-base font-black text-white uppercase group-hover:text-emerald-400 transition">
                    TRASH TO TECH
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                    Sustainable engineering hackathon. Transform industrial scrap & electronic waste into innovative functional prototypes.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> MG-10 Core Block
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  UPCOMING
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* OFFICIAL PRIZE POOL & TIMINGS HIGHLIGHT BAR (POSTER EXACT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Box 1: Timings */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OFFICIAL TIMINGS</div>
              <div className="text-lg font-black text-white">2:00 PM – 4:00 PM</div>
              <div className="text-[11px] text-amber-400 font-medium">(Applicable For All Events)</div>
            </div>
          </div>

          {/* Box 2: Cash Prizes */}
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 flex items-center gap-4 shadow-lg bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">CHAMPIONSHIP PRIZES</div>
              <div className="text-xs font-bold text-white flex items-center gap-2 mt-0.5">
                <span>🥇 1st: <strong className="text-amber-400 font-black text-sm">₹1,500/- CASH</strong></span>
                <span>•</span>
                <span>🥈 2nd: <strong className="text-slate-300 font-black text-sm">₹1,000/- CASH</strong></span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">+ Official Merit Certificates</div>
            </div>
          </div>

          {/* Box 3: Organizing Body */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ORGANIZING BODY</div>
              <div className="text-sm font-black text-white uppercase">INDUSTRY 4.0 CLUBS</div>
              <div className="text-[11px] text-blue-400 font-medium">Department of Mechanical Engineering</div>
            </div>
          </div>

        </div>

        {/* FOUR MAIN SYSTEM INTERFACES LAUNCHPAD */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Contest System Portals (100+ Participants)
            </h3>
            <span className="text-xs text-slate-400">Click any card to navigate directly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Registration */}
            <div
              onClick={() => navTo("/register")}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-amber-400 font-mono uppercase tracking-wider">
                    STEP 1: PRE-CONTEST
                  </span>
                  <h4 className="text-base font-bold text-white uppercase group-hover:text-amber-400 transition">
                    Contestant Registration
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Register your Roll Number, Name, Department, Year, and Section to create your official record.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Open Registration</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 2: Mobile Arena */}
            <div
              onClick={() => navTo("/contest")}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
                    STEP 2: LIVE EXAM
                  </span>
                  <h4 className="text-base font-bold text-white uppercase group-hover:text-emerald-400 transition">
                    Mobile Exam Arena
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scan the Host QR code or enter your registered Roll Number to start your 10-minute exam.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Enter Arena</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 3: Public Leaderboard */}
            <div
              onClick={() => navTo("/leaderboard")}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-blue-400 font-mono uppercase tracking-wider">
                    STEP 3: RESULTS
                  </span>
                  <h4 className="text-base font-bold text-white uppercase group-hover:text-blue-400 transition">
                    Public Leaderboard
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live rankings & podium standings. Released publicly by the Event Host upon contest close.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
                <span>View Standings</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 4: Host Console */}
            <div
              onClick={() => navTo("/admin")}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition">
                  <LockKeyhole className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-purple-400 font-mono uppercase tracking-wider">
                    HOST ONLY
                  </span>
                  <h4 className="text-base font-bold text-white uppercase group-hover:text-purple-400 transition">
                    Event Host
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  QR projector view, live participant scoring, reattempt authorization, and results release.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Event Host Login</span>
                <span>→</span>
              </div>
            </div>

          </div>
        </div>

        {/* OFFICIAL COORDINATORS DIRECTORY (EXACT NAMES FROM POSTER) */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white uppercase tracking-wide">
              Official Event Coordinators Directory
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            
            {/* Faculty Coordinators */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>👨‍🏫 Faculty Coordinators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-semibold text-slate-200">
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <div className="text-white font-bold">Mr. V. V. N. Sarath</div>
                  <div className="text-[10px] text-slate-400">Dept. of Mechanical Engg.</div>
                </div>
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <div className="text-white font-bold">Mr. M. Sunil Raj</div>
                  <div className="text-[10px] text-slate-400">Dept. of Mechanical Engg.</div>
                </div>
              </div>
            </div>

            {/* Student Coordinators */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-blue-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>👨‍🎓 Student Coordinators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-semibold text-slate-200">
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <div className="text-white font-bold">Mr. M. Santosh</div>
                  <div className="text-[10px] text-slate-400">Industry 4.0 Club Lead</div>
                </div>
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <div className="text-white font-bold">Mr. Ch. Naveen</div>
                  <div className="text-[10px] text-slate-400">Event Coordinator</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* OFFICIAL UNIVERSITY FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-6 z-10 text-center space-y-2 text-xs text-slate-400">
        <div className="max-w-4xl mx-auto space-y-1">
          <p className="font-bold text-slate-300 uppercase tracking-wider">
            PRAGATI UNIVERSITY · DEPARTMENT OF MECHANICAL ENGINEERING
          </p>
          <p className="text-slate-500 text-[11px]">
            Engineers' Day 2026 · Under Industry 4.0 Mechanical Clubs & PATHUB Platform
          </p>
          <p className="text-[10px] text-slate-600 pt-2 font-mono">
            Official Examination System · Department of Mechanical Engineering
          </p>
        </div>
      </footer>

      {/* 22 OFFICIAL CONTEST RULES MODAL */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white uppercase text-base tracking-wide">
                  Official Contest Rules & Instructions (22)
                </h3>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setShowRulesModal(false);
                }}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-300 font-semibold flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <span>
                  All 100+ contestants must strictly adhere to the examination rules. The contest runs on a server-authoritative 15-minute countdown (900s).
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold text-white uppercase text-xs tracking-wider border-b border-slate-800 pb-1 text-amber-400">
                  Key Examination Rules:
                </div>
                
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                  <li><strong>Single Attempt Rule:</strong> Each registered Roll Number is strictly permitted exactly ONE contest attempt.</li>
                  <li><strong>Strict 15-Minute Timer:</strong> The countdown clock (900s) runs on the server backend and cannot be paused or reset. Auto-submits at 00:00.</li>
                  <li><strong>Question Composition & Negative Marking:</strong> Exactly 10 questions (5 C + 5 Python = 3 Simple [+1 pt], 3 Medium [+2 pts, -0.5 wrong], 4 Hard [+3 pts, -1.0 wrong]). Maximum total score: 21 Points (Minimum: -5.5). Unanswered questions receive 0.</li>
                  <li><strong>Expected Output Display:</strong> Every question displays the target <strong>Expected Output</strong> and current <strong>Buggy Output</strong> alongside the code snippet.</li>
                  <li><strong>Hard Question Hints:</strong> Hints are available ONLY on Hard questions. Unlocking a hint incurs a <strong>1 credit (-1 point) penalty</strong> per use. Repeated requests on the same Hard question cost an additional -1 point each.</li>
                  <li><strong>Anti-Cheat & Tab Monitoring:</strong> Leaving the exam window or switching tabs/apps records a security violation. 3 violations auto-terminates the attempt.</li>
                  <li><strong>Back-Button Protection:</strong> Pressing back prompts an abandonment confirmation dialog. Confirming will forfeit your attempt.</li>
                  <li><strong>Auto-Save:</strong> All selected answers are synchronized instantly to the server database in real time.</li>
                  <li><strong>Official Prizes:</strong> 1st Prize: ₹1,500/- Cash | 2nd Prize: ₹1,000/- Cash.</li>
                  <li><strong>Results Release:</strong> Scores are confidential and locked upon submission until the Event Host unlocks the public leaderboard.</li>
                </ol>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-white uppercase">Scoring Matrix (10 Questions / 15 Minutes — Max: 21 Pts):</div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold">3 Simple</span>: +1 correct, 0 wrong
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-blue-400 font-bold">3 Medium</span>: +2 correct, -0.5 wrong
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-purple-400 font-bold">4 Hard</span>: +3 correct, -1.0 wrong
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  playClickSound();
                  setShowRulesModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Understood & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
