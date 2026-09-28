import React from "react";

interface PragatiLogoProps {
  className?: string;
  variant?: "header" | "stacked" | "emblem" | "compact" | "badge";
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  subtitleText?: string;
  theme?: "dark" | "light" | "gold";
}

export const PragatiLogo: React.FC<PragatiLogoProps> = ({
  className = "",
  variant = "header",
  size = "md",
  showSubtitle = true,
  subtitleText = "DEPARTMENT OF MECHANICAL ENGINEERING",
  theme = "dark"
}) => {
  // Emblem image size mappings
  const emblemSizes = {
    sm: "w-9 h-9 sm:w-10 sm:h-10",
    md: "w-12 h-12 sm:w-14 sm:h-14",
    lg: "w-16 h-16 sm:w-20 sm:h-20",
    xl: "w-20 h-20 sm:w-24 sm:h-24"
  };

  // Title typography sizes
  const titleSizes = {
    sm: "text-base sm:text-lg tracking-wider",
    md: "text-xl sm:text-2xl md:text-[26px] tracking-wider",
    lg: "text-2xl sm:text-3xl md:text-4xl tracking-wider",
    xl: "text-3xl sm:text-4xl md:text-5xl tracking-wide"
  };

  // Subtitle / "UNIVERSITY" typography sizes
  const uniSizes = {
    sm: "text-[9px] tracking-[0.25em]",
    md: "text-[11px] sm:text-xs tracking-[0.3em]",
    lg: "text-xs sm:text-sm tracking-[0.35em]",
    xl: "text-sm sm:text-base tracking-[0.4em]"
  };

  // Emblem Only Variant
  if (variant === "emblem") {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-white p-0.5 border-2 border-amber-400 shadow-lg shadow-amber-500/20 overflow-hidden ${className}`}>
        <img
          src="/pragati_crest.jpg"
          alt="Pragati University Crest"
          className={`${emblemSizes[size]} object-cover rounded-full`}
        />
      </div>
    );
  }

  // Stacked / Centered Hero Variant
  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center space-y-3 ${className}`}>
        {/* Standalone Cut Official Emblem */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-white p-1 rounded-full border-2 border-amber-400 shadow-2xl shadow-amber-500/25 overflow-hidden">
            <img
              src="/pragati_crest.jpg"
              alt="Pragati University Crest"
              className={`${emblemSizes[size]} object-cover rounded-full transition-transform duration-300 group-hover:scale-105`}
            />
          </div>
        </div>

        {/* Live Serif Typography Formatted in HTML/CSS */}
        <div className="space-y-0.5">
          <div className={`font-cinzel font-black uppercase text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] ${titleSizes[size]}`}>
            PRAGATI
          </div>
          <div className={`font-cinzel font-bold text-amber-400 uppercase flex items-center justify-center gap-2 ${uniSizes[size]}`}>
            <span className="text-amber-500/90 text-xs">―</span>
            <span>UNIVERSITY</span>
            <span className="text-amber-500/90 text-xs">―</span>
          </div>
          {showSubtitle && subtitleText && (
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase pt-1.5 font-mono">
              {subtitleText}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact Badge Variant
  if (variant === "compact" || variant === "badge") {
    return (
      <div className={`inline-flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-md ${className}`}>
        <div className="rounded-full bg-white p-0.5 border border-amber-400 shrink-0 overflow-hidden">
          <img
            src="/pragati_crest.jpg"
            alt="Pragati University Crest"
            className="w-7 h-7 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-cinzel font-black text-xs text-white tracking-wider leading-none">
            PRAGATI
          </span>
          <span className="font-cinzel font-bold text-[8px] text-amber-400 tracking-[0.2em] leading-tight">
            ― UNIVERSITY ―
          </span>
        </div>
      </div>
    );
  }

  // Default: Header Horizontal Layout
  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 text-left ${className}`}>
      {/* Standalone Cut Official Emblem */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/50 via-yellow-400/30 to-amber-500/40 rounded-full blur-sm opacity-80 group-hover:opacity-100 transition duration-300"></div>
        <div className="relative p-0.5 rounded-full bg-white border-2 border-amber-400 shadow-xl shadow-amber-500/20 overflow-hidden flex items-center justify-center">
          <img
            src="/pragati_crest.jpg"
            alt="Pragati University Crest"
            className={`${emblemSizes[size]} object-cover rounded-full transition-transform duration-300 group-hover:scale-105`}
          />
        </div>
      </div>

      {/* Official Serif Typography Formatted in HTML/CSS */}
      <div className="flex flex-col justify-center">
        <div className={`font-cinzel font-black uppercase text-white leading-none ${titleSizes[size]}`}>
          PRAGATI
        </div>
        <div className={`font-cinzel font-bold text-amber-400 uppercase flex items-center gap-1.5 leading-tight pt-1 ${uniSizes[size]}`}>
          <span className="text-amber-500/90 text-[10px]">―</span>
          <span>UNIVERSITY</span>
          <span className="text-amber-500/90 text-[10px]">―</span>
        </div>
        {showSubtitle && subtitleText && (
          <div className="hidden sm:block text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase pt-1 font-mono">
            {subtitleText}
          </div>
        )}
      </div>
    </div>
  );
};
