import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  FileText, 
  History, 
  Code2, 
  Database,
  Building,
  CheckCircle2
} from 'lucide-react';
import { COMPANY_INFO } from '../data/initialData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employeeCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  employeeCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'employees',
      label: 'Employee Management',
      icon: Users,
      badge: employeeCount > 0 ? String(employeeCount) : null,
    },
    {
      id: 'payroll',
      label: 'Payroll Calculator',
      icon: Calculator,
      badge: 'Auto',
    },
    {
      id: 'salary-slip',
      label: 'Salary Slip Generator',
      icon: FileText,
      badge: 'PDF',
    },
    {
      id: 'history',
      label: 'Payroll History & Ledger',
      icon: History,
      badge: null,
    },
    {
      id: 'java-kit',
      label: 'Java Project & Viva Kit',
      icon: Code2,
      badge: 'B.Tech',
      highlight: true,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-lg select-none">
      <div className="p-4 space-y-6">
        
        {/* Navigation List */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System Modules
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : item.highlight
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-slate-950 text-amber-400' 
                        : item.highlight 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Corporate Status Card */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Database Status</span>
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Connected
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            MySQL: <span className="text-slate-200">pal_industries_payroll</span>
          </div>

          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Auth Level:</span>
            <span className="text-amber-400 font-semibold">Executive (Root)</span>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-[10px]">
            PI
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate">{COMPANY_INFO.name}</p>
            <p className="text-[10px] text-amber-400 truncate">Chairman: {COMPANY_INFO.chairman}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
