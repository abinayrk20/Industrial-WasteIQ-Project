import React from 'react';

const StatCard = ({ title, value, unit = '', icon: Icon, color = 'emerald', subtitle }) => {
  const colorThemes = {
    emerald: {
      accent: 'border-t-emerald-500',
      icon: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    blue: {
      accent: 'border-t-blue-500',
      icon: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    indigo: {
      accent: 'border-t-indigo-500',
      icon: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    amber: {
      accent: 'border-t-amber-500',
      icon: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    rose: {
      accent: 'border-t-rose-500',
      icon: 'bg-rose-50 text-rose-600 border-rose-200',
    },
  };

  const theme = colorThemes[color] || colorThemes.emerald;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 border-t-2 ${theme.accent} p-5 shadow-xs hover:shadow-md transition-all group`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
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
        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
