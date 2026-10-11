import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  const badgeMap = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    TODO: 'bg-slate-100 text-slate-700 border-slate-200',
    BLOCKED: 'bg-rose-50 text-rose-700 border-rose-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
    LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const styleClass = badgeMap[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styleClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
