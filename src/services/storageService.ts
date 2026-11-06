import { Employee, PayrollRecord, AdminUser } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_PAYROLL_HISTORY, DEFAULT_ADMIN } from '../data/initialData';

const STORAGE_KEYS = {
  EMPLOYEES: 'pal_industries_employees_v1',
  PAYROLL: 'pal_industries_payroll_v1',
  ADMIN: 'pal_industries_admin_v1',
  PASSWORD: 'pal_industries_admin_password_v1',
  SESSION: 'pal_industries_session_v1',
};

export class StorageService {
  // Initialize defaults if not present
  static init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYROLL)) {
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL_HISTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(DEFAULT_ADMIN));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PASSWORD)) {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, 'admin123');
    }
  }

  // --- Employees CRUD ---
  static getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  }

  static getEmployeeById(id: string): Employee | undefined {
    const list = this.getEmployees();
    return list.find(e => e.id.toLowerCase() === id.trim().toLowerCase());
  }

  static addEmployee(emp: Employee): { success: boolean; message: string } {
    const list = this.getEmployees();
    const exists = list.some(e => e.id.toLowerCase() === emp.id.trim().toLowerCase());
    if (exists) {
      return { success: false, message: `Employee ID "${emp.id}" already exists in the system!` };
    }
    const emailExists = list.some(e => e.email.toLowerCase() === emp.email.trim().toLowerCase());
    if (emailExists) {
      return { success: false, message: `Email "${emp.email}" is already registered to another employee!` };
    }

    list.unshift(emp);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
    return { success: true, message: `Employee ${emp.name} (${emp.id}) added successfully.` };
  }

  static updateEmployee(emp: Employee): { success: boolean; message: string } {
    const list = this.getEmployees();
    const index = list.findIndex(e => e.id.toLowerCase() === emp.id.trim().toLowerCase());
    if (index === -1) {
      return { success: false, message: `Employee ID "${emp.id}" not found.` };
    }

    list[index] = { ...emp };
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
    return { success: true, message: `Employee ${emp.name} updated successfully.` };
  }

  static deleteEmployee(id: string): { success: boolean; message: string } {
    const list = this.getEmployees();
    const filtered = list.filter(e => e.id.toLowerCase() !== id.trim().toLowerCase());
    if (filtered.length === list.length) {
      return { success: false, message: `Employee ID "${id}" not found.` };
    }

    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(filtered));
    return { success: true, message: `Employee record ${id} deleted successfully.` };
  }

  // --- Payroll Records ---
  static getPayrollHistory(): PayrollRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYROLL);
      return data ? JSON.parse(data) : INITIAL_PAYROLL_HISTORY;
    } catch {
      return INITIAL_PAYROLL_HISTORY;
    }
  }

  static addPayrollRecord(record: PayrollRecord): { success: boolean; message: string } {
    const list = this.getPayrollHistory();
    list.unshift(record);
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(list));
    return { success: true, message: `Payroll record generated successfully for ${record.employeeName}.` };
  }

  // --- Admin Authentication ---
  static authenticate(user: string, pass: string): boolean {
    const currentPass = localStorage.getItem(STORAGE_KEYS.PASSWORD) || 'admin123';
    if ((user === 'admin' || user === 'ankur.pal') && pass === currentPass) {
      const session = {
        username: user,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      return true;
    }
    return false;
  }

  static getSession(): { username: string; loggedInAt: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  static updatePassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    const currentPass = localStorage.getItem(STORAGE_KEYS.PASSWORD) || 'admin123';
    if (oldPass !== currentPass) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (newPass.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters.' };
    }
    localStorage.setItem(STORAGE_KEYS.PASSWORD, newPass);
    return { success: true, message: 'Administrator password changed successfully.' };
  }

  // Reset to Factory Seed
  static resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL_HISTORY));
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(DEFAULT_ADMIN));
    localStorage.setItem(STORAGE_KEYS.PASSWORD, 'admin123');
  }
}
