import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Award,
  Crown,
  Flame,
  HelpCircle,
  Lock,
  Medal,
  RefreshCw,
  Search,
  Sparkles,
  Timer,
  Trophy,
  UserCheck,
  Users,
  Zap
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { playClickSound, playCorrectSound } from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

export function PublicLeaderboardScreen() {
  const [, setLocation] = useLocation();
  const [resultsReleased, setResultsReleased] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_participants: 0,
    completed_count: 0,
    average_correct: "0.0/10",
    average_difficulty_score: "0.0/21",
    average_time_formatted: "00:00"
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Self position search
  const [searchRoll, setSearchRoll] = useState("");
  const [userPosition, setUserPosition] = useState<any>(null);
  const [searchingUser, setSearchingUser] = useState(false);

  // Try auto-loading roll number from localStorage
  useEffect(() => {
    const savedRoll = localStorage.getItem("registered_roll_number") || localStorage.getItem("contest_roll_number");
    if (savedRoll && !searchRoll) {
      setSearchRoll(savedRoll.toUpperCase());
    }
  }, []);

  const fetchLeaderboard = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const params: any = {};
      if (searchRoll.trim()) {
        params.search_roll = searchRoll.trim().toUpperCase();
      }
      const res = await axios.get("/api/leaderboard", { params });
      if (res.data.success) {
        setResultsReleased(res.data.results_released);
        setLeaderboard(res.data.leaderboard || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (res.data.user_position) {
          setUserPosition(res.data.user_position);
        }
      }
    } catch {
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(() => fetchLeaderboard(false), 8000);
    return () => clearInterval(interval);
  }, [searchRoll]);

  const handleSearchMyRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) {
      toast.error("Please enter your Roll Number to check your ranking.");
      return;
    }
    setSearchingUser(true);
    playClickSound();
    try {
      const res = await axios.get("/api/leaderboard", {
        params: { search_roll: searchRoll.trim().toUpperCase() }
      });
      if (res.data.success && res.data.user_position) {
        playCorrectSound();
        setUserPosition(res.data.user_position);
        toast.success(`Position loaded for ${searchRoll.trim().toUpperCase()}`);
      } else {
        setUserPosition(null);
        toast.error(`No contest attempt record found for roll number ${searchRoll.trim().toUpperCase()}`);
      }
    } catch {
      toast.error("Failed to query contestant position.");
    } finally {
      setSearchingUser(false);
    }
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-6 select-none relative overflow-x-hidden">
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[32rem] h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl z-10 space-y-6">
        {/* University Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <PragatiLogo variant="stacked" size="lg" subtitleText="DEPARTMENT OF MECHANICAL ENGINEERING" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Official Competition Leaderboard · Debug The Code
          </div>
        </div>

        {/* Compact Statistics Header */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center space-y-0.5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-amber-400" /> Participants
            </span>
            <p className="text-lg font-black text-white font-mono">{stats.total_participants}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center space-y-0.5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-400" /> Completed
            </span>
            <p className="text-lg font-black text-emerald-400 font-mono">{stats.completed_count}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center space-y-0.5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Avg Score
            </span>
            <p className="text-lg font-black text-amber-400 font-mono">{stats.average_correct}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center space-y-0.5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-blue-400" /> Avg Difficulty
            </span>
            <p className="text-lg font-black text-blue-400 font-mono">{stats.average_difficulty_score}</p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center space-y-0.5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Timer className="w-3 h-3 text-purple-400" /> Avg Time
            </span>
            <p className="text-lg font-black text-purple-300 font-mono">{stats.average_time_formatted}</p>
          </div>
        </div>

        {/* Find Contestant's Own Position Widget */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" /> Find Your Position & Performance
              </h3>
              <p className="text-[11px] text-slate-400">
                Enter your roll number to securely check your live ranking, score, and difficulty points.
              </p>
            </div>

            <form onSubmit={handleSearchMyRank} className="flex items-center gap-2">
              <input
                type="text"
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value.toUpperCase())}
                placeholder="e.g. 25A31A0356"
                className="bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none uppercase tracking-wider w-40 sm:w-48"
              />
              <button
                type="submit"
                disabled={searchingUser || !searchRoll.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shrink-0"
              >
                {searchingUser ? "Finding..." : "Check"}
              </button>
            </form>
          </div>

          {/* User Rank Card */}
          {userPosition && (
            <div className="bg-slate-950/90 border-2 border-amber-500/40 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 items-center animate-in fade-in duration-300">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Your Position</span>
                <p className="text-xl font-black text-amber-400 font-mono">
                  {userPosition.rank === 1 ? "🥇 #1" : userPosition.rank === 2 ? "🥈 #2" : userPosition.rank === 3 ? "🥉 #3" : `#${userPosition.rank}`}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contestant</span>
                <p className="text-xs font-black text-white truncate">{userPosition.student_name}</p>
                <p className="text-[10px] font-mono text-slate-400">{userPosition.roll_number}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Correct Score</span>
                <p className="text-base font-black text-emerald-400 font-mono">
                  {userPosition.correct_count} / 10
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Difficulty Score</span>
                <p className="text-base font-black text-blue-400 font-mono">
                  {userPosition.difficulty_score} / 21
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Completion Time</span>
                <p className="text-base font-black text-purple-300 font-mono">
                  {userPosition.time_formatted}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Leaderboard
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              (Auto-updating every 8s)
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              fetchLeaderboard(true);
            }}
            disabled={refreshing}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-xs">
            Loading official leaderboard standings...
          </div>
        ) : !resultsReleased ? (
          /* Results Locked Confidential Notice */
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/20">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                🔒 Confidential Leaderboard
              </h2>
              <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                Live public rankings and participant scores are restricted.
              </p>
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                Official scores, rankings, and prize winners (1st Prize: ₹1,500/- | 2nd Prize: ₹1,000/-) will be released by the conducting committee during the valedictory session in MG-7 Core Block.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  setLocation("/register");
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Go to Registration
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setLocation("/contest");
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                Contest Mobile Entry
              </button>
            </div>
          </div>
        ) : (
          /* Results Released Table & Podium */
          <div className="space-y-6">
            {/* Top 3 Podium Cards */}
            {top1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* 2nd Place */}
                {top2 ? (
                  <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 text-center space-y-2 order-2 md:order-1 shadow-lg">
                    <div className="w-12 h-12 bg-slate-800 text-slate-200 rounded-2xl flex items-center justify-center mx-auto border border-slate-600 font-black text-2xl shadow">
                      🥈
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                      2nd Place · 2nd Prize (₹1,000/-)
                    </span>
                    <h3 className="text-sm font-black text-white truncate">{top2.student_name}</h3>
                    <p className="text-xs font-mono text-amber-400 font-bold">{top2.roll_number}</p>
                    <p className="text-[11px] text-slate-400">{top2.department}</p>
                    <div className="pt-2 grid grid-cols-3 gap-1 border-t border-slate-800 font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Score</span>
                        <strong className="text-emerald-400">{top2.correct_count}/10</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Difficulty</span>
                        <strong className="text-blue-400">{top2.difficulty_score}/21</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Time</span>
                        <strong className="text-purple-300">{top2.time_formatted}</strong>
                      </div>
                    </div>
                  </div>
                ) : <div className="hidden md:block order-1" />}

                {/* 1st Place (Champion) */}
                <div className="bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-2 border-amber-500 rounded-2xl p-6 text-center space-y-2 order-1 md:order-2 shadow-2xl scale-105">
                  <div className="w-14 h-14 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto font-black text-3xl shadow-lg">
                    👑
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded bg-amber-500 text-slate-950 uppercase tracking-wider">
                    🏆 1st Place Champion (₹1,500/-)
                  </span>
                  <h3 className="text-base font-black text-white truncate">{top1.student_name}</h3>
                  <p className="text-sm font-mono text-amber-300 font-black">{top1.roll_number}</p>
                  <p className="text-xs text-slate-300">{top1.department}</p>
                  <div className="pt-2 grid grid-cols-3 gap-1 border-t border-amber-500/30 font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-slate-300 uppercase block">Score</span>
                      <strong className="text-emerald-400 text-sm">{top1.correct_count}/10</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-300 uppercase block">Difficulty</span>
                      <strong className="text-amber-300 text-sm">{top1.difficulty_score}/21</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-300 uppercase block">Time</span>
                      <strong className="text-purple-300 text-sm">{top1.time_formatted}</strong>
                    </div>
                  </div>
                </div>

                {/* 3rd Place */}
                {top3 ? (
                  <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 text-center space-y-2 order-3 shadow-lg">
                    <div className="w-12 h-12 bg-slate-800 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-slate-600 font-black text-2xl shadow">
                      🥉
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-600/20 text-amber-500 border border-amber-600/30 uppercase">
                      3rd Place Rank
                    </span>
                    <h3 className="text-sm font-black text-white truncate">{top3.student_name}</h3>
                    <p className="text-xs font-mono text-amber-400 font-bold">{top3.roll_number}</p>
                    <p className="text-[11px] text-slate-400">{top3.department}</p>
                    <div className="pt-2 grid grid-cols-3 gap-1 border-t border-slate-800 font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Score</span>
                        <strong className="text-emerald-400">{top3.correct_count}/10</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Difficulty</span>
                        <strong className="text-blue-400">{top3.difficulty_score}/21</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Time</span>
                        <strong className="text-purple-300">{top3.time_formatted}</strong>
                      </div>
                    </div>
                  </div>
                ) : <div className="hidden md:block order-3" />}
              </div>
            )}

            {/* Complete Official Rankings Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Full Contest Standings
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {leaderboard.length} Contestants Ranked
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Rank</th>
                      <th className="p-3.5">Contestant</th>
                      <th className="p-3.5">Correct</th>
                      <th className="p-3.5">Difficulty Score</th>
                      <th className="p-3.5">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.rank}
                        className={`transition ${
                          searchRoll && entry.roll_number.includes(searchRoll.slice(-2))
                            ? "bg-amber-500/10 hover:bg-amber-500/20 font-bold"
                            : "hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="p-3.5 font-bold">
                          {entry.rank === 1 ? (
                            <span className="text-base text-amber-400 font-black">🥇 1</span>
                          ) : entry.rank === 2 ? (
                            <span className="text-base text-slate-200 font-black">🥈 2</span>
                          ) : entry.rank === 3 ? (
                            <span className="text-base text-amber-600 font-black">🥉 3</span>
                          ) : (
                            <span className="text-slate-400">#{entry.rank}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="font-sans font-medium text-slate-200">{entry.student_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{entry.roll_number} · {entry.department}</div>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-400 text-sm">
                          {entry.correct_count} / 10
                        </td>
                        <td className="p-3.5 font-bold text-blue-400 text-sm">
                          {entry.difficulty_score}
                          <span className="text-[10px] text-slate-500 font-normal"> / 21</span>
                        </td>
                        <td className="p-3.5 text-slate-300 font-bold">{entry.time_formatted}</td>
                      </tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 font-sans">
                          No ranked contestants yet. Contest in progress.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Ranking Policy Disclosure Footer */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3.5 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Official 4-Tier Tie-Breaker Ranking Policy:
          </p>
          <p className="leading-relaxed">
            1. <strong>Higher Correct Answers</strong> (out of 10) &nbsp;→&nbsp;
            2. <strong>Higher Difficulty-Weighted Score</strong> (Simple=1, Med=2, Hard=3, Max 21) &nbsp;→&nbsp;
            3. <strong>Lower Completion Time</strong> (MM:SS) &nbsp;→&nbsp;
            4. <strong>Earliest Server Submission Timestamp</strong>.
          </p>
        </div>

        <div className="text-center text-[11px] text-slate-500 pt-2 pb-6">
          Pragati University · Department of Mechanical Engineering · Engineers' Day 2026
        </div>
      </div>
    </div>
  );
}
