import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Employee, EmployeeCategory, SalaryBreakdown, PayrollRecord } from '../types';
import { calculateSalaryBreakdown, formatINR, numberToWordsIndian } from '../services/payrollService';
import { COMPANY_INFO } from '../data/initialData';

interface PayrollCalculationViewProps {
  employees: Employee[];
  selectedEmployeeId?: string;
  onCommitPayroll: (record: PayrollRecord) => { success: boolean; message: string };
  onGenerateSlip: (employee: Employee, breakdown: SalaryBreakdown, month: string) => void;
}

export const PayrollCalculationView: React.FC<PayrollCalculationViewProps> = ({
  employees,
  selectedEmployeeId,
  onCommitPayroll,
  onGenerateSlip,
}) => {
  // Select active employee
  const [empId, setEmpId] = useState<string>(selectedEmployeeId || (employees[0]?.id || ''));
  const currentEmployee = employees.find(e => e.id === empId) || employees[0];

  // Configurable parameters
  const [basicSalary, setBasicSalary] = useState<number>(currentEmployee ? currentEmployee.basicSalary : 50000);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [payMonth, setPayMonth] = useState<string>('November 2026');
  const [useOopOverride, setUseOopOverride] = useState<boolean>(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // When selected employee changes, update basic salary
  useEffect(() => {
    if (currentEmployee) {
      setBasicSalary(currentEmployee.basicSalary);
    }
  }, [empId]);

  // Compute breakdown dynamically in real-time
  const breakdown: SalaryBreakdown = calculateSalaryBreakdown(
    basicSalary,
    currentEmployee ? currentEmployee.category : 'PERMANENT',
    otherDeductions,
    !useOopOverride // strictStandard if false
  );

  const handleProcessAndCommit = () => {
    if (!currentEmployee) return;

    const record: PayrollRecord = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name,
      department: currentEmployee.department,
      designation: currentEmployee.designation,
      category: currentEmployee.category,
      month: payMonth,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Bank Transfer',
      transactionRef: `NEFT-PI-${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: 'Paid',
      authorizedBy: `${COMPANY_INFO.chairman}, Chairman`,
      breakdown,
    };

    const res = onCommitPayroll(record);
    if (res.success) {
      setSuccessToast(`Disbursed salary for ${currentEmployee.name} (${formatINR(breakdown.netSalary)}) to corporate ledger.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <span>Automated Payroll Calculation Engine</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time arithmetic calculation with OOP Category Inheritance (Permanent, Contract, Intern)
          </p>
        </div>

        {/* OOP Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setUseOopOverride(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              useOopOverride 
                ? 'bg-slate-900 text-amber-400 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            OOP Method Overriding Mode
          </button>
          <button
            onClick={() => setUseOopOverride(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !useOopOverride 
                ? 'bg-slate-900 text-amber-400 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Strict Standard Formula
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid: Inputs vs Realtime Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span>Select Employee for Payroll</span>
            </h3>

            {/* Select Employee dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Choose Employee Record
              </label>
              <select
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.id} - {emp.name} ({emp.category} • {emp.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Quick Info Card */}
            {currentEmployee && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold text-slate-800">{currentEmployee.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{currentEmployee.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">OOP Category:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentEmployee.category === 'PERMANENT'
                      ? 'bg-sky-100 text-sky-800'
                      : currentEmployee.category === 'CONTRACT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {currentEmployee.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Joining Date:</span>
                  <span className="font-mono text-slate-700">{currentEmployee.joiningDate}</span>
                </div>
              </div>
            )}

            {/* Pay Month Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Payroll Period / Month</span>
              </label>
              <select
                value={payMonth}
                onChange={(e) => setPayMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="November 2026">November 2026</option>
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="December 2026">December 2026</option>
              </select>
            </div>

            {/* Basic Salary Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Monthly Basic Salary (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Math.max(0, Number(e.target.value) || 0))}
                  min="0"
                  step="500"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                All allowances and statutory deductions recalculate automatically on change.
              </p>
            </div>

            {/* Other Deductions Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Other Deductions (Loan / Advance / Loss of Pay) (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value) || 0))}
                  min="0"
                  step="100"
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

          </div>

          {/* OOP Logic Formula Explanation Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-amber-500/30 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                OOP Polymorphic Rules Applied
              </h4>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1.5 font-mono">
              <p>• HRA: {useOopOverride && currentEmployee?.category === 'CONTRACT' ? '15% (Contract)' : useOopOverride && currentEmployee?.category === 'INTERN' ? '0% (Exempt)' : '20% (Standard)'}</p>
              <p>• DA: {useOopOverride && currentEmployee?.category === 'CONTRACT' ? '8% (Contract)' : useOopOverride && currentEmployee?.category === 'INTERN' ? '0% (Exempt)' : '10% (Standard)'}</p>
              <p>• Medical: {useOopOverride && currentEmployee?.category === 'CONTRACT' ? '3% (Contract)' : useOopOverride && currentEmployee?.category === 'INTERN' ? '0% (Exempt)' : '5% (Standard)'}</p>
              <p>• Transport: {useOopOverride && currentEmployee?.category === 'CONTRACT' ? '₹800 fixed' : useOopOverride && currentEmployee?.category === 'INTERN' ? '₹500 subsidy' : '₹1,000 fixed'}</p>
              <p>• PF: {useOopOverride && currentEmployee?.category !== 'PERMANENT' ? '₹0 (Exempt/Direct)' : '12% of Basic (Statutory)'}</p>
              <p>• Professional Tax: {useOopOverride && currentEmployee?.category === 'INTERN' ? '₹0 (Exempt)' : '₹200 fixed'}</p>
            </div>
          </div>

        </div>

        {/* Right Salary Breakdown Card (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-amber-500/30">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>Calculated Salary Breakdown</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                    {payMonth}
                  </span>
                </h3>
                <p className="text-xs text-amber-300 mt-0.5">
                  Authorized by: {COMPANY_INFO.chairman}, Chairman
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Employee</span>
                <span className="text-xs font-bold text-white">{currentEmployee?.name}</span>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-6 space-y-6">
              
              {/* Earnings Table */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 mb-3">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Earnings & Allowances
                  </span>
                  <span>Amount (INR)</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Basic Salary:</span>
                    <span className="font-mono font-semibold text-slate-800">{formatINR(breakdown.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">House Rent Allowance (HRA):</span>
                    <span className="font-mono text-slate-800">{formatINR(breakdown.hra)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Dearness Allowance (DA):</span>
                    <span className="font-mono text-slate-800">{formatINR(breakdown.da)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Medical Allowance:</span>
                    <span className="font-mono text-slate-800">{formatINR(breakdown.medicalAllowance)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Transport Allowance:</span>
                    <span className="font-mono text-slate-800">{formatINR(breakdown.transportAllowance)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-emerald-50/60 px-3 rounded-lg text-emerald-900 font-bold">
                    <span>Total Gross Salary:</span>
                    <span className="font-mono">{formatINR(breakdown.grossSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Table */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 mb-3">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                    Statutory Deductions
                  </span>
                  <span>Amount (INR)</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Provident Fund (PF - 12%):</span>
                    <span className="font-mono text-slate-800">{formatINR(breakdown.pf)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Professional Tax (PT):</span>
                    <span className="font-mono text-slate-800">{formatINR(breakdown.professionalTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Other Deductions:</span>
                    <span className="font-mono text-slate-800">{formatINR(breakdown.otherDeductions)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-red-50/60 px-3 rounded-lg text-red-900 font-bold">
                    <span>Total Deductions:</span>
                    <span className="font-mono">{formatINR(breakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* NET SALARY PAYABLE CALLOUT */}
              <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 shadow-lg border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Net Salary Payable (Take-Home)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {formatINR(breakdown.netSalary)}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {numberToWordsIndian(breakdown.netSalary)}
                  </p>
                </div>

                <div className="hidden sm:block text-right">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-lg">
                    PI
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleProcessAndCommit}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-amber-500/30"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Disburse & Record in Payroll Ledger</span>
                </button>

                <button
                  onClick={() => {
                    if (currentEmployee) {
                      onGenerateSlip(currentEmployee, breakdown, payMonth);
                    }
                  }}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Preview Official Slip</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
