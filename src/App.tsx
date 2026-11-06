import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { Employee, PayrollRecord, SalaryBreakdown } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { EmployeeManagementView } from './components/EmployeeManagementView';
import { PayrollCalculationView } from './components/PayrollCalculationView';
import { SalarySlipView } from './components/SalarySlipView';
import { PayrollHistoryView } from './components/PayrollHistoryView';
import { JavaCodeHubView } from './components/JavaCodeHubView';
import { CompanyInfoModal } from './components/CompanyInfoModal';
import { downloadJavaProjectZip } from './services/zipExportService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);

  // Navigation targets
  const [targetEmployeeForSalary, setTargetEmployeeForSalary] = useState<Employee | undefined>(undefined);
  const [targetMonthForSlip, setTargetMonthForSlip] = useState<string>('November 2026');

  // Modals
  const [isCompanyInfoOpen, setIsCompanyInfoOpen] = useState<boolean>(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);

  // Initialize storage on mount
  useEffect(() => {
    StorageService.init();
    const session = StorageService.getSession();
    if (session) {
      setIsAuthenticated(true);
      setCurrentUser(session.username);
    }
    loadData();
  }, []);

  const loadData = () => {
    setEmployees(StorageService.getEmployees());
    setPayrollHistory(StorageService.getPayrollHistory());
  };

  const handleLoginSuccess = (user: string) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    loadData();
  };

  const handleLogout = () => {
    StorageService.logout();
    setIsAuthenticated(false);
  };

  const handleResetData = () => {
    StorageService.resetToDefaults();
    loadData();
    setResetConfirmOpen(false);
  };

  // Employee CRUD handlers
  const handleAddEmployee = (emp: Employee) => {
    const res = StorageService.addEmployee(emp);
    if (res.success) {
      loadData();
    }
    return res;
  };

  const handleUpdateEmployee = (emp: Employee) => {
    const res = StorageService.updateEmployee(emp);
    if (res.success) {
      loadData();
    }
    return res;
  };

  const handleDeleteEmployee = (id: string) => {
    const res = StorageService.deleteEmployee(id);
    if (res.success) {
      loadData();
    }
    return res;
  };

  // Payroll commit handler
  const handleCommitPayroll = (record: PayrollRecord) => {
    const res = StorageService.addPayrollRecord(record);
    if (res.success) {
      loadData();
    }
    return res;
  };

  // Navigation callbacks
  const handleSelectForSalarySlip = (emp: Employee) => {
    setTargetEmployeeForSalary(emp);
    setActiveTab('salary-slip');
  };

  const handleSelectForPayrollCalc = (emp: Employee) => {
    setTargetEmployeeForSalary(emp);
    setActiveTab('payroll');
  };

  const handleGenerateSlipFromCalc = (emp: Employee, _breakdown: SalaryBreakdown, month: string) => {
    setTargetEmployeeForSalary(emp);
    setTargetMonthForSlip(month);
    setActiveTab('salary-slip');
  };

  const handleViewSalarySlipFromHistory = (rec: PayrollRecord) => {
    const emp = employees.find(e => e.id === rec.employeeId);
    if (emp) {
      setTargetEmployeeForSalary(emp);
    }
    setTargetMonthForSlip(rec.month);
    setActiveTab('salary-slip');
  };

  // If not logged in, render corporate Login screen
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      
      {/* Corporate Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCompanyInfo={() => setIsCompanyInfoOpen(true)}
        onOpenJavaKit={() => setActiveTab('java-kit')}
        onResetData={() => setResetConfirmOpen(true)}
        activeTab={activeTab}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          employeeCount={employees.length}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              employees={employees}
              payrollHistory={payrollHistory}
              onNavigate={setActiveTab}
              onOpenEmployeeForm={() => setActiveTab('employees')}
              onSelectEmployeeForSalary={handleSelectForSalarySlip}
              onDownloadProjectZip={downloadJavaProjectZip}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeManagementView
              employees={employees}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onSelectForSalarySlip={handleSelectForSalarySlip}
              onSelectForPayrollCalc={handleSelectForPayrollCalc}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollCalculationView
              employees={employees}
              selectedEmployeeId={targetEmployeeForSalary?.id}
              onCommitPayroll={handleCommitPayroll}
              onGenerateSlip={handleGenerateSlipFromCalc}
            />
          )}

          {activeTab === 'salary-slip' && (
            <SalarySlipView
              employees={employees}
              initialEmployee={targetEmployeeForSalary}
              initialMonth={targetMonthForSlip}
            />
          )}

          {activeTab === 'history' && (
            <PayrollHistoryView
              records={payrollHistory}
              onViewSalarySlip={handleViewSalarySlipFromHistory}
            />
          )}

          {activeTab === 'java-kit' && (
            <JavaCodeHubView />
          )}

        </main>
      </div>

      {/* Company Info Modal */}
      <CompanyInfoModal
        isOpen={isCompanyInfoOpen}
        onClose={() => setIsCompanyInfoOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Reset Master Database?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will restore the PAL INDUSTRIES payroll database to factory sample records (10 sample employees across departments, 5 payroll disbursements).
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
