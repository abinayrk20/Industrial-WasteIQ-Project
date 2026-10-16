import React, { useState, useEffect } from 'react';
import { clientApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { FileText, CheckCircle2, Lock, Download, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-300">
                  Audited Environmental Telemetry
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Approved Waste Diversion Reports
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Verified historical waste figures and landfill diversion metrics validated by plant directors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-2xl bg-cyan-500/15 text-cyan-300 text-[11px] font-mono font-bold border border-cyan-500/30">
                AUDITED READ-ONLY
              </span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-2xl bg-[#0B1210] hover:bg-[#063D28] border border-[#39FF78]/30 text-[#39FF78] text-[11px] font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 shadow-2xl shadow-[#030806]/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030806]/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-[#39FF78]/15">
                  <tr>
                    <th className="px-5 py-3.5">Report Date</th>
                    <th className="px-5 py-3.5">Facility Site</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Approved Waste Activity</th>
                    <th className="px-5 py-3.5">Verified Tonnage</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Quality Audit Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#39FF78]/10 text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-[#39FF78] font-mono">
                        Loading verified ESG reports...
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        No approved reports available.
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => (
                      <tr key={r.id} className="hover:bg-[#39FF78]/5 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">{r.date}</td>
                        <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">{r.project_name}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={r.waste_category || 'RECYCLABLE'} />
                        </td>
                        <td className="px-5 py-3.5 font-bold text-white">{r.activity}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-[#39FF78] whitespace-nowrap">{r.quantity} {r.unit}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                        <td className="px-5 py-3.5 text-xs text-slate-400 italic">{r.remarks || 'Verified within specification parameters.'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientReports;
