import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Factory,
  ShieldCheck,
  HardHat,
  Eye,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, getDashboardPath } = useAuth();

  const [email, setEmail] = useState('admin@industrial.com');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'ADMIN',
      title: 'Administrator',
      email: 'admin@industrial.com',
      password: 'Admin@12345',
      icon: ShieldCheck,
      badge: 'Full Access (Level 3)',
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    },
    {
      role: 'OPERATOR',
      title: 'Operator 01',
      email: 'operator01@industrial.com',
      password: 'Operator@12345',
      icon: HardHat,
      badge: 'IND-OP-0001 (Level 2)',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      role: 'CLIENT_VIEWER',
      title: 'Client Viewer',
      email: 'client@industrial.com',
      password: 'Client@12345',
      icon: Eye,
      badge: 'Read-Only (Level 1)',
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    },
  ];

  const handleSelectDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      const redirect = getDashboardPath(user.role);
      navigate(redirect);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Authentication failed. Verify email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient mesh grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20">
          <Factory className="w-7 h-7" />
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Industrial Project Management
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Strict Role-Based Access Control & Operations Governance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 sm:px-10">
          {error && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Role Selector */}
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Instant Demo Clearance Login:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = email === acc.email;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleSelectDemo(acc)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${acc.color} shadow-sm ring-1 ring-emerald-500/50`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[11px] font-bold block leading-tight">{acc.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                  placeholder="name@industrial.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Authentication Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:from-emerald-700 shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>TLS 1.3 &bull; PBKDF2 Password Hashing &bull; JWT RBAC</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
