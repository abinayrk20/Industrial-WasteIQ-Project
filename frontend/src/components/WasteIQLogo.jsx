import React from 'react';

export const WasteIQLogo = ({ size = 'md', showText = true, subtitle = true, className = '', textClassName = '' }) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Exact Green Gear-and-Leaf Emblem from Reference Design */}
      <div className={`relative flex items-center justify-center ${iconSizes[size] || iconSizes.md} shrink-0`}>
        {/* Neon Ambient Glow */}
        <div className="absolute inset-0 bg-[#39FF78]/25 rounded-full blur-md animate-pulse" />
        
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(57,255,120,0.6)]"
        >
          <defs>
            <linearGradient id="gear-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39FF78" />
              <stop offset="50%" stopColor="#00A86B" />
              <stop offset="100%" stopColor="#063D28" />
            </linearGradient>

            <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39FF78" />
              <stop offset="80%" stopColor="#00E676" />
              <stop offset="100%" stopColor="#00A86B" />
            </linearGradient>

            <linearGradient id="inner-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#030806" />
              <stop offset="100%" stopColor="#0B1210" />
            </linearGradient>

            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#39FF78" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. Industrial Gear / Cogwheel Base */}
          {/* 10-tooth Precision Mechanical Gear Silhouette */}
          <path
            d="M50 8 L54 8 L56 16 C59 17 62 18 64 20 L72 17 L75 20 L72 28 C74 30 75 33 76 36 L84 38 L84 42 L76 44 C75 47 74 50 72 52 L75 60 L72 63 L64 60 C62 62 59 63 56 64 L54 72 L50 72 L46 64 C43 63 40 62 38 60 L30 63 L27 60 L30 52 C28 50 27 47 26 44 L18 42 L18 38 L26 36 C27 33 28 30 30 28 L27 20 L30 17 L38 20 C40 18 43 17 46 16 Z"
            fill="url(#gear-grad)"
            transform="scale(1.25) translate(-10, -5)"
          />

          {/* Central Dark Void / Core Circle */}
          <circle cx="50" cy="50" r="32" fill="url(#inner-dark)" stroke="#39FF78" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* 2. Precision Curved Eco-Leaf Emblem inside Gear Core */}
          {/* Leaf Body */}
          <path
            d="M36 64 C32 50 36 34 52 26 C64 34 68 46 62 58 C56 68 44 70 36 64 Z"
            fill="url(#leaf-grad)"
            filter="url(#neon-glow)"
          />

          {/* Leaf Central Vein (Dark cut) */}
          <path
            d="M36 64 Q46 50 52 26"
            stroke="#030806"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Subtle Secondary Veins */}
          <path
            d="M44 48 Q48 44 54 46"
            stroke="#030806"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <path
            d="M41 55 Q47 53 52 56"
            stroke="#030806"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />

          {/* Futuristic Tech Dots on Gear Periphery */}
          <circle cx="50" cy="14" r="1.5" fill="#39FF78" />
          <circle cx="82" cy="38" r="1.5" fill="#39FF78" />
          <circle cx="72" cy="74" r="1.5" fill="#39FF78" />
          <circle cx="28" cy="74" r="1.5" fill="#39FF78" />
          <circle cx="18" cy="38" r="1.5" fill="#39FF78" />
        </svg>
      </div>

      {/* Brand Typography matching reference design exactly */}
      {showText && (
        <div className={`flex flex-col ${textClassName}`}>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#F4FFF7] uppercase font-mono opacity-90">
              Industrial
            </span>
            <div className={`font-black tracking-tight ${textSizes[size] || textSizes.md} flex items-center`}>
              <span className="text-[#39FF78] drop-shadow-[0_0_8px_rgba(57,255,120,0.5)]">Waste</span>
              <span className="text-[#F4FFF7]">IQ</span>
            </div>
          </div>
          {subtitle && (
            <span className="text-[10px] sm:text-[11px] font-medium text-[#8FA89B] tracking-tight mt-0.5 leading-snug">
              Smarter Waste Management for a Cleaner Tomorrow
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WasteIQLogo;
