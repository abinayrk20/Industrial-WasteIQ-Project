import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock, ShieldCheck, AlertOctagon } from 'lucide-react';
import WasteIQLogo from '../components/WasteIQLogo';

const AccessDenied = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getDashboardPath } = useAuth();
  const [countdown, setCountdown] = useState(5);

  const state = location.state || {};
  const attemptedPath = state.attemptedPath || 'Restricted Endpoint';
  const userRole = user?.role || state.userRole || 'UNKNOWN';
  const redirectPath = user ? getDashboardPath(user.role) : '/login';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, redirectPath]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center relative z-10">
        <div className="flex justify-center mb-5">
          <WasteIQLogo size="sm" />
        </div>
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-950">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-rose-400 block mb-1">
          Security Intercept 403 &bull; RBAC Violation
        </span>

        <h1 className="text-2xl font-black text-white tracking-tight">
          ACCESS DENIED
        </h1>

        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Your current account role (<strong className="text-white font-mono">{userRole}</strong>) does not possess the requisite security clearance to access:
        </p>

        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-rose-400 break-all">
          {attemptedPath}
        </div>

        <div className="mt-4 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-600" />
          <span>Incident recorded to Immutable Security Audit Logs.</span>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col gap-3">
          <button
            onClick={() => navigate(redirectPath)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Dashboard ({countdown}s)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
