import React from 'react';
import { 
  Building2, 
  User, 
  LogOut, 
  Code2, 
  Info, 
  RotateCcw,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';
import { COMPANY_INFO } from '../data/initialData';

interface HeaderProps {
  currentUser: string;
  onLogout: () => void;
  onOpenCompanyInfo: () => void;
  onOpenJavaKit: () => void;
  onResetData: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenCompanyInfo,
  onOpenJavaKit,
  onResetData,
  activeTab,
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');
  const [currentDate, setCurrentDate] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Monogram & Corporate Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300">
              <span className="text-slate-950 font-black text-xl tracking-tighter">PI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  {COMPANY_INFO.name}
                  <span className="hidden md:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Enterprise Payroll
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Chairman: <strong className="text-amber-400 font-semibold">{COMPANY_INFO.chairman}</strong></span>
                <span className="text-slate-600">•</span>
                <span className="hidden sm:inline text-slate-400">Desktop Payroll Management System</span>
              </p>
            </div>
          </div>

          {/* Center/Right: Live Date/Time & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Live Clock badge */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentDate}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-300 font-mono font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentTime}</span>
              </div>
            </div>

            {/* Quick Java Source Code Button */}
            <button
              onClick={onOpenJavaKit}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                activeTab === 'java-kit'
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                  : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
              }`}
              title="View full Java Swing + MySQL source code, OOP viva answers & download project ZIP"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Java Code & Viva Kit</span>
              <span className="md:hidden">Java Kit</span>
            </button>

            {/* Company Info Button */}
            <button
              onClick={onOpenCompanyInfo}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="PAL INDUSTRIES Company Profile & Chairman Note"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Company Info</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">{currentUser}</span>
                <span className="text-[10px] text-amber-400/90 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> Administrator
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                title="Logout from PAL INDUSTRIES system"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
