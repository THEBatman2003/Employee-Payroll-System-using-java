import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  RotateCcw, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Building2,
  Printer,
  Eye,
  X
} from 'lucide-react';
import { PayrollRecord } from '../types';
import { formatINR } from '../services/payrollService';
import { COMPANY_INFO } from '../data/initialData';

interface PayrollHistoryViewProps {
  records: PayrollRecord[];
  onViewSalarySlip: (rec: PayrollRecord) => void;
}

export const PayrollHistoryView: React.FC<PayrollHistoryViewProps> = ({
  records,
  onViewSalarySlip,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [inspectRecord, setInspectRecord] = useState<PayrollRecord | null>(null);

  // Available unique months in records
  const availableMonths = Array.from(new Set(records.map(r => r.month)));

  // Filtered list
  const filtered = records.filter(r => {
    const matchesSearch = 
      r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth = selectedMonth === 'ALL' || r.month === selectedMonth;
    const matchesDept = selectedDept === 'ALL' || r.department === selectedDept;
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;

    return matchesSearch && matchesMonth && matchesDept && matchesCategory;
  });

  // Aggregated totals
  const totalExpenditureGross = filtered.reduce((sum, r) => sum + r.breakdown.grossSalary, 0);
  const totalExpenditureNet = filtered.reduce((sum, r) => sum + r.breakdown.netSalary, 0);
  const totalDeductions = filtered.reduce((sum, r) => sum + r.breakdown.totalDeductions, 0);

  const exportCSV = () => {
    const headers = [
      'Record ID', 'Employee ID', 'Employee Name', 'Department', 'Category',
      'Pay Month', 'Payment Date', 'Basic Salary', 'Gross Salary', 'Total Deductions',
      'Net Salary', 'Txn Ref', 'Authorized By', 'Status'
    ];

    const rows = filtered.map(r => [
      r.id,
      r.employeeId,
      `"${r.employeeName}"`,
      r.department,
      r.category,
      r.month,
      r.paymentDate,
      r.breakdown.basicSalary,
      r.breakdown.grossSalary,
      r.breakdown.totalDeductions,
      r.breakdown.netSalary,
      r.transactionRef,
      `"${r.authorizedBy}"`,
      r.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PAL_INDUSTRIES_Payroll_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <span>Payroll Disbursement History & Reporting</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of processed employee salaries with statutory compliance logs
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer border border-amber-500/30 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Payroll Report (.CSV)</span>
        </button>
      </div>

      {/* KPI Expenditure Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Total Filtered Gross</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {formatINR(totalExpenditureGross)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total company commitments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">Total Deductions Held</span>
          <div className="text-2xl font-black text-red-700 mt-1 font-mono">
            {formatINR(totalDeductions)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">PF, PT & taxes reserved</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">Total Net Disbursed</span>
          <div className="text-2xl font-black text-slate-950 mt-1 font-mono">
            {formatINR(totalExpenditureNet)}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Paid out to workforce</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee ID, Name, or Txn Ref..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="ALL">All Payroll Months</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="PERMANENT">Permanent</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center justify-end">
            <button
              onClick={() => { setSearchTerm(''); setSelectedMonth('ALL'); setSelectedDept('ALL'); setSelectedCategory('ALL'); }}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

        </div>
      </div>

      {/* History Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Pay ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4 text-right">Gross Salary</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Net Payable</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No payroll transaction records found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {record.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{record.employeeName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{record.employeeId} • {record.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        record.category === 'PERMANENT'
                          ? 'bg-sky-50 text-sky-700'
                          : record.category === 'CONTRACT'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}>
                        {record.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {record.month}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      {formatINR(record.breakdown.grossSalary)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-red-600">
                      {formatINR(record.breakdown.totalDeductions)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatINR(record.breakdown.netSalary)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setInspectRecord(record)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Breakdown Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onViewSalarySlip(record)}
                          className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                          title="Open Certified Salary Slip"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Official PAL INDUSTRIES Payroll Ledger</span>
          <span>Showing {filtered.length} entries</span>
        </div>
      </div>

      {/* Inspect Record Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Payroll Audit Details</h3>
                <p className="text-xs text-slate-500">Record #{inspectRecord.id} • {inspectRecord.month}</p>
              </div>
              <button onClick={() => setInspectRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{inspectRecord.employeeName}</span>
                  <span className="font-mono">{inspectRecord.employeeId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{inspectRecord.designation} • {inspectRecord.department}</span>
                  <span>{inspectRecord.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Basic Salary</span>
                  <span className="font-mono font-bold text-slate-800">{formatINR(inspectRecord.breakdown.basicSalary)}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Total Allowances</span>
                  <span className="font-mono font-bold text-emerald-700">+{formatINR(inspectRecord.breakdown.totalAllowances)}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Gross Salary</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(inspectRecord.breakdown.grossSalary)}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Total Deductions</span>
                  <span className="font-mono font-bold text-red-600">-{formatINR(inspectRecord.breakdown.totalDeductions)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-white flex justify-between items-center">
                <span className="font-bold">Net Salary Disbursed:</span>
                <span className="text-amber-400 font-mono font-bold text-base">{formatINR(inspectRecord.breakdown.netSalary)}</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <p>Transaction Reference: <strong className="text-slate-600 font-mono">{inspectRecord.transactionRef}</strong></p>
                <p>Authorized By: <strong className="text-amber-700">{inspectRecord.authorizedBy}</strong></p>
                <p>Payment Date: <strong className="text-slate-600 font-mono">{inspectRecord.paymentDate}</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  const r = inspectRecord;
                  setInspectRecord(null);
                  onViewSalarySlip(r);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Certified Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
