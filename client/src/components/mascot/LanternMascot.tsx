import React from "react";

export type MascotMood = "idle" | "happy" | "thinking" | "gentle" | "celebrate";

interface LanternMascotProps {
  mood?: MascotMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  speech?: string;
}

export const LanternMascot: React.FC<LanternMascotProps> = ({
  mood = "idle",
  size = "md",
  className = "",
  speech,
}) => {
  const sizeMap = {
    sm: "w-10 h-12",
    md: "w-16 h-20",
    lg: "w-24 h-28",
    xl: "w-32 h-36",
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {speech && (
        <div className="mb-2 max-w-[200px] rounded-2xl bg-card border-2 border-primary/20 px-3 py-1.5 text-xs text-foreground font-medium shadow-sm animate-pop text-center relative">
          {speech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r-2 border-b-2 border-primary/20 rotate-45" />
        </div>
      )}

      <div className={`relative ${sizeMap[size]} transition-transform duration-300`}>
        {/* Ambient flame glow */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-70 transition-all duration-500 ${
            mood === "celebrate" || mood === "happy"
              ? "bg-amber-300/80 scale-125"
              : "bg-amber-400/50 scale-100"
          }`}
        />

        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-md"
          role="img"
          aria-label={`Noor the lantern mascot (${mood})`}
        >
          {/* Top hanging ring */}
          <circle
            cx="50"
            cy="12"
            r="8"
            stroke="#92400E"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Top brass dome */}
          <path
            d="M28 32 C28 20 72 20 72 32 Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="2.5"
          />
          <rect x="42" y="18" width="16" height="5" rx="2" fill="#B45309" />

          {/* Lantern glass body */}
          <path
            d="M30 32 L22 84 C22 92 78 92 78 84 L70 32 Z"
            fill="url(#glassGrad)"
            stroke="#B45309"
            strokeWidth="2.5"
          />

          {/* Brass vertical ribs */}
          <line x1="38" y1="33" x2="33" y2="84" stroke="#D97706" strokeWidth="1.5" opacity="0.6" />
          <line x1="62" y1="33" x2="67" y2="84" stroke="#D97706" strokeWidth="1.5" opacity="0.6" />

          {/* Bottom brass base */}
          <path
            d="M20 84 C20 84 20 98 50 98 C80 98 80 84 80 84 Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="2.5"
          />
          <rect x="36" y="98" width="28" height="6" rx="3" fill="#B45309" />

          {/* Inner gentle living flame */}
          <g className={mood === "celebrate" ? "animate-bounce" : ""}>
            <ellipse
              cx="50"
              cy="62"
              rx={mood === "celebrate" ? 18 : 14}
              ry={mood === "celebrate" ? 22 : 18}
              fill="url(#flameGrad)"
            />
            <ellipse cx="50" cy="65" rx="8" ry="11" fill="#FEF08A" />
          </g>

          {/* Face expressions inside flame */}
          {mood === "idle" && (
            <g>
              {/* Calm eyes */}
              <circle cx="44" cy="58" r="2.8" fill="#78350F" />
              <circle cx="56" cy="58" r="2.8" fill="#78350F" />
              <circle cx="45" cy="57" r="0.9" fill="#FFFFFF" />
              <circle cx="57" cy="57" r="0.9" fill="#FFFFFF" />
              {/* Sweet smile */}
              <path d="M46 64 Q50 67 54 64" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              {/* Rosy cheeks */}
              <circle cx="40" cy="63" r="2" fill="#FCA5A5" opacity="0.7" />
              <circle cx="60" cy="63" r="2" fill="#FCA5A5" opacity="0.7" />
            </g>
          )}

          {mood === "happy" && (
            <g>
              {/* Joyful arched eyes ^^ */}
              <path d="M41 59 Q44 54 47 59" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M53 59 Q56 54 59 59" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              {/* Big cheerful open smile */}
              <path d="M45 63 Q50 69 55 63 Z" fill="#991B1B" />
              {/* Rosy cheeks */}
              <circle cx="39" cy="63" r="2.5" fill="#F87171" opacity="0.8" />
              <circle cx="61" cy="63" r="2.5" fill="#F87171" opacity="0.8" />
            </g>
          )}

          {mood === "celebrate" && (
            <g>
              {/* Star-lit happy eyes */}
              <path d="M41 58 Q44 53 47 58" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M53 58 Q56 53 59 58" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M44 63 Q50 71 56 63 Z" fill="#991B1B" />
              <circle cx="38" cy="62" r="3" fill="#F87171" opacity="0.9" />
              <circle cx="62" cy="62" r="3" fill="#F87171" opacity="0.9" />
              {/* Little golden star sparkles */}
              <path d="M26 40 L28 44 L32 44 L29 47 L30 51 L26 48 L22 51 L23 47 L20 44 L24 44 Z" fill="#F59E0B" />
              <path d="M74 38 L75.5 41 L79 41 L76.5 43.5 L77.5 47 L74 45 L70.5 47 L71.5 43.5 L69 41 L72.5 41 Z" fill="#F59E0B" />
            </g>
          )}

          {mood === "thinking" && (
            <g>
              {/* Curious looking-up eyes */}
              <circle cx="45" cy="56" r="3" fill="#78350F" />
              <circle cx="57" cy="56" r="3" fill="#78350F" />
              <circle cx="47" cy="54" r="1.1" fill="#FFFFFF" />
              <circle cx="59" cy="54" r="1.1" fill="#FFFFFF" />
              {/* Thinking 'o' mouth */}
              <ellipse cx="51" cy="65" rx="2" ry="2.5" fill="#78350F" />
            </g>
          )}

          {mood === "gentle" && (
            <g>
              {/* Gentle supportive eyes */}
              <circle cx="44" cy="58" r="2.8" fill="#78350F" />
              <circle cx="56" cy="58" r="2.8" fill="#78350F" />
              <circle cx="45" cy="57" r="1" fill="#FFFFFF" />
              <circle cx="57" cy="57" r="1" fill="#FFFFFF" />
              {/* Soft supportive smile */}
              <path d="M46 64 Q50 67 54 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="40" cy="63" r="2" fill="#FCA5A5" opacity="0.8" />
              <circle cx="60" cy="63" r="2" fill="#FCA5A5" opacity="0.8" />
            </g>
          )}

          {/* Gradients */}
          <defs>
            <radialGradient id="flameGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.45" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
