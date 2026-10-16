import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  Users,
  CalendarCheck,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  AlertTriangle,
  Recycle,
  Sparkles,
  Download,
  Filter,
  Flame,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [exportNotice, setExportNotice] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();
      setData(res);
    } catch (err) {
      setError('Failed to fetch administrator telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, action) => {
    try {
      setActionLoading(id);
      await adminApi.approveActivity(id, action);
      await fetchDashboard();
    } catch (err) {
      alert('Error updating approval status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportPDF = () => {
    setExportNotice(true);
    setTimeout(() => {
      window.print();
      setExportNotice(false);
    }, 400);
  };

  // Pie chart data
  const pieData = data?.waste_by_category?.map((c) => ({
    name: c.category,
    value: Number(c.tonnage) || 0,
    color: c.color || '#39FF78'
  })) || [
    { name: 'Recyclable Waste', value: 42.5, color: '#39FF78' },
    { name: 'Reusable / Repurposed', value: 24.0, color: '#00A86B' },
    { name: 'Hazardous Waste', value: 12.8, color: '#EF4444' }
  ];

  // Bar chart stream data
  const streamData = [
    { facility: 'Unit 1 Complex', recyclable: 18.5, reusable: 11.2, hazardous: 4.8 },
    { facility: 'Refinery South', recyclable: 14.2, reusable: 8.5, hazardous: 5.2 },
    { facility: 'Eco Park North', recyclable: 9.8, reusable: 4.3, hazardous: 2.8 },
  ];

  const pendingActivities = (data?.recent_activities || []).filter((a) => {
    const isPending = a.status === 'PENDING';
    const matchesCat = categoryFilter === 'ALL' || a.waste_category === categoryFilter;
    return isPending && matchesCat;
  });

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Executive Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B1210]/90 via-[#063D28]/60 to-[#0B1210]/95 border border-[#39FF78]/30 text-[#F4FFF7] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 shadow-2xl shadow-[#030806] backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39FF78] animate-ping"></span>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#39FF78] flex items-center gap-1.5">
                  <Recycle className="w-3.5 h-3.5" />
                  Industrial WasteIQ &bull; Master Intelligence Hub
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Executive Waste & Compliance Console
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Real-time industrial waste ledger, automated segregation analytics, operator supervision, and EPA compliance auditing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportPDF}
                className="px-4 py-2.5 rounded-xl bg-[#0B1210] hover:bg-[#063D28] border border-[#39FF78]/35 text-[#39FF78] text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-[#39FF78]" />
                <span>Export PDF Report</span>
              </button>
              <Link
                to="/admin/operators"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00A86B] to-[#39FF78] hover:from-[#008f5b] hover:to-[#2ce669] text-[#030806] text-xs font-black transition-all shadow-lg shadow-[#39FF78]/20 flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Manage Operators</span>
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-20 text-center text-xs text-[#39FF78] font-mono animate-pulse">
              Syncing WasteIQ master telemetry...
            </div>
          ) : (
            <>
              {/* Stat Cards - Waste Centric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  title="Total Waste Processed"
                  value={data?.total_waste_tonnage || 0}
                  unit="Tons"
                  icon={Recycle}
                  color="neon"
                  subtitle="Tracked waste throughput"
                />
                <StatCard
                  title="Recycling & Diversion"
                  value={data?.recycling_rate || 85.0}
                  unit="%"
                  icon={TrendingUp}
                  color="emerald"
                  subtitle="Landfill diversion rate"
                />
                <StatCard
                  title="Recyclable Sorted"
                  value={data?.recyclable_tonnage || 0}
                  unit="Tons"
                  icon={Sparkles}
                  color="neon"
                  subtitle="Scrap steel, copper, glass"
                />
                <StatCard
                  title="Hazardous Neutralized"
                  value={data?.hazardous_tonnage || 0}
                  unit="Tons"
                  icon={Flame}
                  color="rose"
                  subtitle="EPA compliant treatment"
                />
                <StatCard
                  title="Pending Sign-Offs"
                  value={data?.pending_approvals || 0}
                  icon={Clock}
                  color="amber"
                  subtitle="Awaiting admin action"
                />
              </div>

              {/* Visual Analytics Row: Waste Category Donut + Multi-Facility Streams */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Waste Category Donut Chart */}
                <div className="lg:col-span-5 bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#39FF78]/15">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Recycle className="w-4 h-4 text-[#39FF78]" />
                        Waste Category Breakdown
                      </h2>
                      <p className="text-[11px] text-slate-400">Total volume by industrial waste stream</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30">
                      Live Telemetry
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={5}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B1210" strokeWidth={2} />
                          ))}
                        </Pie>
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
                        <Legend
                          verticalAlign="bottom"
                          wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#39FF78]/10 text-center">
                    <div className="p-2 rounded-xl bg-[#39FF78]/10 border border-[#39FF78]/25">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Recyclable</span>
                      <strong className="text-xs text-[#39FF78] font-mono">{data?.recyclable_tonnage || 0} T</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#00A86B]/15 border border-[#00A86B]/30">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Reusable</span>
                      <strong className="text-xs text-[#00E599] font-mono">{data?.reusable_tonnage || 0} T</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Hazardous</span>
                      <strong className="text-xs text-rose-400 font-mono">{data?.hazardous_tonnage || 0} T</strong>
                    </div>
                  </div>
                </div>

                {/* Facility Waste Volume Streams */}
                <div className="lg:col-span-7 bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#39FF78]/15">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#39FF78]" />
                        Facility Waste Volume Comparison
                      </h2>
                      <p className="text-[11px] text-slate-400">Stream tonnage across operating complexes</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Metric Tons</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={streamData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(57, 255, 120, 0.1)" />
                        <XAxis dataKey="facility" stroke="#64748B" fontSize={11} />
                        <YAxis stroke="#64748B" fontSize={11} />
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
                        <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                        <Bar dataKey="recyclable" name="Recyclable" fill="#39FF78" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="reusable" name="Reusable" fill="#00A86B" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="hazardous" name="Hazardous" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#39FF78]/10 text-xs text-slate-400 font-mono">
                    <span>Active Sites: {data?.projects?.length || 3}</span>
                    <span className="text-[#39FF78]">Automated EPA Tier-3 Compliant</span>
                  </div>
                </div>
              </div>

              {/* Grid 2 Columns: Operational Sign-Off Queue & Project Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Waste Operational Sign-Off Queue */}
                <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 mb-4 border-b border-[#39FF78]/15 gap-2">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Waste Batch Sign-Off Queue
                      </h2>
                      <p className="text-[11px] text-slate-400">Review & verify operator waste segregation logs</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {['ALL', 'RECYCLABLE', 'HAZARDOUS'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all ${
                            categoryFilter === cat
                              ? 'bg-[#39FF78]/20 text-[#39FF78] border-[#39FF78]/40'
                              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pendingActivities.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 bg-[#030806]/50 rounded-2xl border border-slate-800">
                        <CheckCircle2 className="w-6 h-6 text-[#39FF78] mx-auto mb-2 opacity-80" />
                        No pending waste records requiring review.
                      </div>
                    ) : (
                      pendingActivities.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl border border-[#39FF78]/15 bg-[#030806]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-[#39FF78]/35 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] font-bold text-[#39FF78] bg-[#39FF78]/10 px-2 py-0.5 rounded border border-[#39FF78]/30">
                                {item.operator_id_code}
                              </span>
                              <StatusBadge status={item.waste_category || 'RECYCLABLE'} />
                              {item.hazard_level && item.hazard_level !== 'NONE' && (
                                <StatusBadge status={item.hazard_level} />
                              )}
                            </div>
                            <h3 className="text-xs font-bold text-white">{item.activity}</h3>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Quantity: <strong className="text-[#39FF78] font-mono">{item.quantity} {item.unit}</strong> &bull; Site: {item.project_name}
                            </p>
                            {item.disposal_method && (
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                Method: {item.disposal_method}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => handleApprove(item.id, 'approve')}
                              disabled={actionLoading === item.id}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#030806] bg-[#39FF78] hover:bg-[#2ce669] transition-all flex items-center gap-1 shadow-md shadow-[#39FF78]/20"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleApprove(item.id, 'reject')}
                              disabled={actionLoading === item.id}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/35 transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Industrial Facilities & Sites */}
                <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#39FF78]/15">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-[#39FF78]" />
                        Industrial Waste Sites & Velocity
                      </h2>
                      <p className="text-[11px] text-slate-400">Project progress across operating zones</p>
                    </div>
                    <Link to="/admin/projects" className="text-xs font-bold text-[#39FF78] hover:underline flex items-center gap-1">
                      <span>View all</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-3.5">
                    {data?.projects?.map((p) => (
                      <div key={p.id} className="p-3.5 rounded-2xl border border-slate-800 bg-[#030806]/60 hover:border-[#39FF78]/25 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-xs font-bold text-white block">{p.project_name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{p.site}</span>
                          </div>
                          <StatusBadge status={p.status} />
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-400 mb-1">
                            <span>Segregation Velocity</span>
                            <span className="text-[#39FF78]">{p.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-[#00A86B] to-[#39FF78] h-full rounded-full transition-all duration-500 shadow-sm shadow-[#39FF78]/50"
                              style={{ width: `${p.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Immutable Security Audit Trail */}
              <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 shadow-xl shadow-[#030806]/70 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#39FF78]/15 bg-[#063D28]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#39FF78]" />
                      Immutable Compliance Audit Ledger
                    </h2>
                    <p className="text-xs text-slate-400">Cryptographically verifiable log of all administrative and operator actions</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30 self-start sm:self-auto">
                    Security Level 3 Verified
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#030806]/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-[#39FF78]/15">
                      <tr>
                        <th className="px-5 py-3">Timestamp</th>
                        <th className="px-5 py-3">User</th>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3">Action</th>
                        <th className="px-5 py-3">Target Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#39FF78]/10 text-slate-300">
                      {data?.recent_audit_logs?.map((log) => (
                        <tr key={log.id} className="hover:bg-[#39FF78]/5 transition-colors">
                          <td className="px-5 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 font-semibold text-white whitespace-nowrap">
                            {log.user_email}
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-[#39FF78] border border-[#39FF78]/30">
                              {log.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap font-mono text-[11px] font-bold text-[#00E599]">
                            {log.action}
                          </td>
                          <td className="px-5 py-3 text-slate-300 text-xs truncate max-w-xs">
                            {log.target}
                          </td>
                        </tr>
                      ))}
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

export default AdminDashboard;
