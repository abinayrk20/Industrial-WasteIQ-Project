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
  ShieldCheck
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
    department: 'Turbine Assembly',
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
        department: 'Turbine Assembly',
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Certified Operator Registry</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  IND-OP-XXXX Sequence
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generate unique Operator IDs, assign plant projects, and configure shift authorizations.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-950 transition-all self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll New Operator</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Search Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Operator ID (IND-OP-...), Name, Employee ID, or Department..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Total Enrolled: <strong className="text-slate-800">{operators.length}</strong>
            </span>
          </div>

          {/* Operators Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400">Loading operator database...</div>
            ) : filteredOperators.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">No matching operators found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Operator ID</th>
                      <th className="px-5 py-3.5">Operator Name</th>
                      <th className="px-5 py-3.5">Employee ID</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Assigned Project & Site</th>
                      <th className="px-5 py-3.5">Shift</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredOperators.map((op) => (
                      <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                            {op.operator_id}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{op.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{op.email}</div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                          {op.employee_id}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                          {op.department}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-medium text-slate-800">
                            {op.project_name || 'Unassigned'}
                          </div>
                          <div className="text-[10px] text-slate-400">{op.site || 'N/A'}</div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-[11px] font-semibold text-slate-600">
                            {op.shift}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={op.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(op)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                              op.status === 'ACTIVE'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
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
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-800">Enroll Certified Operator</h2>
                      <p className="text-[11px] text-slate-400">Operator ID will be auto-generated as IND-OP-XXXX</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleCreateOperator} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Samuel Green"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        placeholder="e.g. EMP-5021"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="operator@industrial.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Shift Schedule
                      </label>
                      <select
                        value={formData.shift}
                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Morning">Morning (06:00 - 14:00)</option>
                        <option value="Afternoon">Afternoon (14:00 - 22:00)</option>
                        <option value="Night">Night (22:00 - 06:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                      Assign to Project / Site
                    </label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Leave Unassigned --</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.project_name} ({p.site})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
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
