import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { operatorApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  HardHat,
  CheckSquare,
  Clock,
  ClipboardList,
  PlusCircle,
  MapPin,
  Calendar,
  Building,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const OperatorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Quick activity log form
  const [activityForm, setActivityForm] = useState({
    activity: '',
    quantity: '',
    unit: 'Units',
    remarks: '',
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await operatorApi.getDashboard();
      setData(res);
    } catch (err) {
      setError('Unable to load operator workstation telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await operatorApi.updateTaskStatus(taskId, newStatus);
      await loadDashboard();
    } catch (err) {
      alert('Error updating task status.');
    }
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await operatorApi.submitRecord(activityForm);
      setShowModal(false);
      setActivityForm({ activity: '', quantity: '', unit: 'Units', remarks: '' });
      await loadDashboard();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit activity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Workstation Identity Banner */}
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400">
                  Certified Operator &bull; ID: {data?.operator_id || 'IND-OP-0001'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Workstation: {data?.operator_name || 'Operator'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{data?.department}</span>
                <span>&bull;</span>
                <span>Shift: <strong className="text-emerald-400">{data?.shift}</strong></span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Daily Activity</span>
              </button>
            </div>
          </div>

          {/* Assigned Project & Site Context Strip */}
          <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Assigned Project
                </span>
                <span className="text-sm font-bold text-slate-800 block">
                  {data?.assigned_project}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Site Location: <strong className="text-slate-800">{data?.assigned_site}</strong></span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400">Loading workstation logs...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Assigned Tasks"
                  value={data?.total_assigned_tasks || 0}
                  icon={CheckSquare}
                  color="emerald"
                  subtitle="Shift task assignments"
                />
                <StatCard
                  title="Active / To-Do"
                  value={data?.active_tasks_count || 0}
                  icon={Clock}
                  color="blue"
                  subtitle="In progress today"
                />
                <StatCard
                  title="Approved Activities"
                  value={data?.approved_activities || 0}
                  icon={ClipboardList}
                  color="indigo"
                  subtitle="Signed off by management"
                />
                <StatCard
                  title="Pending Approval"
                  value={data?.pending_activities || 0}
                  icon={AlertTriangle}
                  color="amber"
                  subtitle="Awaiting supervisor sign-off"
                />
              </div>

              {/* Tasks & Activities Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assigned Tasks */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">My Assigned Tasks</h2>
                      <p className="text-[11px] text-slate-400">Update status as work progresses</p>
                    </div>
                    <Link to="/operator/tasks" className="text-xs font-bold text-emerald-600 hover:underline">
                      View all &rarr;
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {data?.recent_tasks?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No tasks assigned for this shift.</p>
                    ) : (
                      data?.recent_tasks?.map((t) => (
                        <div key={t.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-slate-800">{t.task_name}</span>
                            <StatusBadge status={t.priority} />
                          </div>
                          <p className="text-[11px] text-slate-500 mb-2.5">{t.description}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                            <span className="text-[10px] font-mono text-slate-400">Assigned: {t.assigned_date}</span>
                            <select
                              value={t.status}
                              onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700"
                            >
                              <option value="TODO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="BLOCKED">Blocked</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Activity Records */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">My Submitted Activity Records</h2>
                      <p className="text-[11px] text-slate-400">Track management approval & remarks</p>
                    </div>
                    <Link to="/operator/records" className="text-xs font-bold text-emerald-600 hover:underline">
                      View log &rarr;
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {data?.recent_activities?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No production logs recorded yet.</p>
                    ) : (
                      data?.recent_activities?.map((act) => (
                        <div key={act.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{act.activity}</span>
                            <span className="text-[11px] font-mono text-slate-500">
                              Output: <strong className="text-slate-800">{act.quantity} {act.unit}</strong> &bull; {act.date}
                            </span>
                          </div>
                          <StatusBadge status={act.status} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Quick Activity Entry Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-800">Log Daily Production / Activity</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Activity Description *</label>
                    <input
                      type="text"
                      required
                      value={activityForm.activity}
                      onChange={(e) => setActivityForm({ ...activityForm, activity: e.target.value })}
                      placeholder="e.g. Turbine Rotor Stud Torque Verification"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase mb-1">Quantity *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={activityForm.quantity}
                        onChange={(e) => setActivityForm({ ...activityForm, quantity: e.target.value })}
                        placeholder="e.g. 48"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase mb-1">Unit of Measure</label>
                      <input
                        type="text"
                        value={activityForm.unit}
                        onChange={(e) => setActivityForm({ ...activityForm, unit: e.target.value })}
                        placeholder="e.g. Studs Torqued, Bar Pressure"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Remarks / Shift Notes</label>
                    <textarea
                      rows={2}
                      value={activityForm.remarks}
                      onChange={(e) => setActivityForm({ ...activityForm, remarks: e.target.value })}
                      placeholder="Optional technical observations or QC notes..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    ></textarea>
                  </div>
                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-slate-600">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500">
                      {submitting ? 'Submitting...' : 'Submit Activity'}
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

export default OperatorDashboard;
