import React from 'react';
import { useAuth } from '../context/AuthContext';
import WasteIQLogo from './WasteIQLogo';
import {
  ShieldCheck,
  HardHat,
  Eye,
  LogOut,
  Download,
  ShieldAlert
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: ShieldCheck,
          label: 'ADMINISTRATOR',
          className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        };
      case 'OPERATOR':
        return {
          icon: HardHat,
          label: 'OPERATOR',
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'CLIENT_VIEWER':
        return {
          icon: Eye,
          label: 'CLIENT (READ ONLY)',
          className: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        };
      default:
        return {
          icon: ShieldAlert,
          label: role,
          className: 'bg-slate-800 text-slate-400 border-slate-700',
        };
    }
  };

  const badge = getRoleBadge(user?.role);
  const BadgeIcon = badge.icon;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/90 sticky top-0 z-30 px-6 py-2.5 shadow-xl text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex items-center justify-between">
        {/* Waste-IQ Brand Logo */}
        <div className="flex items-center gap-4">
          <WasteIQLogo size="sm" />
          <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
            RBAC v2.4
          </span>
        </div>

        {/* User Identity & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Operator ID Badge if Operator */}
          {user?.operator_id && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono text-xs font-bold shadow-xs">
              <HardHat className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user.operator_id}</span>
            </div>
          )}

          {/* Role Clearance Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider ${badge.className}`}>
            <BadgeIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </div>

          {/* Quick Direct Download Project Button */}
          <a
            href="https://github.com/abinayrk20/Industrial-WasteIQ-Project/archive/refs/heads/main.zip"
            target="_blank"
            rel="noopener noreferrer"
            title="Download complete Project ZIP"
            className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Project ZIP</span>
          </a>

          {/* Profile Details */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-slate-200 block leading-tight">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-mono block">{user?.email}</span>
            </div>

            <button
              onClick={logout}
              title="Logout from session"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-3 py-2 rounded-xl transition-colors border border-transparent hover:border-rose-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
