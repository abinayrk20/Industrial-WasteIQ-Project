import React, { useState, useEffect } from 'react';
import { clientApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { FolderLock, FileText, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Permitted Project Documentation & Certifications</h1>
              <p className="text-xs text-slate-500 mt-1">
                Authorized engineering drawings, safety sign-offs, and compliance audit certificates for client review.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200">
              CONFIDENTIAL &bull; STAKEHOLDER READ ONLY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                      {doc.document_type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">Project: {doc.project_name}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`Simulated Download of: ${doc.title}`); }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
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
