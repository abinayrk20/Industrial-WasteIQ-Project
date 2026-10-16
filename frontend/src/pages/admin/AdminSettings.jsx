import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  ShieldCheck,
  Lock,
  Sliders,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Eye,
  HardHat,
  Recycle,
  Sparkles
} from 'lucide-react';

const AdminSettings = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
                Enterprise Security Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Security Governance & Policy Hierarchy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Role-Based Access Control matrix, cryptographic authorization models, and live immutable audit trails.
            </p>
          </div>

          {/* RBAC Matrix Card */}
          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-6 shadow-xl shadow-[#030806]/70">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#39FF78]" />
              <span>WasteIQ 3-Tier RBAC Clearance Hierarchy</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#030806]/70 border border-[#39FF78]/30">
                <div className="flex items-center gap-2 mb-2 text-[#39FF78] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. ADMIN (Tier 1 - Master Governance)</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Enroll & Deactivate certified operators</li>
                  <li>Auto-sequence IND-OP-XXXX credentials</li>
                  <li>Approve / Reject waste segregation batches</li>
                  <li>Configure facility sites & waste categories</li>
                  <li>Inspect cryptographically signed audit logs</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#030806]/70 border border-[#00A86B]/30">
                <div className="flex items-center gap-2 mb-2 text-[#00E599] font-bold text-xs">
                  <HardHat className="w-4 h-4" />
                  <span>2. OPERATOR (Tier 2 - Field Station)</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Individual IND-OP-XXXX identity binding</li>
                  <li>Assigned facility site data isolation</li>
                  <li>Log daily waste segregation & hazard ratings</li>
                  <li>Update assigned work order statuses</li>
                  <li>Strictly denied administrative mutations</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#030806]/70 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold text-xs">
                  <Eye className="w-4 h-4" />
                  <span>3. CLIENT_VIEWER (Tier 3 - Stakeholder)</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Strictly READ-ONLY (GET requests enforced)</li>
                  <li>View live recycling diversion rates</li>
                  <li>Inspect carbon offset metrics ($CO_2e$)</li>
                  <li>Access approved chain-of-custody certificates</li>
                  <li>Zero write / mutation privileges</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Audit Logs Live Table */}
          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 shadow-2xl shadow-[#030806]/70 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#39FF78]/15 bg-[#063D28]/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Immutable Audit Trail (Security Events)</h3>
                <p className="text-xs text-slate-400">Triggered on every authentication, authorization check, and waste approval</p>
              </div>
              <span className="text-[11px] font-mono text-[#39FF78] font-bold bg-[#39FF78]/15 px-3 py-1 rounded-full border border-[#39FF78]/30">
                {logs.length} Logged Events
              </span>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030806]/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-[#39FF78]/15 sticky top-0">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">User Identity</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Action Recorded</th>
                    <th className="px-5 py-3.5">Target Entity</th>
                    <th className="px-5 py-3.5">IP Origin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#39FF78]/10 text-slate-300">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-[#39FF78]/5 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">{l.user_email}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-[#39FF78] border border-[#39FF78]/30">
                          {l.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-[#00E599] whitespace-nowrap">
                        {l.action}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 text-xs truncate max-w-xs">{l.target}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">{l.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
