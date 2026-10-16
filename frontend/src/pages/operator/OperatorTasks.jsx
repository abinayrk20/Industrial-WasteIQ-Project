import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { CheckSquare, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const OperatorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await operatorApi.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await operatorApi.updateTaskStatus(taskId, newStatus);
      await loadTasks();
    } catch (err) {
      alert('Error updating task.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#39FF78] animate-ping"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#39FF78]">
                Operator Task Queue
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Shift Work Orders & Task Assignments
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Work orders assigned to your certified operator profile. Update statuses as physical sorting and processing occurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70 flex flex-col justify-between hover:border-[#39FF78]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={t.priority} />
                    <span className="text-[10px] font-mono text-slate-400">Assigned: {t.assigned_date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{t.task_name}</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-[#39FF78]/15 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Status:</span>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="px-2.5 py-1.5 bg-[#030806] border border-[#39FF78]/30 rounded-xl text-xs font-bold text-[#39FF78] focus:outline-none focus:ring-1 focus:ring-[#39FF78]"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperatorTasks;
