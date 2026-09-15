import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  UserCheck,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Award,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Download,
  Flame
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { playClickSound, playCorrectSound, playErrorSound } from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

export function RegistrationScreen() {
  const [, setLocation] = useLocation();
  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState("Mechanical Engineering");
  const [year, setYear] = useState("2nd Year");
  const [section, setSection] = useState("A");
  const [loading, setLoading] = useState(false);
  const [registeredSlip, setRegisteredSlip] = useState<any>(null);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);

  // Auto-uppercase roll number
  const handleRollChange = (val: string) => {
    setRollNumber(val.toUpperCase().replace(/[^A-Z0-9]/g, ""));
    setDuplicateMessage(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || !studentName.trim()) {
      playErrorSound();
      toast.error("Please enter both Roll Number and Full Name.");
      return;
    }

    setLoading(true);
    setDuplicateMessage(null);

    try {
      const res = await axios.post("/api/register", {
        roll_number: rollNumber.trim().toUpperCase(),
        student_name: studentName.trim(),
        department,
        year,
        section,
      });

      if (res.data.success) {
        playCorrectSound();
        setRegisteredSlip(res.data.registration);
        toast.success("Registration Successful!");
      }
    } catch (err: any) {
      playErrorSound();
      const msg = err.response?.data?.message || "Registration failed. Please check your details.";
      if (msg.includes("already registered")) {
        setDuplicateMessage("You are already registered for this contest.");
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10 space-y-6">
        {/* University Official Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <PragatiLogo variant="stacked" size="lg" subtitleText="DEPARTMENT OF MECHANICAL ENGINEERING" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Official Contestant Registration Portal
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Engineering Olympics 2026
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> 16 Sep 2026, 2:00 PM
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> MG-7 Core Block
            </span>
          </div>
        </div>

        {!registeredSlip ? (
          /* Registration Form Card */
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                Contestant Registration
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your official student credentials to register for the <strong>Debug The Code</strong> competition.
              </p>
            </div>

            {duplicateMessage && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-300 text-sm">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{duplicateMessage}</p>
                  <p className="text-xs text-amber-400/80 mt-1">
                    Your registration is already confirmed. Please wait for the host to display the official QR code to start the contest.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Roll Number Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Roll Number / Student ID <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => handleRollChange(e.target.value)}
                    placeholder="e.g. 25A31A0356"
                    maxLength={15}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-base font-mono tracking-widest placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase transition"
                  />
                  {rollNumber.length >= 6 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      FORMAT VALID
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Example: 25A31A0356, 25ME1A0388 (Unique identity for this contest)
                </p>
              </div>

              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Student Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. K. Sai Praneeth"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                >
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                  <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                  <option value="Information Technology (IT)">Information Technology (IT)</option>
                  <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Robotics & Automation">Robotics & Automation</option>
                </select>
              </div>

              {/* Year & Section Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>Registering Contestant...</>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" /> Complete Registration
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center">
              <button
                onClick={() => {
                  playClickSound();
                  setLocation("/contest");
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 transition"
              >
                Already registered? Proceed to QR / Roll Entry <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Registration Success Slip */
          <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
                REGISTRATION SUCCESSFUL
              </h2>
              <p className="text-xs sm:text-sm text-amber-300 font-medium">
                Please wait for the host to provide the contest QR code.
              </p>
            </div>

            {/* Official Confirmation Badge */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">REGISTRATION ID:</span>
                <span className="text-amber-400 font-bold">{registeredSlip.registration_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">ROLL NUMBER:</span>
                <span className="text-white font-bold tracking-wider">{registeredSlip.roll_number}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">STUDENT NAME:</span>
                <span className="text-white">{registeredSlip.student_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">DEPARTMENT:</span>
                <span className="text-slate-300">{registeredSlip.department} ({registeredSlip.year}, Sec {registeredSlip.section})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">STATUS:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ELIGIBLE FOR CONTEST
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  playClickSound();
                  setLocation(`/contest`);
                }}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4" /> Enter Contest Portal
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setRegisteredSlip(null);
                  setRollNumber("");
                  setStudentName("");
                }}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Register another contestant
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          Pragati University · Department of Mechanical Engineering · Engineers' Day 2026
        </div>
      </div>
    </div>
  );
}
