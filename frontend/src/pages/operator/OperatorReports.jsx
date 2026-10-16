import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { FileText, TrendingUp, CheckCircle, Clock, Recycle, ShieldCheck } from 'lucide-react';

const OperatorReports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    operatorApi.getDashboard().then(setData).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#39FF78] animate-ping"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#39FF78]">
                Shift Segregation Ledger
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Shift Operations & Waste Performance Summary
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Personal reporting metrics for shift handovers, waste segregation throughput, and supervisor sign-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Verified Sign-Offs"
              value={data?.approved_activities || 0}
              icon={CheckCircle}
              color="neon"
              subtitle="Quality-approved waste batches"
            />
            <StatCard
              title="Assigned Work Orders"
              value={data?.total_assigned_tasks || 0}
              icon={TrendingUp}
              color="emerald"
              subtitle="Current operational queue"
            />
            <StatCard
              title="Assigned Terminal"
              value={data?.operator_id || 'IND-OP-0004'}
              icon={FileText}
              color="blue"
              subtitle={data?.department || 'Waste Processing'}
            />
          </div>

          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-6 shadow-xl shadow-[#030806]/70 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Recycle className="w-4 h-4 text-[#39FF78]" />
              <span>Shift Handover & EPA Waste Directives</span>
            </h3>
            <p className="leading-relaxed mb-4 text-slate-400">
              All segregated recyclable metals, chemical sludge neutralization logs, and physical test specimens must be recorded with exact tonnage and hazard ratings before shift conclusion. Incomplete tasks will automatically carry over to the subsequent shift operator under continuous chain-of-custody tracking.
            </p>
            <div className="p-3.5 bg-[#030806]/70 rounded-2xl border border-[#39FF78]/30 text-[#39FF78] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#39FF78] shrink-0" />
              <span>Operator Telemetry Validated & Compliant with EPA Tier-3 Directives.</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperatorReports;
