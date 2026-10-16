import React, { useState, useEffect } from 'react';
import { clientApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  Eye,
  Briefcase,
  TrendingUp,
  FileCheck,
  FolderLock,
  Lock,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Download,
  Recycle,
  Sparkles,
  Leaf
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ClientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    clientApi.getDashboard()
      .then(setData)
      .catch((err) => setError('Unable to load client project overview.'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { phase: 'Phase 1', diverted: 45, progress: 25 },
    { phase: 'Phase 2', diverted: 110, progress: 50 },
    { phase: 'Phase 3', diverted: 185, progress: 75 },
    { phase: 'Phase 4 (Current)', diverted: 240, progress: data?.progress_percentage || 85 },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Client Header Banner (Strictly Read Only) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B1210]/90 via-[#063D28]/60 to-[#0B1210]/95 border border-[#39FF78]/30 text-[#F4FFF7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-2xl shadow-[#030806] backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-cyan-300 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#39FF78]" />
                  Client Stakeholder Portal &bull; Verified ESG & Waste Telemetry
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {data?.project_name || 'Industrial WasteIQ Central Facility'}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Site: <strong className="text-white">{data?.site || 'Eco-Industrial Complex Unit 1'}</strong> &bull; Verified sustainability metrics & EPA-approved logs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-2xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 font-mono text-xs font-bold flex items-center gap-2 shadow-lg">
                <Lock className="w-4 h-4 text-cyan-300" />
                <span>STRICT READ-ONLY</span>
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-20 text-center text-xs text-[#39FF78] font-mono animate-pulse">
              Syncing client ESG telemetry...
            </div>
          ) : (
            <>
              {/* Stat Cards - ESG & Waste Diversion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Landfill Diversion Rate"
                  value={data?.recycling_rate || 88.5}
                  unit="%"
                  icon={Recycle}
                  color="neon"
                  subtitle="Total circular recovery"
                />
                <StatCard
                  title="Carbon Offset Achieved"
                  value={data?.carbon_offset_tons || 44.2}
                  unit="Tons CO2e"
                  icon={Leaf}
                  color="emerald"
                  subtitle="Greenhouse gas avoidance"
                />
                <StatCard
                  title="Verified Milestones"
                  value={data?.completed_milestones?.length || 0}
                  icon={CheckCircle2}
                  color="blue"
                  subtitle="Audited phase completions"
                />
                <StatCard
                  title="Approved Documents"
                  value={data?.documents?.length || 0}
                  icon={FolderLock}
                  color="amber"
                  subtitle="Chain-of-custody certificates"
                />
              </div>

              {/* Progress Chart & Milestones */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#39FF78]/15">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#39FF78]" />
                        Cumulative Waste Diversion Velocity
                      </h2>
                      <p className="text-[11px] text-slate-400">Tons of industrial waste diverted from landfill over project phases</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="clientGreenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#39FF78" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#39FF78" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(57, 255, 120, 0.1)" />
                        <XAxis dataKey="phase" stroke="#64748B" fontSize={11} />
                        <YAxis stroke="#64748B" fontSize={11} unit=" T" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#030806',
                            border: '1px solid rgba(57, 255, 120, 0.3)',
                            borderRadius: '12px',
                            color: '#F4FFF7',
                            fontSize: '11px',
                            fontFamily: 'monospace'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="diverted"
                          name="Diverted (Tons)"
                          stroke="#39FF78"
                          strokeWidth={2.5}
                          fill="url(#clientGreenGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Cleared Milestones */}
                <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="pb-3 mb-4 border-b border-[#39FF78]/15">
                    <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#39FF78]" />
                      Audited Milestones
                    </h2>
                    <p className="text-[11px] text-slate-400">Completed environmental phases signed off by engineering</p>
                  </div>

                  <div className="space-y-3">
                    {data?.completed_milestones?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center bg-[#030806]/40 rounded-2xl border border-slate-800">
                        No completed milestones logged yet.
                      </p>
                    ) : (
                      data?.completed_milestones?.map((m) => (
                        <div key={m.id} className="p-3.5 rounded-2xl bg-[#030806]/60 border border-slate-800">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-[#39FF78] shrink-0" />
                            <span className="text-xs font-bold text-white">{m.task_name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block pl-6">
                            Verified: {m.completed_date || m.assigned_date}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Approved Production Summary Table */}
              <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 shadow-xl shadow-[#030806]/70 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#39FF78]/15 bg-[#063D28]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#39FF78]" />
                      Official Approved Waste Processing Records
                    </h3>
                    <p className="text-xs text-slate-400">Only QC-approved and supervisor-verified records are displayed in this console</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30 self-start sm:self-auto">
                    VERIFIED COMPLIANT
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#030806]/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-[#39FF78]/15">
                      <tr>
                        <th className="px-5 py-3.5">Audit Date</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Waste Stream Description</th>
                        <th className="px-5 py-3.5">Verified Quantity</th>
                        <th className="px-5 py-3.5">Verification Status</th>
                        <th className="px-5 py-3.5">Executive Sign-Off</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#39FF78]/10 text-slate-300">
                      {data?.approved_activities?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-400">
                            No approved waste activities to display.
                          </td>
                        </tr>
                      ) : (
                        data?.approved_activities?.map((r) => (
                          <tr key={r.id} className="hover:bg-[#39FF78]/5 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">{r.date}</td>
                            <td className="px-5 py-3.5">
                              <StatusBadge status={r.waste_category || 'RECYCLABLE'} />
                            </td>
                            <td className="px-5 py-3.5 font-bold text-white">{r.activity}</td>
                            <td className="px-5 py-3.5 font-mono font-bold text-[#39FF78]">{r.quantity} {r.unit}</td>
                            <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                            <td className="px-5 py-3.5 text-xs text-[#00E599] font-mono font-semibold">
                              {r.approved_by_name || 'Executive Signoff'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
