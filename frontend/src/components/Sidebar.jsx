import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  CheckSquare,
  ClipboardList,
  FolderLock,
  ShieldCheck,
  HardHat,
  Eye,
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'CLIENT_VIEWER';

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Operator Management', path: '/admin/operators', icon: Users },
    { name: 'Projects & Sites', path: '/admin/projects', icon: Briefcase },
    { name: 'Approvals & Reports', path: '/admin/reports', icon: FileCheck },
    { name: 'System Settings & Security', path: '/admin/settings', icon: Settings },
  ];

  const operatorNav = [
    { name: 'Operator Station', path: '/operator/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Tasks', path: '/operator/tasks', icon: CheckSquare },
    { name: 'Daily Activity Logs', path: '/operator/records', icon: ClipboardList },
    { name: 'Personal Reports', path: '/operator/reports', icon: FileText },
  ];

  const clientNav = [
    { name: 'Client Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Approved Progress Reports', path: '/client/reports', icon: FileText },
    { name: 'Permitted Documents', path: '/client/documents', icon: FolderLock },
  ];

  const currentNav = role === 'ADMIN' ? adminNav : role === 'OPERATOR' ? operatorNav : clientNav;

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-[calc(100vh-61px)] flex flex-col justify-between p-4 border-r border-slate-800 shadow-inner">
      <div>
        <div className="px-3 py-2 mb-4">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400 block">
            {role === 'ADMIN' ? 'Tier-1 Administration' : role === 'OPERATOR' ? 'Field Operational Terminal' : 'Client Access Portal'}
          </span>
          <p className="text-xs font-bold text-white mt-0.5">
            {role === 'ADMIN' ? 'Executive Control Hub' : role === 'OPERATOR' ? 'Shift Workstation' : 'Verified Read-Only View'}
          </p>
        </div>

        <nav className="space-y-1.5">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto shadow-sm shadow-emerald-400"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Security Status Box */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>RBAC Enforced</span>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {role === 'ADMIN' ? 'LVL 3' : role === 'OPERATOR' ? 'LVL 2' : 'LVL 1 (RO)'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {role === 'ADMIN'
            ? 'Full CRUD, user management, and approval authority.'
            : role === 'OPERATOR'
            ? 'Scoped strictly to assigned tasks and personal activity entries.'
            : 'Strictly read-only access. Write mutations prohibited.'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
