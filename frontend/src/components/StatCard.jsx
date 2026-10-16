import React from 'react';

const StatCard = ({ title, value, unit = '', icon: Icon, color = 'neon', subtitle }) => {
  const colorThemes = {
    neon: {
      accent: 'border-t-[#39FF78]',
      icon: 'bg-[#39FF78]/15 text-[#39FF78] border-[#39FF78]/35 shadow-xs shadow-[#39FF78]/20',
      text: 'text-[#39FF78]'
    },
    emerald: {
      accent: 'border-t-[#00A86B]',
      icon: 'bg-[#00A86B]/20 text-[#00E599] border-[#00A86B]/35 shadow-xs shadow-[#00A86B]/20',
      text: 'text-[#00E599]'
    },
    blue: {
      accent: 'border-t-cyan-400',
      icon: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35',
      text: 'text-cyan-300'
    },
    indigo: {
      accent: 'border-t-teal-400',
      icon: 'bg-teal-500/15 text-teal-300 border-teal-500/35',
      text: 'text-teal-300'
    },
    amber: {
      accent: 'border-t-amber-400',
      icon: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
      text: 'text-amber-300'
    },
    rose: {
      accent: 'border-t-rose-500',
      icon: 'bg-rose-500/20 text-rose-300 border-rose-500/35',
      text: 'text-rose-300'
    },
  };

  const theme = colorThemes[color] || colorThemes.neon;

  return (
    <div className={`bg-[#0B1210]/85 backdrop-blur-xl rounded-2xl border border-[#39FF78]/15 border-t-2 ${theme.accent} p-5 shadow-xl shadow-[#030806]/60 hover:border-[#39FF78]/40 transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#F4FFF7] tracking-tight font-mono">
              {value}
            </span>
            {unit && <span className={`text-xs font-bold ${theme.text}`}>{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${theme.icon} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-3 pt-2 border-t border-[#39FF78]/10 text-[11px] font-medium text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
