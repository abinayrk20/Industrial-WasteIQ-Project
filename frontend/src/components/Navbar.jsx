import React from 'react';
import { useAuth } from '../context/AuthContext';
import WasteIQLogo from './WasteIQLogo';
import {
  ShieldCheck,
  HardHat,
  Eye,
  LogOut,
  Download,
  ShieldAlert,
  User as UserIcon
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: ShieldCheck,
          label: 'ADMINISTRATOR',
          className: 'bg-emerald-500/10 text-[#39FF78] border-[#39FF78]/40 shadow-[0_0_10px_rgba(57,255,120,0.2)]',
        };
      case 'OPERATOR':
        return {
          icon: HardHat,
          label: 'OPERATOR',
          className: 'bg-[#00A86B]/15 text-[#39FF78] border-[#00A86B]/40',
        };
      case 'CLIENT_VIEWER':
      case 'CLIENT':
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
    <header className="bg-[#0B1210]/95 backdrop-blur-xl border-b border-[#39FF78]/20 sticky top-0 z-30 px-6 py-3 shadow-xl text-[#F4FFF7] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex items-center justify-between">
        {/* Waste-IQ Brand Logo */}
        <div className="flex items-center gap-4">
          <WasteIQLogo size="sm" />
          <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#063D28]/60 text-[#39FF78] border border-[#39FF78]/30">
            PROD v2.4
          </span>
        </div>

        {/* User Identity & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Operator ID Badge if Operator */}
          {user?.operator_id && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#063D28]/70 text-[#39FF78] border border-[#39FF78]/40 rounded-full font-mono text-xs font-bold shadow-[0_0_10px_rgba(57,255,120,0.2)]">
              <HardHat className="w-3.5 h-3.5 text-[#39FF78]" />
              <span>{user.operator_id}</span>
            </div>
          )}

          {/* Role Clearance Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider ${badge.className}`}>
            <BadgeIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </div>

          {/* Direct Download Project ZIP Button */}
          <a
            href="/download/"
            target="_blank"
            rel="noopener noreferrer"
            title="Download complete Project ZIP"
            className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-[#39FF78] hover:text-white bg-[#063D28]/40 hover:bg-[#063D28]/80 border border-[#39FF78]/30 px-2.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Project ZIP</span>
          </a>

          {/* Profile Details */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-[#F4FFF7] block leading-tight">{user?.name}</span>
              <span className="text-[10px] text-[#8FA89B] font-mono block">
                {user?.username ? `@${user.username}` : user?.email}
              </span>
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
