import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { FileCheck, CheckCircle2, XCircle, Search, Clock, ShieldCheck, Download, Recycle } from 'lucide-react';

const AdminReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();
      setData(res.recent_activities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, action) => {
    try {
      await adminApi.approveActivity(id, action);
      await loadReports();
    } catch (err) {
      alert('Action failed.');
    }
  };

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.activity.toLowerCase().includes(search.toLowerCase()) ||
      item.operator_name.toLowerCase().includes(search.toLowerCase()) ||
      item.operator_id_code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#39FF78] animate-ping"></span>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#39FF78]">
                  Tier-1 Approvals Authority
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Waste Approvals & Activity Records
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Supervise operator waste segregation batches, verify hazard ratings, and grant executive sign-offs.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-[#0B1210] hover:bg-[#063D28] border border-[#39FF78]/30 text-[#39FF78] text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-[#39FF78]" />
              <span>Print Official Ledger</span>
            </button>
          </div>

          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-2xl border border-[#39FF78]/20 p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by activity, operator name, or IND-OP code..."
                className="w-full pl-10 pr-4 py-2 bg-[#030806] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
              />
            </div>
            <div className="flex items-center gap-2">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all border ${
                    statusFilter === st
                      ? 'bg-[#39FF78] text-[#030806] border-[#39FF78] shadow-md shadow-[#39FF78]/20'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 shadow-2xl shadow-[#030806]/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030806]/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-[#39FF78]/15">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Operator</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Waste Stream / Activity</th>
                    <th className="px-5 py-3.5">Quantity</th>
                    <th className="px-5 py-3.5">Project Site</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Sign-Off Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#39FF78]/10 text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-[#39FF78] font-mono">
                        Loading waste records...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400">
                        No records match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-[#39FF78]/5 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">{item.date}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-white block">{item.operator_name}</span>
                          <span className="font-mono text-[10px] text-[#39FF78]">{item.operator_id_code}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={item.waste_category || 'RECYCLABLE'} />
                        </td>
                        <td className="px-5 py-3.5 font-medium text-white">
                          <div>{item.activity}</div>
                          {item.hazard_level && item.hazard_level !== 'NONE' && (
                            <span className="text-[10px] text-rose-400 font-mono">Hazard: {item.hazard_level}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-[#39FF78] whitespace-nowrap">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">{item.project_name}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          {item.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleApprove(item.id, 'approve')}
                                className="px-3 py-1 bg-[#39FF78] text-[#030806] rounded-lg font-black hover:bg-[#2ce669] text-[11px] transition-all shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApprove(item.id, 'reject')}
                                className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-bold hover:bg-rose-500/30 text-[11px] transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">Sign-off completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReports;
