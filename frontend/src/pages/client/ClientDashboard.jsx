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
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
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
    { month: 'Month 1', progress: 15, output: 120 },
    { month: 'Month 2', progress: 32, output: 280 },
    { month: 'Month 3', progress: 48, output: 410 },
    { month: 'Month 4', progress: 68, output: 590 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Client Header Banner (Strictly Read Only) */}
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-sky-400">
                  Client Stakeholder Portal &bull; Verified Read-Only View
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {data?.project_name || 'Enterprise Project'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Site: {data?.site} &bull; Official progress tracking & approved regulatory documentation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>STRICT READ-ONLY</span>
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400">Loading client telemetry...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Overall Progress"
                  value={data?.progress_percentage || 0}
                  unit="%"
                  icon={TrendingUp}
                  color="emerald"
                  subtitle="Project completion rate"
                />
                <StatCard
                  title="Approved Output"
                  value={data?.total_approved_output || 0}
                  unit="units"
                  icon={FileCheck}
                  color="blue"
                  subtitle="Audited and sign-off granted"
                />
                <StatCard
                  title="Milestones Cleared"
                  value={data?.completed_milestones?.length || 0}
                  icon={CheckCircle2}
                  color="indigo"
                  subtitle="Key target deliverables"
                />
                <StatCard
                  title="Permitted Documents"
                  value={data?.documents?.length || 0}
                  icon={FolderLock}
                  color="amber"
                  subtitle="Blueprints & certificates"
                />
              </div>

              {/* Progress Chart & Milestones */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">Project Velocity Trendline</h2>
                      <p className="text-[11px] text-slate-400">Cumulative progress % over execution phases</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                        <YAxis stroke="#64748B" fontSize={11} unit="%" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="progress" name="Progress %" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#clientGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Cleared Milestones */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="pb-3 mb-4 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">Verified Milestones</h2>
                    <p className="text-[11px] text-slate-400">Completed phases signed off by engineering</p>
                  </div>

                  <div className="space-y-3">
                    {data?.completed_milestones?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No completed milestones yet.</p>
                    ) : (
                      data?.completed_milestones?.map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-xs font-bold text-slate-800">{m.task_name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block pl-6">
                            Cleared: {m.completed_date || m.assigned_date}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Approved Production Summary Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Approved Production Activity Records</h3>
                    <p className="text-xs text-slate-400">Only QC-approved and supervisor-verified records are displayed</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    VERIFIED COMPLIANT
                  </span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Audit Date</th>
                      <th className="px-5 py-3">Production Activity</th>
                      <th className="px-5 py-3">Verified Output</th>
                      <th className="px-5 py-3">Site / Unit</th>
                      <th className="px-5 py-3">Verification Status</th>
                      <th className="px-5 py-3">Executive Sign-Off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {data?.approved_activities?.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{r.date}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-800">{r.activity}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{r.quantity} {r.unit}</td>
                        <td className="px-5 py-3.5 text-slate-600">{r.project_name}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                        <td className="px-5 py-3.5 text-xs text-emerald-700 font-semibold">{r.approved_by_name || 'Executive Signoff'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
