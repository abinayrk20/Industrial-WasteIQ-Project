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
  HardHat
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Policies & System Settings</h1>
            <p className="text-xs text-slate-500 mt-1">
              Role-Based Access Control configuration, cryptographic policy status, and immutable audit logs.
            </p>
          </div>

          {/* RBAC Matrix Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RBAC Security Clearance Hierarchy</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. ADMIN (Level 3 - Full Mgmt)</span>
                </div>
                <ul className="text-[11px] text-indigo-950 space-y-1 list-disc list-inside">
                  <li>Create & Deactivate Operators</li>
                  <li>Auto-generate IND-OP-XXXX IDs</li>
                  <li>Approve/Reject Activity Records</li>
                  <li>Manage Projects, Sites & Documents</li>
                  <li>Inspect Immutable Audit Logs</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-xs">
                  <HardHat className="w-4 h-4" />
                  <span>2. OPERATOR (Level 2 - Operations)</span>
                </div>
                <ul className="text-[11px] text-emerald-950 space-y-1 list-disc list-inside">
                  <li>Unique IND-OP-XXXX Identity</li>
                  <li>View only assigned project/site</li>
                  <li>Update assigned task statuses</li>
                  <li>Submit daily activity & quantities</li>
                  <li>Strictly blocked from admin tools</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
                <div className="flex items-center gap-2 mb-2 text-sky-800 font-bold text-xs">
                  <Eye className="w-4 h-4" />
                  <span>3. CLIENT_VIEWER (Level 1 - Read Only)</span>
                </div>
                <ul className="text-[11px] text-sky-950 space-y-1 list-disc list-inside">
                  <li>Strictly READ-ONLY (GET requests only)</li>
                  <li>View overall progress percentage</li>
                  <li>View approved production summaries</li>
                  <li>View permitted blueprints & certificates</li>
                  <li>Zero write/mutation authority</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Audit Logs Live Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Immutable Audit Logs (Security Events)</h3>
                <p className="text-xs text-slate-400">Recorded automatically on user action & authorization intercept</p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                {logs.length} Logged Entries
              </span>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">User Email</th>
                    <th className="px-5 py-3">Security Role</th>
                    <th className="px-5 py-3">Action Recorded</th>
                    <th className="px-5 py-3">Target Reference</th>
                    <th className="px-5 py-3">IP Origin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">{l.user_email}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border">
                          {l.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] font-bold text-indigo-600 whitespace-nowrap">{l.action}</td>
                      <td className="px-5 py-3 text-slate-600 text-xs truncate max-w-xs">{l.target}</td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-400">{l.ip_address}</td>
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
