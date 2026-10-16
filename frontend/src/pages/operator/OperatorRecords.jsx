import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { ClipboardList, PlusCircle, CheckCircle, Clock, AlertCircle, Recycle, Download } from 'lucide-react';

const OperatorRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('ALL');

  useEffect(() => {
    operatorApi.getRecords()
      .then((data) => setRecords(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecords = records.filter(
    (r) => filterCat === 'ALL' || r.waste_category === filterCat
  );

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
                  Verified Operator Ledger
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Daily Waste Submissions & Audit Records
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Personal historical ledger of all segregated batches, tonnage, hazard ratings, and management sign-offs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['ALL', 'RECYCLABLE', 'REUSABLE', 'HAZARDOUS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all border ${
                    filterCat === cat
                      ? 'bg-[#39FF78] text-[#030806] border-[#39FF78] shadow-md shadow-[#39FF78]/20'
                      : 'bg-[#0B1210]/80 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 shadow-2xl shadow-[#030806]/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030806]/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-[#39FF78]/15">
                  <tr>
                    <th className="px-5 py-4">Submission Date</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Waste Stream / Description</th>
                    <th className="px-5 py-4">Quantity Output</th>
                    <th className="px-5 py-4">Disposal Method</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Supervisor Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#39FF78]/10 text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-[#39FF78] font-mono">
                        Loading verified submission ledger...
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        No waste records found for selected category.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-[#39FF78]/5 transition-colors">
                        <td className="px-5 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">{r.date}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={r.waste_category || 'RECYCLABLE'} />
                        </td>
                        <td className="px-5 py-4 font-bold text-white">
                          <div>{r.activity}</div>
                          {r.hazard_level && r.hazard_level !== 'NONE' && (
                            <span className="text-[10px] text-rose-400 font-mono">Hazard: {r.hazard_level}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-[#39FF78] whitespace-nowrap">
                          {r.quantity} {r.unit}
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-xs">{r.disposal_method || 'Standard Sorting'}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-xs italic">
                          {r.remarks || 'Pending supervisor sign-off.'}
                        </td>
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

export default OperatorRecords;
