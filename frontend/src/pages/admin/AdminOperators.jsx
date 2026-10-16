import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  HardHat,
  Briefcase,
  Clock,
  Building,
  AlertCircle,
  ShieldCheck,
  Recycle
} from 'lucide-react';

const AdminOperators = () => {
  const [operators, setOperators] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employee_id: '',
    department: 'Waste Sorting & Segregation',
    project: '',
    shift: 'Morning',
    password: 'Operator@12345',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ops, projs] = await Promise.all([
        adminApi.getOperators(),
        adminApi.getProjects(),
      ]);
      setOperators(ops);
      setProjects(projs);
    } catch (err) {
      setError('Unable to load operators ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOperator = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await adminApi.createOperator(formData);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        employee_id: '',
        department: 'Waste Sorting & Segregation',
        project: '',
        shift: 'Morning',
        password: 'Operator@12345',
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create operator.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (op) => {
    const newStatus = op.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminApi.updateOperator(op.id, { status: newStatus });
      await loadData();
    } catch (err) {
      alert('Failed to update operator status.');
    }
  };

  const filteredOperators = operators.filter(
    (op) =>
      op.name.toLowerCase().includes(search.toLowerCase()) ||
      op.operator_id.toLowerCase().includes(search.toLowerCase()) ||
      op.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      op.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#39FF78] animate-ping"></span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30">
                  IND-OP-XXXX Sequence Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Certified Waste Operator Registry
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Assign unique WasteIQ Operator IDs, allocate facility sites, and manage shift clearances.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00A86B] to-[#39FF78] hover:from-[#008f5b] hover:to-[#2ce669] text-[#030806] text-xs font-black px-5 py-2.5 rounded-2xl shadow-lg shadow-[#39FF78]/20 transition-all self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll New Operator</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Search Toolbar */}
          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-2xl border border-[#39FF78]/20 p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Operator ID (IND-OP-...), Name, Employee ID..."
                className="w-full pl-10 pr-4 py-2 bg-[#030806] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Total Enrolled Operators: <strong className="text-[#39FF78]">{operators.length}</strong>
            </span>
          </div>

          {/* Operators Master Table */}
          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 shadow-2xl shadow-[#030806]/70 overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-xs text-[#39FF78] font-mono">Loading operator database...</div>
            ) : filteredOperators.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">No matching operators found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#030806]/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-[#39FF78]/15">
                    <tr>
                      <th className="px-5 py-3.5">Operator ID</th>
                      <th className="px-5 py-3.5">Operator Name</th>
                      <th className="px-5 py-3.5">Employee ID</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Assigned Facility</th>
                      <th className="px-5 py-3.5">Shift</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#39FF78]/10 text-slate-300">
                    {filteredOperators.map((op) => (
                      <tr key={op.id} className="hover:bg-[#39FF78]/5 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-xs font-black text-[#39FF78] bg-[#39FF78]/15 border border-[#39FF78]/35 px-2.5 py-1 rounded-lg">
                            {op.operator_id}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-white">{op.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{op.email}</div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">
                          {op.employee_id}
                        </td>
                        <td className="px-5 py-3.5 text-slate-300 whitespace-nowrap">
                          {op.department}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-medium text-white">
                            {op.project_name || 'Central Facility'}
                          </div>
                          <div className="text-[10px] text-slate-400">{op.site || 'Eco-Industrial Zone'}</div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-[11px] font-semibold text-slate-300">
                            {op.shift}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={op.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(op)}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                              op.status === 'ACTIVE'
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                                : 'bg-[#39FF78]/15 text-[#39FF78] border-[#39FF78]/35 hover:bg-[#39FF78]/25'
                            }`}
                          >
                            {op.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create Operator Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-[#030806]/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0B1210] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#39FF78]/35 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#39FF78]/20">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Enroll Certified Waste Operator</h2>
                      <p className="text-[11px] text-slate-400">ID will be auto-generated in the IND-OP-XXXX sequence</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleCreateOperator} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Samuel Green"
                        className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Employee ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        placeholder="e.g. EMP-5021"
                        className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="operator@industrial.com"
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Shift Schedule</label>
                      <select
                        value={formData.shift}
                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      >
                        <option value="Morning">Morning (06:00 - 14:00)</option>
                        <option value="Afternoon">Afternoon (14:00 - 22:00)</option>
                        <option value="Night">Night (22:00 - 06:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Assign to Facility / Site</label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    >
                      <option value="">-- Central Eco-Industrial Complex --</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.project_name} ({p.site})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Default Password</label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#39FF78]/15 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl font-black text-[#030806] bg-[#39FF78] hover:bg-[#2ce669] shadow-md shadow-[#39FF78]/20 transition-all"
                    >
                      {submitting ? 'Generating Operator ID...' : 'Confirm Enrollment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOperators;
