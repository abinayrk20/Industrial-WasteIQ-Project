import React, { useState, useEffect } from 'react';
import { clientApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { FolderLock, FileText, Download, CheckCircle2, ShieldCheck, Leaf } from 'lucide-react';

const ClientDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi.getDocuments()
      .then(setDocuments)
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
                  Regulatory & Compliance Vault
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Permitted Environmental Documentation
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Authorized chain-of-custody certificates, EPA permits, and engineering blueprints released for stakeholder review.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-2xl bg-cyan-500/15 text-cyan-300 text-[11px] font-mono font-bold border border-cyan-500/30 self-start sm:self-auto">
              STAKEHOLDER READ-ONLY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#0B1210]/85 backdrop-blur-xl rounded-3xl border border-[#39FF78]/20 p-5 shadow-xl shadow-[#030806]/70 flex flex-col justify-between hover:border-[#39FF78]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#39FF78]/15 text-[#39FF78] border border-[#39FF78]/30 uppercase">
                      {doc.document_type}
                    </span>
                    <span className="text-[10px] font-mono text-[#00E599] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#39FF78]" /> Approved
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 leading-snug">{doc.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">Facility: {doc.project_name}</p>
                </div>

                <div className="pt-3 border-t border-[#39FF78]/15 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => alert(`Accessing certified manifest for: ${doc.title}`)}
                    className="text-xs font-bold text-[#39FF78] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDocuments;
