import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { FileCheck, CheckCircle2, XCircle, Search, Clock, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Production Approvals & Activity Records</h1>
            <p className="text-xs text-slate-500 mt-1">
              Supervise all operator activity records, audit quality remarks, and grant formal executive sign-offs.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by activity, operator name, or IND-OP code..."
              className="w-full sm:max-w-md px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
            <div className="flex items-center gap-2">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Operator</th>
                  <th className="px-5 py-3">Activity Description</th>
                  <th className="px-5 py-3">Quantity</th>
                  <th className="px-5 py-3">Project Site</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{item.date}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-800 block">{item.operator_name}</span>
                      <span className="font-mono text-[10px] text-emerald-600">{item.operator_id_code}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{item.activity}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{item.quantity} {item.unit}</td>
                    <td className="px-5 py-3.5 text-slate-600">{item.project_name}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                    <td className="px-5 py-3.5 text-right">
                      {item.status === 'PENDING' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleApprove(item.id, 'approve')}
                            className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold hover:bg-emerald-200 text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprove(item.id, 'reject')}
                            className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-bold hover:bg-rose-200 text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Sign-off completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReports;
