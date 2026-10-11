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
  Clock
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
    progress_percentage: 0,
    budget: 1000000,
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
      setError('Unable to load enterprise projects.');
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
        progress_percentage: 0,
        budget: 1000000,
      });
      await loadProjects();
    } catch (err) {
      alert('Error creating project.');
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Projects & Sites</h1>
              <p className="text-xs text-slate-500 mt-1">
                Oversee industrial site operations, milestone progress percentages, and client affiliations.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch New Project</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={proj.status} />
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: #{proj.id}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{proj.project_name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{proj.site}</span>
                  </p>

                  {/* Progress Meter with direct adjustment slider */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Execution Velocity</span>
                      <span className="font-mono text-emerald-600">{proj.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress_percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-semibold">Adjust %:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={proj.progress_percentage}
                        onChange={(e) => handleUpdateProgress(proj.id, e.target.value)}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Assigned Staff: <strong className="text-slate-800">{proj.operator_count}</strong></span>
                  <span>Tasks: <strong className="text-slate-800">{proj.task_count}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-800">Create Industrial Project</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      value={formData.project_name}
                      onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                      placeholder="e.g. Arctic LNG Terminal Module 4"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Site Location</label>
                    <input
                      type="text"
                      required
                      value={formData.site}
                      onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                      placeholder="e.g. Hammerfest Deepwater Bay"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Initial Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-slate-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500">Save Project</button>
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
