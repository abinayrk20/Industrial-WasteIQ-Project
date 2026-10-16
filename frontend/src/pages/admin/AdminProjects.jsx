import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  PlusCircle,
  MapPin,
  Calendar,
  Percent,
  TrendingUp,
  CheckCircle,
  Clock,
  Building,
  Recycle
} from 'lucide-react';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    site: '',
    status: 'IN_PROGRESS',
    progress_percentage: 60,
    budget: 2500000,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProjects();
      setProjects(data);
    } catch (err) {
      setError('Unable to load enterprise facilities.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createProject(formData);
      setShowModal(false);
      setFormData({
        project_name: '',
        site: '',
        status: 'IN_PROGRESS',
        progress_percentage: 60,
        budget: 2500000,
      });
      await loadProjects();
    } catch (err) {
      alert('Error creating facility project.');
    }
  };

  const handleUpdateProgress = async (id, newProgress) => {
    try {
      await adminApi.updateProject(id, { progress_percentage: parseInt(newProgress) });
      await loadProjects();
    } catch (err) {
      alert('Error updating progress.');
    }
  };

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
                  Plant & Waste Facilities Hub
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Industrial Facilities & Waste Sites
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage eco-industrial complexes, track segregation velocities, and assign operator shifts.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00A86B] to-[#39FF78] hover:from-[#008f5b] hover:to-[#2ce669] text-[#030806] text-xs font-black px-5 py-2.5 rounded-2xl shadow-lg shadow-[#39FF78]/20 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Facility</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70 flex flex-col justify-between hover:border-[#39FF78]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={proj.status} />
                    <span className="text-[10px] font-mono text-[#39FF78] bg-[#39FF78]/10 px-2 py-0.5 rounded border border-[#39FF78]/30">
                      ID: #{proj.id}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{proj.project_name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#39FF78] shrink-0" />
                    <span>{proj.site}</span>
                  </p>

                  {/* Progress Meter */}
                  <div className="p-3.5 bg-[#030806]/70 rounded-2xl border border-slate-800 mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                      <span>Segregation Velocity</span>
                      <span className="font-mono text-[#39FF78]">{proj.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2.5 border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-[#00A86B] to-[#39FF78] h-full rounded-full transition-all duration-500 shadow-sm shadow-[#39FF78]/50"
                        style={{ width: `${proj.progress_percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">Adjust:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={proj.progress_percentage}
                        onChange={(e) => handleUpdateProgress(proj.id, e.target.value)}
                        className="w-full accent-[#39FF78] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#39FF78]/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Assigned Operators: <strong className="text-white">{proj.operator_count}</strong></span>
                  <span>Active Tasks: <strong className="text-white">{proj.task_count}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-[#030806]/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0B1210] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#39FF78]/35 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#39FF78]/20">
                  <h3 className="text-base font-bold text-white">Register Industrial Facility</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">&times;</button>
                </div>
                <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Facility Name</label>
                    <input
                      type="text"
                      required
                      value={formData.project_name}
                      onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                      placeholder="e.g. Eco-Industrial Processing Complex"
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Site / Zone Location</label>
                    <input
                      type="text"
                      required
                      value={formData.site}
                      onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                      placeholder="e.g. Sector 7 Industrial Corridor"
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Initial Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#030806] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39FF78]"
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-[#39FF78]/15 flex justify-end gap-2.5">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl font-black text-[#030806] bg-[#39FF78] hover:bg-[#2ce669] shadow-md shadow-[#39FF78]/20">Save Facility</button>
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

export default AdminProjects;
