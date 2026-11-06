import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Award, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Key, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { COMPANY_INFO } from '../data/initialData';
import { StorageService } from '../services/storageService';

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const res = StorageService.updatePassword(oldPassword, newPassword);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg">
              PI
            </div>
            <div>
              <h3 className="font-bold text-base">{COMPANY_INFO.name}</h3>
              <p className="text-xs text-amber-400 font-semibold">Chairman: {COMPANY_INFO.chairman}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Corporate Profile & Chairman
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'password'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Change Admin Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' ? (
            <div className="space-y-4 text-xs">
              
              {/* Chairman Statement */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Executive Note from Chairman ANKUR PAL</span>
                </div>
                <p className="text-slate-700 italic leading-relaxed">
                  "At PAL INDUSTRIES, our people are our highest asset. This payroll management software reflects our commitment to absolute transparency, statutory compliance, and precision in workforce compensation across all operations."
                </p>
                <p className="text-[11px] text-amber-900 font-semibold text-right">
                  — ANKUR PAL, Chairman
                </p>
              </div>

              {/* Corporate Details */}
              <div className="space-y-2 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span><strong>Headquarters:</strong> {COMPANY_INFO.headquarters}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Email:</strong> {COMPANY_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Phone:</strong> {COMPANY_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Corporate CIN:</strong> {COMPANY_INFO.cin}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
                <span>Established: {COMPANY_INFO.established}</span>
                <span>Currency: {COMPANY_INFO.currency}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <p className="text-slate-500">
                Update the master administrator password for the PAL INDUSTRIES internal portal.
              </p>

              {statusMsg && (
                <div className={`p-3 rounded-xl flex items-center gap-2 font-medium ${
                  statusMsg.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password (default: admin123)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
