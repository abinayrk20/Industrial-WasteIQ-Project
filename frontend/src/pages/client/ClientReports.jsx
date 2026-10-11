import React, { useState, useEffect } from 'react';
import { clientApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { FileText, CheckCircle2, Lock } from 'lucide-react';

const ClientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi.getReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approved Progress & Production Reports</h1>
              <p className="text-xs text-slate-500 mt-1">
                Verified historical production figures validated by plant quality controllers and directors.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200">
              AUDITED READ-ONLY
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Report Date</th>
                  <th className="px-5 py-3.5">Project Scope</th>
                  <th className="px-5 py-3.5">Approved Activity</th>
                  <th className="px-5 py-3.5">Verified Volume</th>
                  <th className="px-5 py-3.5">Quality Audit Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{r.date}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{r.project_name}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{r.activity}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-700">{r.quantity} {r.unit}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{r.remarks || 'Verified within specification parameters.'}</td>
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

export default ClientReports;
