import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { ClipboardList, PlusCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const OperatorRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    operatorApi.getRecords()
      .then((data) => setRecords(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Production & Activity Submissions</h1>
            <p className="text-xs text-slate-500 mt-1">
              Personal audit log of your daily operational batches and management sign-off statuses.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Submission Date</th>
                  <th className="px-5 py-3.5">Activity Description</th>
                  <th className="px-5 py-3.5">Quantity Output</th>
                  <th className="px-5 py-3.5">Site / Unit</th>
                  <th className="px-5 py-3.5">Approval Status</th>
                  <th className="px-5 py-3.5">Supervisor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{r.date}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{r.activity}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{r.quantity} {r.unit}</td>
                    <td className="px-5 py-3.5 text-slate-600">{r.project_name}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs italic">{r.remarks || 'No remarks recorded.'}</td>
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

export default OperatorRecords;
