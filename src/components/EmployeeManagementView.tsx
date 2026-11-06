import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  RotateCcw, 
  Check, 
  X, 
  AlertCircle, 
  ChevronDown, 
  UserPlus, 
  Briefcase, 
  DollarSign,
  Building,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Employee, EmployeeCategory, Department } from '../types';
import { DEPARTMENTS } from '../data/initialData';
import { formatINR } from '../services/payrollService';

interface EmployeeManagementViewProps {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => { success: boolean; message: string };
  onUpdateEmployee: (emp: Employee) => { success: boolean; message: string };
  onDeleteEmployee: (id: string) => { success: boolean; message: string };
  onSelectForSalarySlip: (emp: Employee) => void;
  onSelectForPayrollCalc: (emp: Employee) => void;
}

export const EmployeeManagementView: React.FC<EmployeeManagementViewProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onSelectForSalarySlip,
  onSelectForPayrollCalc,
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Employee | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formDepartment, setFormDepartment] = useState<Department>('Engineering');
  const [formDesignation, setFormDesignation] = useState('');
  const [formCategory, setFormCategory] = useState<EmployeeCategory>('PERMANENT');
  const [formJoiningDate, setFormJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [formBasicSalary, setFormBasicSalary] = useState<number | string>(50000);
  const [formStatus, setFormStatus] = useState<'Active' | 'On Leave' | 'Terminated'>('Active');

  const showNotification = (type: 'success' | 'error', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const resetForm = () => {
    // Generate next available ID
    const nextNum = employees.length + 101;
    setFormId(`PI-${nextNum}`);
    setFormName('');
    setFormGender('Male');
    setFormContact('+91 ');
    setFormEmail('');
    setFormAddress('');
    setFormDepartment('Engineering');
    setFormDesignation('');
    setFormCategory('PERMANENT');
    setFormJoiningDate(new Date().toISOString().split('T')[0]);
    setFormBasicSalary(50000);
    setFormStatus('Active');
    setIsEditMode(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setFormId(emp.id);
    setFormName(emp.name);
    setFormGender(emp.gender);
    setFormContact(emp.contact);
    setFormEmail(emp.email);
    setFormAddress(emp.address);
    setFormDepartment(emp.department);
    setFormDesignation(emp.designation);
    setFormCategory(emp.category);
    setFormJoiningDate(emp.joiningDate);
    setFormBasicSalary(emp.basicSalary);
    setFormStatus(emp.status);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formId.trim()) {
      showNotification('error', 'Employee ID is required.');
      return;
    }
    if (!formName.trim()) {
      showNotification('error', 'Employee Full Name is required.');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      showNotification('error', 'Please enter a valid official email address.');
      return;
    }
    if (!formContact.trim() || formContact.length < 8) {
      showNotification('error', 'Please enter a valid contact phone number.');
      return;
    }
    if (Number(formBasicSalary) <= 0) {
      showNotification('error', 'Basic salary must be greater than zero.');
      return;
    }

    const employeeObj: Employee = {
      id: formId.trim().toUpperCase(),
      name: formName.trim(),
      gender: formGender,
      contact: formContact.trim(),
      email: formEmail.trim().toLowerCase(),
      address: formAddress.trim() || 'PAL Industries Corporate Housing, New Delhi',
      department: formDepartment,
      designation: formDesignation.trim() || 'Executive Associate',
      category: formCategory,
      joiningDate: formJoiningDate,
      basicSalary: Number(formBasicSalary),
      status: formStatus,
    };

    if (isEditMode) {
      const res = onUpdateEmployee(employeeObj);
      if (res.success) {
        showNotification('success', res.message);
        setIsFormOpen(false);
      } else {
        showNotification('error', res.message);
      }
    } else {
      const res = onAddEmployee(employeeObj);
      if (res.success) {
        showNotification('success', res.message);
        setIsFormOpen(false);
      } else {
        showNotification('error', res.message);
      }
    }
  };

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    const res = onDeleteEmployee(deleteCandidate.id);
    if (res.success) {
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
    setDeleteCandidate(null);
  };

  // Filtered list
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesCat = selectedCategory === 'ALL' || emp.category === selectedCategory;

    return matchesSearch && matchesDept && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Employee Master Records (JTable)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage PAL INDUSTRIES workforce records, categories, and salary assignments
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-slate-900/20 transition-all cursor-pointer self-start sm:self-auto border border-amber-500/30"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Notification Toast */}
      {alertMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          alertMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {alertMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{alertMessage.text}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search by ID / Name */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee ID (e.g. PI-101), Name, or Designation..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium bg-white"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium bg-white"
            >
              <option value="ALL">All Categories (OOP)</option>
              <option value="PERMANENT">Permanent Employees</option>
              <option value="CONTRACT">Contract Employees</option>
              <option value="INTERN">Interns / Trainees</option>
            </select>
          </div>

        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Found <strong>{filteredEmployees.length}</strong> matching records in database</span>
          {(searchTerm || selectedDept !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedDept('ALL'); setSelectedCategory('ALL'); }}
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* JTable Data Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Category (OOP)</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Basic Salary</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No employee records match your criteria.</p>
                    <p className="text-xs mt-1">Try resetting search filters or click "Add New Employee".</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {emp.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.name}</div>
                      <div className="text-[11px] text-slate-400">{emp.email}</div>
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
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {emp.department}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {emp.designation}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {emp.contact}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {formatINR(emp.basicSalary)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectForSalarySlip(emp)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Generate Salary Slip (PDF)"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Update Employee Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(emp)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Employee Record"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <span>Table View: <strong>PAL INDUSTRIES Employee Master Ledger</strong></span>
          <span className="font-mono text-slate-400">Total Records: {employees.length}</span>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                  PI
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {isEditMode ? 'Update Employee Record' : 'Register New Employee'}
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    PAL INDUSTRIES • Chairman: ANKUR PAL
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Row 1: ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    disabled={isEditMode}
                    placeholder="e.g. PI-111"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Category (OOP) & Gender & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category (OOP Class) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EmployeeCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="PERMANENT">Permanent Employee</option>
                    <option value="CONTRACT">Contract Employee</option>
                    <option value="INTERN">Intern / Trainee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Department & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value as Department)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.name} value={d.name}>{d.name} ({d.head})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. Senior Software Architect"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Email & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. employee@palindustries.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Row 5: Joining Date & Basic Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formJoiningDate}
                    onChange={(e) => setFormJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Basic Salary (₹ per month) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formBasicSalary}
                    onChange={(e) => setFormBasicSalary(e.target.value)}
                    min="1000"
                    step="500"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Row 6: Residential Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address
                </label>
                <textarea
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  rows={2}
                  placeholder="e.g. Flat 4B, Emerald Residency, Sector 54, Gurugram"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer border border-amber-500/30"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{isEditMode ? 'Update Record' : 'Save Employee'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Deletion</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Are you sure you want to permanently delete employee <strong>{deleteCandidate.name} ({deleteCandidate.id})</strong> from the PAL INDUSTRIES master database?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
