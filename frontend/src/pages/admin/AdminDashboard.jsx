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
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Executive Header Banner */}
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-400">
                  Tier-1 Administration &bull; Security Level 3
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Executive Management Console</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Full authority over operator assignments, activity sign-offs, and compliance logs.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                to="/admin/operators"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-950 flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Manage Operators</span>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400">Loading master management ledger...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                  title="Total Projects"
                  value={data?.total_projects || 0}
                  icon={Briefcase}
                  color="indigo"
                  subtitle="Enterprise sites"
                />
                <StatCard
                  title="Active Operators"
                  value={data?.active_operators || 0}
                  icon={Users}
                  color="emerald"
                  subtitle="Registered IND-OP codes"
                />
                <StatCard
                  title="Today's Attendance"
                  value={data?.today_attendance || 0}
                  icon={CalendarCheck}
                  color="blue"
                  subtitle="Shift check-ins"
                />
                <StatCard
                  title="Approved Production"
                  value={data?.total_production_quantity || 0}
                  unit="units"
                  icon={TrendingUp}
                  color="emerald"
                  subtitle="Verified output"
                />
                <StatCard
                  title="Pending Sign-Offs"
                  value={data?.pending_approvals || 0}
                  icon={Clock}
                  color="amber"
                  subtitle="Awaiting admin action"
                />
              </div>

              {/* Grid 2 Columns: Pending Approvals & Project Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Pending Approvals Queue */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">Operational Sign-Off Queue</h2>
                      <p className="text-[11px] text-slate-400">Approve or reject operator daily output records</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {data?.recent_activities?.filter((a) => a.status === 'PENDING').length || 0} Pending
                    </span>
                  </div>

                  <div className="space-y-3">
                    {data?.recent_activities?.filter((a) => a.status === 'PENDING').length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No pending activities requiring review.</p>
                    ) : (
                      data?.recent_activities
                        ?.filter((a) => a.status === 'PENDING')
                        .slice(0, 5)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded border">
                                  {item.operator_id_code}
                                </span>
                                <span className="text-xs font-bold text-slate-800">{item.activity}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Qty: <strong className="text-slate-700">{item.quantity} {item.unit}</strong> &bull; Site: {item.project_name}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(item.id, 'approve')}
                                disabled={actionLoading === item.id}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleApprove(item.id, 'reject')}
                                disabled={actionLoading === item.id}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-colors flex items-center gap-1"
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

                {/* Project Progress Overview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">Enterprise Project Status</h2>
                      <p className="text-[11px] text-slate-400">Current velocity across registered sites</p>
                    </div>
                    <Link to="/admin/projects" className="text-xs font-bold text-indigo-600 hover:underline">
                      View all &rarr;
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {data?.projects?.map((p) => (
                      <div key={p.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{p.project_name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{p.site}</span>
                          </div>
                          <StatusBadge status={p.status} />
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{p.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${p.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audit Logs Quick View */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Immutable Audit Trail (Recent Activity)</h2>
                    <p className="text-xs text-slate-400">Chronological governance log of user actions and security events</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Security Level 3 Audited
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">Timestamp</th>
                        <th className="px-5 py-3">User</th>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3">Action</th>
                        <th className="px-5 py-3">Target Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {data?.recent_audit_logs?.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                            {log.user_email}
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border">
                              {log.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap font-mono text-[11px] font-bold text-indigo-600">
                            {log.action}
                          </td>
                          <td className="px-5 py-3 text-slate-600 text-xs truncate max-w-xs">
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
