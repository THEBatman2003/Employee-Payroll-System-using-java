import React from 'react';
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  Wallet, 
  TrendingUp, 
  UserPlus, 
  Calculator, 
  FileCheck2, 
  Download, 
  Building2, 
  Award,
  ArrowRight,
  ShieldAlert,
  CalendarCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Employee, PayrollRecord } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { formatINR, calculateSalaryBreakdown } from '../services/payrollService';

interface DashboardViewProps {
  employees: Employee[];
  payrollHistory: PayrollRecord[];
  onNavigate: (tab: string) => void;
  onOpenEmployeeForm: () => void;
  onSelectEmployeeForSalary: (emp: Employee) => void;
  onDownloadProjectZip: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  payrollHistory,
  onNavigate,
  onOpenEmployeeForm,
  onSelectEmployeeForSalary,
  onDownloadProjectZip,
}) => {
  // Statistics calculations
  const totalEmployees = employees.length;
  const permanentCount = employees.filter(e => e.category === 'PERMANENT').length;
  const contractCount = employees.filter(e => e.category === 'CONTRACT').length;
  const internCount = employees.filter(e => e.category === 'INTERN').length;

  // Monthly payroll calculation across all current employees
  const totalMonthlyPayroll = employees.reduce((sum, emp) => {
    const breakdown = calculateSalaryBreakdown(emp.basicSalary, emp.category, 0);
    return sum + breakdown.grossSalary;
  }, 0);

  const totalMonthlyNet = employees.reduce((sum, emp) => {
    const breakdown = calculateSalaryBreakdown(emp.basicSalary, emp.category, 0);
    return sum + breakdown.netSalary;
  }, 0);

  const averageSalary = totalEmployees > 0 ? (totalMonthlyPayroll / totalEmployees) : 0;

  // Department Distribution
  const departmentCounts: Record<string, number> = {};
  employees.forEach(emp => {
    departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Welcome & Corporate Notice Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background decorative shield */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Chairman Office • ANKUR PAL</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome to <span className="text-amber-400">{COMPANY_INFO.name}</span>
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Executive Employee Payroll Management System. Manage corporate workforce records, automated statutory salary calculations (HRA 20%, DA 10%, Medical 5%, PF 12%, PT), and generate official salary slips authorized by <strong>Chairman {COMPANY_INFO.chairman}</strong>.
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenEmployeeForm}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>

            <button
              onClick={() => onNavigate('payroll')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Calculate Payroll</span>
            </button>

            <button
              onClick={onDownloadProjectZip}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all cursor-pointer"
              title="Download entire Java Swing + MySQL Mini Project"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Java Project (.zip)</span>
              <span className="sm:hidden">Java .zip</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalEmployees}</div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> All departments
          </p>
        </div>

        {/* Permanent Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">Permanent</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-950">{permanentCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Full statutory benefits</p>
        </div>

        {/* Contract Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Contract</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950">{contractCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Fixed term agreements</p>
        </div>

        {/* Intern Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Interns</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-950">{internCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Stipend-based training</p>
        </div>

        {/* Total Monthly Payroll */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Monthly Gross</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 truncate" title={formatINR(totalMonthlyPayroll)}>
            {formatINR(totalMonthlyPayroll)}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Net: {formatINR(totalMonthlyNet)}
          </p>
        </div>

        {/* Average Salary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg. Salary</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 truncate" title={formatINR(averageSalary)}>
            {formatINR(averageSalary)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Per active employee</p>
        </div>

      </div>

      {/* Grid: Recent Employees & Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Recent Employee Registrations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Workforce Registrations</h3>
                <p className="text-xs text-slate-500">Latest employees added to PAL INDUSTRIES master records</p>
              </div>

              <button
                onClick={() => onNavigate('employees')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
              >
                <span>View All In Table</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Basic Salary</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.slice(0, 5).map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{emp.id} • {emp.designation}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {emp.department}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.category === 'PERMANENT'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : emp.category === 'CONTRACT'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-teal-50 text-teal-700 border border-teal-200'
                        }`}>
                          {emp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                        {formatINR(emp.basicSalary)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onSelectEmployeeForSalary(emp)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-semibold transition-colors"
                        >
                          Generate Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing top 5 of {totalEmployees} registered employees</span>
            <span className="font-mono text-slate-400">Database: pal_industries_payroll</span>
          </div>
        </div>

        {/* Right (1 col): Department Breakdown & Company Information */}
        <div className="space-y-6">
          
          {/* Department Breakdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">Department Allocation</h3>
            <p className="text-xs text-slate-500 mb-4">Workforce distribution across business divisions</p>

            <div className="space-y-3">
              {Object.entries(departmentCounts).map(([dept, count]) => {
                const percentage = Math.round((count / Math.max(1, totalEmployees)) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{dept}</span>
                      <span className="text-slate-500">{count} staff ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-800 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corporate Leadership Notice */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-amber-500/30 shadow-md space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                PI
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">PAL INDUSTRIES</h4>
                <p className="text-[11px] text-amber-400 font-semibold">Chairman: {COMPANY_INFO.chairman}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "Ensuring punctuality, transparency, and statutory compliance in employee payroll management across our national operations."
            </p>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>HQ: Cyber City, New Delhi</span>
              <span className="text-amber-400">Est. {COMPANY_INFO.established}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Payroll Activities Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Disbursed Payroll Records</h3>
            <p className="text-xs text-slate-500">Processed electronic salary disbursements authorized by Chairman Desk</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>Full Payroll Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {payrollHistory.slice(0, 3).map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.employeeName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Month: <strong>{item.month}</strong></span>
                <span className="font-mono text-slate-700 font-semibold">{formatINR(item.breakdown.netSalary)}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between border-t border-slate-200/60 pt-1.5">
                <span>Ref: {item.transactionRef}</span>
                <span className="text-amber-700 font-medium">Auth: {COMPANY_INFO.chairman}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
