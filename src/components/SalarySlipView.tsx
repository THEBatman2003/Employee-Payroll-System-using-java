import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Award,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Employee, SalaryBreakdown } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { calculateSalaryBreakdown, formatINR, numberToWordsIndian } from '../services/payrollService';
import { generateSalarySlipPDF } from '../services/pdfService';

interface SalarySlipViewProps {
  employees: Employee[];
  initialEmployee?: Employee;
  initialMonth?: string;
}

export const SalarySlipView: React.FC<SalarySlipViewProps> = ({
  employees,
  initialEmployee,
  initialMonth = 'November 2026',
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmployee ? initialEmployee.id : (employees[0]?.id || ''));
  const [payMonth, setPayMonth] = useState<string>(initialMonth);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const slipRef = useRef<HTMLDivElement>(null);

  const currentEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];
  const breakdown: SalaryBreakdown = currentEmployee 
    ? calculateSalaryBreakdown(currentEmployee.basicSalary, currentEmployee.category, otherDeductions)
    : calculateSalaryBreakdown(50000, 'PERMANENT', 0);

  const handleDownloadPDF = () => {
    if (!currentEmployee) return;
    generateSalarySlipPDF(currentEmployee, breakdown, payMonth);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentEmployee) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-semibold">No employee selected. Please register an employee first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Control Panel (Hidden on print) */}
      <div className="print:hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Employee Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Employee
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} - {emp.name} ({emp.category})
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Payroll Period
            </label>
            <select
              value={payMonth}
              onChange={(e) => setPayMonth(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="November 2026">November 2026</option>
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="December 2026">December 2026</option>
            </select>
          </div>
        </div>

        {/* Print & PDF Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Document</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-slate-900/20 transition-all cursor-pointer border border-amber-500/30"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Certified PDF</span>
          </button>
        </div>
      </div>

      {/* Official Printable Salary Slip Document Container */}
      <div 
        ref={slipRef}
        className="bg-white rounded-2xl shadow-xl border-2 border-slate-900 p-8 sm:p-10 text-slate-900 relative overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        {/* Gold Accent Top Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

        {/* Corporate Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Logo and Titles */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center border-2 border-amber-400 shadow-lg">
                <span className="text-amber-400 font-black text-2xl tracking-tighter">PI</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {COMPANY_INFO.name}
                </h1>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                  <Award className="w-3.5 h-3.5" />
                  <span>Chairman: <strong>{COMPANY_INFO.chairman}</strong></span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {COMPANY_INFO.headquarters} • CIN: {COMPANY_INFO.cin}
                </p>
              </div>
            </div>

            {/* Document Title Badge */}
            <div className="text-center sm:text-right bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Official Document</span>
              <span className="text-sm font-extrabold text-slate-900 uppercase">MONTHLY SALARY SLIP</span>
              <span className="text-xs font-bold text-amber-600 block mt-0.5">{payMonth}</span>
            </div>

          </div>
        </div>

        {/* Employee Info Grid (2 Columns) */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 mb-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500 font-medium">Employee ID:</span>
              <span className="font-mono font-bold text-slate-900">{currentEmployee.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500 font-medium">Department:</span>
              <span className="font-bold text-slate-900">{currentEmployee.department}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500 font-medium">Employee Name:</span>
              <span className="font-bold text-slate-900">{currentEmployee.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500 font-medium">Designation:</span>
              <span className="font-bold text-slate-900">{currentEmployee.designation}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500 font-medium">Employee Category:</span>
              <span className="font-bold text-slate-900">{currentEmployee.category} EMPLOYEE</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500 font-medium">Date of Joining:</span>
              <span className="font-mono text-slate-900">{currentEmployee.joiningDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Official Email:</span>
              <span className="text-slate-900">{currentEmployee.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Salary Generation Date:</span>
              <span className="font-mono text-slate-900">{new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Table: Earnings vs Deductions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          
          {/* Earnings (Allowances) Column */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>Earnings (Allowances)</span>
              <span>Amount (₹)</span>
            </div>
            <div className="p-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Basic Salary</span>
                <span className="font-mono font-semibold">{formatINR(breakdown.basicSalary)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">House Rent Allowance (HRA)</span>
                <span className="font-mono">{formatINR(breakdown.hra)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Dearness Allowance (DA)</span>
                <span className="font-mono">{formatINR(breakdown.da)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Medical Allowance</span>
                <span className="font-mono">{formatINR(breakdown.medicalAllowance)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Transport Allowance</span>
                <span className="font-mono">{formatINR(breakdown.transportAllowance)}</span>
              </div>
            </div>
            <div className="bg-slate-100/80 px-4 py-2.5 flex justify-between text-xs font-extrabold text-slate-900 border-t border-slate-200">
              <span>TOTAL GROSS SALARY:</span>
              <span className="font-mono text-emerald-800">{formatINR(breakdown.grossSalary)}</span>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>Statutory Deductions</span>
              <span>Amount (₹)</span>
            </div>
            <div className="p-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Provident Fund (PF - 12%)</span>
                <span className="font-mono font-semibold">{formatINR(breakdown.pf)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Professional Tax (PT)</span>
                <span className="font-mono">{formatINR(breakdown.professionalTax)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Other Deductions / TDS</span>
                <span className="font-mono">{formatINR(breakdown.otherDeductions)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Leave / LOP Deductions</span>
                <span className="font-mono">₹ 0.00</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Staff Welfare Fund</span>
                <span className="font-mono">₹ 0.00</span>
              </div>
            </div>
            <div className="bg-slate-100/80 px-4 py-2.5 flex justify-between text-xs font-extrabold text-slate-900 border-t border-slate-200">
              <span>TOTAL DEDUCTIONS:</span>
              <span className="font-mono text-red-800">{formatINR(breakdown.totalDeductions)}</span>
            </div>
          </div>

        </div>

        {/* Net Salary Payable Callout */}
        <div className="bg-slate-900 text-white rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-2 border-amber-400">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              NET SALARY PAYABLE:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">
              {formatINR(breakdown.netSalary)}
            </div>
            <p className="text-xs text-slate-300 italic mt-1">
              Amount in Words: <strong>{numberToWordsIndian(breakdown.netSalary)}</strong>
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Disbursement Mode</span>
            <span className="text-xs font-bold text-white">Direct Bank NEFT / RTGS</span>
            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">Ref: TXN-PI-{currentEmployee.id}-2026</span>
          </div>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center items-end">
          
          {/* Employee Signature */}
          <div className="space-y-2">
            <div className="h-10 border-b border-slate-400 mx-auto w-36"></div>
            <p className="text-xs font-semibold text-slate-700">Employee Signature</p>
            <p className="text-[10px] text-slate-400">Received & Verified</p>
          </div>

          {/* PAL INDUSTRIES Corporate Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500/80 flex flex-col items-center justify-center text-center p-1">
              <span className="text-[8px] font-black uppercase text-amber-600">PAL INDUSTRIES</span>
              <span className="text-xs font-black text-slate-900">SEAL</span>
              <span className="text-[7px] text-slate-500">PAYROLL AUTH</span>
            </div>
          </div>

          {/* Authorized by Chairman ANKUR PAL */}
          <div className="space-y-1">
            <p className="text-sm font-extrabold text-slate-950 font-serif">ANKUR PAL</p>
            <div className="border-b border-slate-900 mx-auto w-40"></div>
            <p className="text-xs font-bold text-amber-700">
              Authorized by: ANKUR PAL, Chairman
            </p>
            <p className="text-[10px] text-slate-500">PAL INDUSTRIES Corporate Office</p>
          </div>

        </div>

        {/* Formal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
          This is an official computer-generated payroll certificate issued by PAL INDUSTRIES. Any query regarding tax deductions must be addressed to the Finance Department within 7 days.
        </div>

      </div>

    </div>
  );
};
