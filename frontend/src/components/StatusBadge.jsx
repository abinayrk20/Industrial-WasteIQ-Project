import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  const badgeMap = {
    ACTIVE: 'bg-[#39FF78]/15 text-[#39FF78] border-[#39FF78]/40 shadow-xs shadow-[#39FF78]/10',
    INACTIVE: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
    IN_PROGRESS: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    COMPLETED: 'bg-[#39FF78]/15 text-[#39FF78] border-[#39FF78]/40',
    TODO: 'bg-slate-800/80 text-slate-300 border-slate-700',
    BLOCKED: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    APPROVED: 'bg-[#39FF78]/15 text-[#39FF78] border-[#39FF78]/40 shadow-xs shadow-[#39FF78]/10',
    REJECTED: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    CRITICAL: 'bg-rose-500/25 text-rose-300 border-rose-500/40 font-black',
    MEDIUM: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    LOW: 'bg-slate-800/60 text-slate-300 border-slate-700',
    RECYCLABLE: 'bg-[#39FF78]/15 text-[#39FF78] border-[#39FF78]/35 font-mono',
    REUSABLE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35 font-mono',
    HAZARDOUS: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-mono font-bold',
    NONE: 'bg-slate-800/60 text-slate-400 border-slate-700',
  };

  const styleClass = badgeMap[normalized] || 'bg-slate-800/70 text-slate-300 border-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider backdrop-blur-md ${styleClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
