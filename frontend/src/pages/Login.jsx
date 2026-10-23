import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WasteIQLogo from '../components/WasteIQLogo';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HardHat,
  Eye as ClientEye,
  KeyRound,
  UserPlus,
  X
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, forgotPassword, getDashboardPath } = useAuth();

  // Login Form States
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regUserId, setRegUserId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('OPERATOR');
  const [regDepartment, setRegDepartment] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Forgot Password Form States
  const [forgotUserId, setForgotUserId] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter your User ID or Email.');
      return;
    }
    if (!password) {
      setError('Please enter your Password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const user = await login(userId.trim(), password);
      const redirectPath = getDashboardPath(user.role);
      navigate(redirectPath);
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0];
      setError(
        typeof detail === 'string'
          ? detail
          : !err.response
            ? 'Cannot reach the login server. Check your connection and try again.'
            : err.response.status >= 500
              ? 'The login service is temporarily unavailable. Please try again later.'
              : 'Login failed. Check your User ID or email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle User Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim() || !regUserId.trim() || !regEmail.trim()) {
      setRegError('All fields are required.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setRegLoading(true);
    try {
      await register({
        user_id: regUserId.trim(),
        name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        department: regDepartment.trim() || 'Waste-IQ Operations'
      });

      // Populate login User ID and close modal
      setUserId(regUserId.trim());
      setPassword('');
      setShowRegisterModal(false);
      setSuccessMsg(`Registration successful! User ID "${regUserId}" is ready. Enter your password to log in.`);
      setError('');

      // Reset reg form
      setRegFullName('');
      setRegUserId('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegDepartment('');
    } catch (err) {
      const msg = err.response?.data?.user_id?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Registration failed. Please check inputs and try again.';
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  // Handle Forgot Password Reset
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotUserId.trim()) {
      setForgotError('Please enter your User ID or registered Email.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('New passwords do not match.');
      return;
    }

    setForgotLoading(true);
    try {
      await forgotPassword(forgotUserId.trim(), forgotNewPassword);

      setUserId(forgotUserId.trim());
      setPassword('');
      setShowForgotModal(false);
      setSuccessMsg('Password updated successfully! Please log in with your new password.');
      setError('');

      setForgotUserId('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.user_id?.[0] ||
        err.response?.data?.detail ||
        'Password reset failed. Verify your User ID / Email.';
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#030806] overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. 3D Crystal Recycling Hero Background from Reference Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/industrial-wasteiq-hero.jpg')" }}
      />
      {/* Dark Obsidian Glass Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030806]/90 via-[#030806]/85 to-[#030806]/95 backdrop-blur-md" />
      {/* Ambient Neon Radial Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#39FF78_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#39FF78]/10 via-[#00A86B]/5 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Main Center Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0B1210]/90 backdrop-blur-2xl border border-[#39FF78]/25 hover:border-[#39FF78]/50 transition-all rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90">
        
        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <WasteIQLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>Waste-IQ</span>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold tracking-wide">
              RBAC v2.4
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Industrial Waste Management & Operations Platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs rounded-xl p-3 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl p-3 flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* 3. Login Form: Strictly User ID and Password */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Field 1: User ID */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>User ID</span>
              <span className="text-[10px] text-slate-500 lowercase font-normal font-mono">
                username or email
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID or Email"
                className="block w-full pl-10 pr-3 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options: Left -> "Forgot Password?", Right -> "New User? Sign Up" */}
          <div className="flex items-center justify-between text-xs pt-1 pb-1">
            <button
              type="button"
              onClick={() => {
                setForgotUserId(userId);
                setForgotError('');
                setShowForgotModal(true);
              }}
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-1 group"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <span>Forgot Password?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegError('');
                setShowRegisterModal(true);
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold flex items-center gap-1 group"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              <span>New User? Sign Up</span>
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:via-teal-400 hover:to-emerald-500 active:scale-[0.99] shadow-lg shadow-emerald-950/70 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      </div>

      {/* ========================================================================= */}
      {/* 5. NEW USER SIGN UP MODAL */}
      {/* ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create New Account</h3>
                  <p className="text-xs text-slate-400">Waste-IQ Industrial Registration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {regError && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Full Name & User ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Abinaya R"
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    User ID (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regUserId}
                    onChange={(e) => setRegUserId(e.target.value)}
                    placeholder="e.g. abinaya20"
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. abinaya@wasteiq.com"
                  className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select System Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'OPERATOR', label: 'Operator', desc: 'Plant & Site Work', icon: HardHat },
                    { id: 'ADMIN', label: 'Admin', desc: 'Full Governance', icon: ShieldCheck },
                    { id: 'CLIENT_VIEWER', label: 'Client', desc: 'View-Only Audits', icon: ClientEye },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isChecked = regRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRegRole(r.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${isChecked ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className="block text-xs font-bold text-white">{r.label}</span>
                        <span className="block text-[10px] text-slate-400 leading-tight">{r.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Department (Optional for Operator) */}
              {regRole === 'OPERATOR' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Department (Optional)
                  </label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. Hazardous Materials / Refinery Unit 4"
                    className="block w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={regLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950 disabled:opacity-50"
                >
                  {regLoading ? 'Registering...' : 'Complete Sign Up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FORGOT PASSWORD MODAL */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Reset Password</h3>
                  <p className="text-xs text-slate-400">Direct Database Password Update</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  User ID or Registered Email *
                </label>
                <input
                  type="text"
                  required
                  value={forgotUserId}
                  onChange={(e) => setForgotUserId(e.target.value)}
                  placeholder="e.g. admin or operator04 or email"
                  className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 active:bg-amber-700 transition-all flex items-center gap-2 shadow-lg shadow-amber-950 disabled:opacity-50"
                >
                  {forgotLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
