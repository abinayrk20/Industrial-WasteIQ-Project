import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WasteIQLogo from '../components/WasteIQLogo';
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  HardHat,
  Eye as ClientEye,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [designation, setDesignation] = useState('');
  const [employeeType, setEmployeeType] = useState('OPERATOR');
  const [employeeId, setEmployeeId] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminClearanceKey, setAdminClearanceKey] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !userId.trim() || !email.trim() || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (age && (parseInt(age) < 18 || parseInt(age) > 80)) {
      setError('Age must be between 18 and 80.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (employeeType === 'ADMIN' && adminClearanceKey !== 'WASTEIQ-ADMIN-2026') {
      setError('Security Restriction: Admin creation requires valid Master Clearance Key. Please use key "WASTEIQ-ADMIN-2026" or select Operator/Client.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: fullName.trim(),
        age: age ? parseInt(age) : null,
        designation: designation.trim() || (employeeType === 'OPERATOR' ? 'Waste Operations Specialist' : 'Sustainability Auditor'),
        employee_id: employeeId.trim(),
        user_id: userId.trim(),
        email: email.trim(),
        password: password,
        role: employeeType,
        admin_clearance_code: adminClearanceKey.trim(),
        department: designation.trim() || 'Industrial Operations'
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      const msg = err.response?.data?.user_id?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.employee_id?.[0] ||
        err.response?.data?.admin_clearance_code ||
        err.response?.data?.detail ||
        'Registration failed. Please verify your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#030806] overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 3D Eco-Tech Futuristic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/industrial-wasteiq-hero.jpg')" }}
      />
      {/* Dark Obsidian Frosted Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030806]/90 via-[#030806]/85 to-[#030806]/95 backdrop-blur-md" />
      <div className="absolute inset-0 bg-[radial-gradient(#39FF78_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Main Registration Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0B1210]/90 backdrop-blur-2xl border border-[#39FF78]/25 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/90 my-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#39FF78]/20 mb-6">
          <WasteIQLogo size="lg" />
          <div className="text-right sm:text-right text-center">
            <span className="text-[11px] font-mono text-[#39FF78] font-bold uppercase tracking-wider block">
              Personnel Enrollment
            </span>
            <span className="text-xs text-[#8FA89B]">
              RBAC Verified Identity
            </span>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs rounded-xl p-3.5 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 bg-[#39FF78]/10 border border-[#39FF78]/40 text-[#39FF78] text-xs rounded-xl p-3.5 flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#39FF78] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Registration successful! Redirecting to login portal in 2 seconds...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Full Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abinaya Rajesh"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] focus:ring-1 focus:ring-[#39FF78]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                Age
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] focus:ring-1 focus:ring-[#39FF78]"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Designation & Employee ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                Designation
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Hazardous Waste Specialist"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] focus:ring-1 focus:ring-[#39FF78]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                Employee ID
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-4015 (or auto-allocated)"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] focus:ring-1 focus:ring-[#39FF78] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Role / Employee Type Selection */}
          <div>
            <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-2">
              Employee Type (Role Access) *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'OPERATOR', label: 'Operator', desc: 'Waste Logging & Sorting', icon: HardHat, color: 'text-[#39FF78]' },
                { id: 'ADMIN', label: 'Admin', desc: 'Full System Control (Restricted)', icon: ShieldCheck, color: 'text-amber-400' },
                { id: 'CLIENT_VIEWER', label: 'Client', desc: 'View-Only Reports & Audit', icon: ClientEye, color: 'text-sky-400' },
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = employeeType === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setEmployeeType(r.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#39FF78] bg-[#39FF78]/10 ring-1 ring-[#39FF78]'
                        : 'border-slate-800 bg-[#030806]/60 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? r.color : 'text-slate-500'}`} />
                    <span className="block text-xs font-bold text-[#F4FFF7]">{r.label}</span>
                    <span className="block text-[10px] text-[#8FA89B] leading-tight mt-0.5">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Admin Clearance Key Field (Security Requirement) */}
          {employeeType === 'ADMIN' && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-fadeIn">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Admin Master Clearance Key *</span>
              </label>
              <input
                type="password"
                required
                value={adminClearanceKey}
                onChange={(e) => setAdminClearanceKey(e.target.value)}
                placeholder="Enter Master Security Key (WASTEIQ-ADMIN-2026)"
                className="w-full px-3 py-2 bg-[#030806] border border-amber-500/40 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-amber-400/80 block mt-1">
                Security Policy: Unrestricted admin creation is prohibited. Use key: <code className="text-white font-mono">WASTEIQ-ADMIN-2026</code>
              </span>
            </div>
          )}

          {/* Row 4: User ID (Username) & Corporate Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                User ID / Username *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. abinaya20"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                Corporate Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. abinaya@wasteiq.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F4FFF7] uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[#8FA89B]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#030806]/85 border border-[#39FF78]/25 rounded-xl text-xs sm:text-sm text-[#F4FFF7] placeholder-slate-500 focus:outline-none focus:border-[#39FF78] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-4 py-3.5 px-4 rounded-xl text-sm font-bold text-[#030806] bg-[#39FF78] hover:bg-[#00E676] active:scale-[0.99] shadow-lg shadow-[#39FF78]/30 transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Back to Login */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-[#8FA89B]">
            Already have an authorized account?{' '}
            <Link to="/login" className="text-[#39FF78] hover:underline font-bold">
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
