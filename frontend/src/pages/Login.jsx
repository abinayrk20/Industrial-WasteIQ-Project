import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WasteIQLogo from '../components/WasteIQLogo';
import {
  ShieldCheck,
  HardHat,
  Eye,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Activity,
  Layers,
  Recycle,
  Sparkles,
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
      badge: 'Level 3 Master',
      color: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20',
      activeRing: 'ring-2 ring-indigo-500',
    },
    {
      role: 'OPERATOR',
      title: 'David Chen',
      email: 'operator01@industrial.com',
      password: 'Operator@12345',
      icon: HardHat,
      badge: 'IND-OP-0001',
      color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      role: 'CLIENT_VIEWER',
      title: 'Client Stakeholder',
      email: 'client@industrial.com',
      password: 'Client@12345',
      icon: Eye,
      badge: 'Level 1 View-Only',
      color: 'border-sky-500/50 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20',
      activeRing: 'ring-2 ring-sky-500',
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
        'Authentication failed. Please verify corporate email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex items-center justify-center relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Industrial Image with Gradient Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/industrial-refinery.png"
          alt="Industrial Refinery Plant"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125 scale-105 transform motion-safe:transition-transform duration-1000"
        />
        {/* Cinematic Dual Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a] via-[#080d1a]/75 to-[#080d1a]/95" />
        {/* Atmospheric Glow Highlights */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT COLUMN: Industrial Brand Showcase & Telemetry */}
          <div className="lg:col-span-7 space-y-6">

            {/* Live Facility Telemetry Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/40 backdrop-blur-md text-emerald-400 text-xs font-mono font-semibold shadow-lg shadow-emerald-950/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>FACILITY TELEMETRY: REFINERY UNIT 04 ONLINE</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400">AI CORE ACTIVE</span>
            </div>

            {/* Waste-IQ Main Logo & Branding */}
            <div>
              <WasteIQLogo size="xl" />
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                AI Industrial Waste <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
                  Classification & Operations
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Autonomous real-time classification of industrial byproducts into <strong className="text-emerald-300">Recyclable</strong>, <strong className="text-amber-300">Reusable</strong>, and <strong className="text-rose-300">Hazardous</strong> streams, powered by machine learning and strict 3-tier Role-Based Access Control.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/30">
                  <Recycle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">ML Classification</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Random Forest inference on hazard, moisture & heat metrics</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 border border-amber-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Strict RBAC</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Admin CRUD, unique Operator badges & Client view-only isolation</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 border border-cyan-500/30">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Audit Registry</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Immutable audit logging on every production entry & login</p>
              </div>
            </div>

            {/* Live Metrics Ticker */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-400 border-t border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[10px]">INFERENCE ACCURACY</span>
                <span className="text-emerald-400 font-bold text-sm">99.4% Verified</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">CERTIFIED BADGES</span>
                <span className="text-amber-400 font-bold text-sm">IND-OP Series</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">SECURITY LEVEL</span>
                <span className="text-cyan-400 font-bold text-sm">Zero Breach Standard</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Glassmorphic Secure Clearance Terminal */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-black/80">

              {/* Subtle Ambient Card Top Border Glow */}
              <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

              {/* Terminal Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AUTHORIZED ACCESS GATEWAY
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    RBAC v2.4
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Sign In to Your Station</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select a clearance credential or enter corporate login.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1-Click Role Clearance Selectors */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    1-Click Role Clearance Demo:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Auto-Fills Form</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((acc) => {
                    const Icon = acc.icon;
                    const isSelected = email === acc.email;
                    return (
                      <button
                        key={`${acc.role}-${acc.email}`}
                        type="button"
                        onClick={() => handleSelectDemo(acc)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? `${acc.color} ${acc.activeRing} shadow-md`
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold block truncate text-slate-100">{acc.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">{acc.badge}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Corporate Email ID
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
                      placeholder="e.g. operator04@industrial.com"
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Security Password
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
                      placeholder="••••••••••••"
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Security Clearance...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize & Enter Station</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Security Assurance */}
              <div className="mt-5 pt-4 border-t border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                  <span>IMMUTABLE AUDIT LOGGING ACTIVE &bull; WASTE-IQ PROTOCOL</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
