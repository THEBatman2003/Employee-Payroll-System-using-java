export type EmployeeCategory = 'PERMANENT' | 'CONTRACT' | 'INTERN';

export type Department = 
  | 'Engineering'
  | 'Operations'
  | 'Finance'
  | 'Human Resources'
  | 'Sales & Marketing'
  | 'Quality Assurance';

export interface Employee {
  id: string; // e.g. PI-101
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  email: string;
  address: string;
  department: Department;
  designation: string;
  category: EmployeeCategory;
  joiningDate: string; // YYYY-MM-DD
  basicSalary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface SalaryBreakdown {
  basicSalary: number;
  hra: number;
  da: number;
  medicalAllowance: number;
  transportAllowance: number;
  totalAllowances: number;
  grossSalary: number;
  pf: number;
  professionalTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
}

export interface PayrollRecord {
  id: string; // e.g. PAY-2026-10-001
  employeeId: string;
  employeeName: string;
  department: Department;
  designation: string;
  category: EmployeeCategory;
  month: string; // e.g. "October 2026"
  paymentDate: string; // YYYY-MM-DD
  breakdown: SalaryBreakdown;
  paymentMode: 'Bank Transfer' | 'Cheque' | 'Direct Deposit';
  transactionRef: string;
  status: 'Paid' | 'Processing' | 'Held';
  authorizedBy: string; // ANKUR PAL, Chairman
}

export interface AdminUser {
  username: string;
  fullName: string;
  role: string;
  email: string;
  lastLogin?: string;
}

export interface JavaSourceFile {
  fileName: string;
  category: 'Model (OOP)' | 'Database' | 'GUI (Swing)' | 'Business Logic' | 'Documentation';
  description: string;
  code: string;
}
