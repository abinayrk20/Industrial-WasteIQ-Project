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
  ArrowRight,
  Recycle,
  Sparkles,
  Flame,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const OperatorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Quick waste log form
  const [activityForm, setActivityForm] = useState({
    activity: '',
    quantity: '',
    unit: 'Tons',
    waste_category: 'RECYCLABLE',
    hazard_level: 'NONE',
    disposal_method: 'Mechanical Sorting & Compacting',
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

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    let suggestedHazard = 'NONE';
    let suggestedMethod = 'Mechanical Sorting & Compacting';

    if (cat === 'HAZARDOUS') {
      suggestedHazard = 'HIGH';
      suggestedMethod = 'Licensed Neutralization & Thermal Treatment';
    } else if (cat === 'REUSABLE') {
      suggestedHazard = 'LOW';
      suggestedMethod = 'Refurbishment & Re-entry Loop';
    }

    setActivityForm({
      ...activityForm,
      waste_category: cat,
      hazard_level: suggestedHazard,
      disposal_method: suggestedMethod
    });
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await operatorApi.submitRecord(activityForm);
      setShowModal(false);
      setActivityForm({
        activity: '',
        quantity: '',
        unit: 'Tons',
        waste_category: 'RECYCLABLE',
        hazard_level: 'NONE',
        disposal_method: 'Mechanical Sorting & Compacting',
        remarks: ''
      });
      await loadDashboard();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit waste activity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Workstation Identity Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B1210]/90 via-[#063D28]/60 to-[#0B1210]/95 border border-[#39FF78]/30 text-[#F4FFF7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-2xl shadow-[#030806] backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39FF78] animate-ping"></span>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#39FF78] flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5" />
                  Certified Field Terminal &bull; {data?.operator_id || 'IND-OP-0004'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Workstation: {data?.operator_name || 'Operator'}
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>Dept: <strong className="text-white">{data?.department || 'Waste Segregation'}</strong></span>
                <span>&bull;</span>
                <span>Shift: <strong className="text-[#39FF78]">{data?.shift || 'Morning (06:00 - 14:00)'}</strong></span>
                <span>&bull;</span>
                <span>Employee ID: <strong className="font-mono text-slate-300">{data?.employee_id || 'EMP-OP-401'}</strong></span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00A86B] to-[#39FF78] hover:from-[#008f5b] hover:to-[#2ce669] text-[#030806] text-xs font-black shadow-lg shadow-[#39FF78]/20 transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Waste Batch</span>
              </button>
            </div>
          </div>

          {/* Assigned Facility Strip */}
          <div className="p-4 rounded-2xl bg-[#0B1210]/80 border border-[#39FF78]/20 backdrop-blur-xl shadow-lg shadow-[#030806]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Assigned Treatment Facility
                </span>
                <span className="text-sm font-bold text-white block">
                  {data?.assigned_project || 'WasteIQ Central Complex'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-[#39FF78] shrink-0" />
              <span>Site Location: <strong className="text-white">{data?.assigned_site || 'Unit 1 Complex'}</strong></span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-20 text-center text-xs text-[#39FF78] font-mono animate-pulse">
              Syncing operator terminal telemetry...
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Assigned Tasks"
                  value={data?.total_assigned_tasks || 0}
                  icon={CheckSquare}
                  color="neon"
                  subtitle="Shift task quota"
                />
                <StatCard
                  title="Active / To-Do"
                  value={data?.active_tasks_count || 0}
                  icon={Clock}
                  color="blue"
                  subtitle="In execution today"
                />
                <StatCard
                  title="Approved Waste Logs"
                  value={data?.approved_activities || 0}
                  icon={ClipboardList}
                  color="emerald"
                  subtitle="Verified by management"
                />
                <StatCard
                  title="Pending Sign-Off"
                  value={data?.pending_activities || 0}
                  icon={AlertTriangle}
                  color="amber"
                  subtitle="Awaiting supervisor check"
                />
              </div>

              {/* AI Waste Classification Assistant Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#030806]/90 via-[#063D28]/40 to-[#030806]/90 border border-[#39FF78]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#39FF78]/20 text-[#39FF78] border border-[#39FF78]/40">
                    <Cpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>WasteIQ AI Segregation Assistant</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#39FF78]/20 text-[#39FF78] border border-[#39FF78]/40">
                        ACTIVE
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Segregate waste into <strong className="text-[#39FF78]">Recyclable</strong> (scrap metal, plastics, paper), <strong className="text-[#00E599]">Reusable</strong> (pallets, drums), or <strong className="text-rose-400">Hazardous</strong> (chemical sludge, solvents).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#39FF78]/15 hover:bg-[#39FF78]/25 border border-[#39FF78]/40 text-[#39FF78] text-xs font-bold transition-all shrink-0 font-mono"
                >
                  Quick Log &rarr;
                </button>
              </div>

              {/* Tasks & Activities Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assigned Tasks */}
                <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#39FF78]/15">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-[#39FF78]" />
                        My Shift Work Orders
                      </h2>
                      <p className="text-[11px] text-slate-400">Update status as sorting progresses</p>
                    </div>
                    <Link to="/operator/tasks" className="text-xs font-bold text-[#39FF78] hover:underline flex items-center gap-1">
                      <span>View all</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {data?.recent_tasks?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-8 text-center bg-[#030806]/40 rounded-2xl border border-slate-800">
                        No tasks assigned for this shift.
                      </p>
                    ) : (
                      data?.recent_tasks?.map((t) => (
                        <div key={t.id} className="p-3.5 rounded-2xl border border-slate-800 bg-[#030806]/60 hover:border-[#39FF78]/30 transition-all">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-white">{t.task_name}</span>
                            <StatusBadge status={t.priority} />
                          </div>
                          <p className="text-[11px] text-slate-400 mb-2.5">{t.description}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                            <span className="text-[10px] font-mono text-slate-500">Target: {t.assigned_date}</span>
                            <select
                              value={t.status}
                              onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value)}
                              className="px-2.5 py-1 bg-[#0B1210] border border-[#39FF78]/30 rounded-lg text-xs font-bold text-[#39FF78] focus:outline-none focus:ring-1 focus:ring-[#39FF78]"
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
                <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#39FF78]/15">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-[#39FF78]" />
                        My Waste Submissions
                      </h2>
                      <p className="text-[11px] text-slate-400">Track management approval & remarks</p>
                    </div>
                    <Link to="/operator/records" className="text-xs font-bold text-[#39FF78] hover:underline flex items-center gap-1">
                      <span>Full log</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {data?.recent_activities?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-8 text-center bg-[#030806]/40 rounded-2xl border border-slate-800">
                        No waste records logged yet this shift.
                      </p>
                    ) : (
                      data?.recent_activities?.map((act) => (
                        <div key={act.id} className="p-3.5 rounded-2xl border border-slate-800 bg-[#030806]/60 flex items-center justify-between hover:border-[#39FF78]/30 transition-all">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <StatusBadge status={act.waste_category || 'RECYCLABLE'} />
                              <span className="text-xs font-bold text-white">{act.activity}</span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 block">
                              Output: <strong className="text-[#39FF78]">{act.quantity} {act.unit}</strong> &bull; {act.date}
                            </span>
                            {act.disposal_method && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                Method: {act.disposal_method}
                              </span>
                            )}
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

          {/* Log Waste Batch Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-[#030806]/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0B1210] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#39FF78]/35 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#39FF78]/20">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Log Waste Segregation Batch</h3>
                      <p className="text-[11px] text-slate-400">Classify waste category and specify tonnage</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                </div>

                <form onSubmit={handleCreateActivity} className="space-y-3.5 text-xs">
                  {/* Category Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Waste Category *</label>
                      <select
                        value={activityForm.waste_category}
                        onChange={handleCategoryChange}
                        className="w-full px-3 py-2 bg-[#030806] border border-[#39FF78]/30 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      >
                        <option value="RECYCLABLE">Recyclable (Metals, Glass, Paper)</option>
                        <option value="REUSABLE">Reusable (Pallets, Drums, Parts)</option>
                        <option value="HAZARDOUS">Hazardous (Sludge, Chemical, Solvent)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Hazard Level</label>
                      <select
                        value={activityForm.hazard_level}
                        onChange={(e) => setActivityForm({ ...activityForm, hazard_level: e.target.value })}
                        className="w-full px-3 py-2 bg-[#030806] border border-[#39FF78]/30 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      >
                        <option value="NONE">None (Safe)</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High (Toxic / Flammable)</option>
                        <option value="CRITICAL">Critical (Biohazard / Corrosive)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Waste Stream Description *</label>
                    <input
                      type="text"
                      required
                      value={activityForm.activity}
                      onChange={(e) => setActivityForm({ ...activityForm, activity: e.target.value })}
                      placeholder="e.g. Scrap Aluminum & Copper Wiring Segregation"
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Quantity *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={activityForm.quantity}
                        onChange={(e) => setActivityForm({ ...activityForm, quantity: e.target.value })}
                        placeholder="e.g. 5.4"
                        className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Unit of Measure</label>
                      <select
                        value={activityForm.unit}
                        onChange={(e) => setActivityForm({ ...activityForm, unit: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                      >
                        <option value="Tons">Metric Tons</option>
                        <option value="Kg">Kilograms (kg)</option>
                        <option value="Barrels">Barrels / Drums</option>
                        <option value="Units">Bales / Pallets</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Disposal / Treatment Method</label>
                    <input
                      type="text"
                      value={activityForm.disposal_method}
                      onChange={(e) => setActivityForm({ ...activityForm, disposal_method: e.target.value })}
                      placeholder="e.g. Closed-loop Smelting Recovery, Neutralization"
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Shift Notes / Observations</label>
                    <textarea
                      rows={2}
                      value={activityForm.remarks}
                      onChange={(e) => setActivityForm({ ...activityForm, remarks: e.target.value })}
                      placeholder="Optional remarks regarding moisture level, contamination, or sorting efficiency..."
                      className="w-full px-3.5 py-2 bg-[#030806] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-[#39FF78]/15 flex justify-end gap-2.5">
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
                      {submitting ? 'Transmitting Log...' : 'Confirm Submission'}
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
