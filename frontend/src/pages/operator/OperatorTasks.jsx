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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shift Tasks & Work Orders</h1>
            <p className="text-xs text-slate-500 mt-1">
              Assigned tasks scoped strictly to your operator profile. Update statuses as physical operations proceed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={t.priority} />
                    <span className="text-[10px] font-mono text-slate-400">Assigned: {t.assigned_date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{t.task_name}</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Status:</span>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
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
