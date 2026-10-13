import React from 'react';

export const WasteIQLogo = ({ size = 'md', showText = true, subtitle = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* High-Tech Industrial Hexagonal Waste-IQ Emblem */}
      <div className={`relative flex items-center justify-center ${iconSizes[size] || iconSizes.md} shrink-0`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-amber-500/20 to-teal-400/30 blur-lg rounded-full" />

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_4px_12px_rgba(16,185,129,0.35)]"
        >
          <defs>
            <linearGradient id="wiq-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="wiq-gradient-glow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="wiq-hex-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
            </linearGradient>
            <filter id="wiq-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10B981" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Outer Industrial Hexagon Frame */}
          <polygon
            points="50,4 90,26 90,74 50,96 10,74 10,26"
            fill="url(#wiq-hex-fill)"
            stroke="url(#wiq-gradient-primary)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Geometric Shield Accent */}
          <polygon
            points="50,14 82,32 82,68 50,86 18,68 18,32"
            fill="none"
            stroke="#334155"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />

          {/* Smart Recycling Loop + Industrial Telemetry Möbius Nodes */}
          {/* Arrow 1 - Top Right to Bottom */}
          <path
            d="M 50,22 C 68,22 75,32 75,44 C 75,54 68,62 58,68"
            stroke="url(#wiq-gradient-primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Arrow 2 - Bottom Left Loop */}
          <path
            d="M 44,78 C 30,76 25,66 25,54 C 25,42 32,32 44,26"
            stroke="url(#wiq-gradient-glow)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Center IQ Intelligence Lightning Node */}
          <polygon
            points="54,26 42,48 52,48 46,74 62,46 51,46"
            fill="url(#wiq-gradient-primary)"
            filter="url(#wiq-shadow)"
          />

          {/* AI Neural Sensor Satellites (Industrial IoT nodes) */}
          <circle cx="50" cy="14" r="3" fill="#10B981" />
          <circle cx="82" cy="68" r="3" fill="#F59E0B" />
          <circle cx="18" cy="68" r="3" fill="#06B6D4" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-tight flex items-baseline font-['Plus_Jakarta_Sans',sans-serif] ${textSizes[size] || textSizes.md}`}>
            <span className="text-white drop-shadow-sm">Waste</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 ml-0.5">
              -IQ
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1 animate-pulse" />
          </div>
          {subtitle && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5">
              Industrial AI Management
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WasteIQLogo;
