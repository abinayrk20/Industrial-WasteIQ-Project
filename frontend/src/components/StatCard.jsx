import React from 'react';

const StatCard = ({ title, value, unit = '', icon: Icon, color = 'emerald', subtitle }) => {
  const colorThemes = {
    emerald: {
      accent: 'border-t-emerald-500',
      icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    blue: {
      accent: 'border-t-cyan-500',
      icon: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    indigo: {
      accent: 'border-t-indigo-500',
      icon: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    },
    amber: {
      accent: 'border-t-amber-500',
      icon: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    rose: {
      accent: 'border-t-rose-500',
      icon: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
  };

  const theme = colorThemes[color] || colorThemes.emerald;

  return (
    <div className={`bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/90 border-t-2 ${theme.accent} p-5 shadow-xl hover:border-slate-700 transition-all group`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white tracking-tight font-mono">
              {value}
            </span>
            {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${theme.icon} shadow-xs group-hover:scale-105 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-medium text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
