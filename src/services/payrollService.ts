import { Employee, EmployeeCategory, SalaryBreakdown } from '../types';

/**
 * TypeScript implementation mirroring the Java OOP Architecture:
 * - Base class EmployeeContract
 * - Overridden methods in Permanent, Contract, Intern
 * - Polymorphic calculateSalaryBreakdown method
 */

export interface SalaryRuleEngine {
  calculateHRA(basic: number): number;
  calculateDA(basic: number): number;
  calculateMedical(basic: number): number;
  calculateTransport(): number;
  calculatePF(basic: number): number;
  calculatePT(): number;
}

// 1. Permanent Employee OOP Implementation
export class PermanentSalaryEngine implements SalaryRuleEngine {
  calculateHRA(basic: number) { return basic * 0.20; } // 20%
  calculateDA(basic: number) { return basic * 0.10; }  // 10%
  calculateMedical(basic: number) { return basic * 0.05; } // 5%
  calculateTransport() { return 1000; } // Fixed ₹1,000
  calculatePF(basic: number) { return basic * 0.12; } // 12% Statutory PF
  calculatePT() { return 200; } // Fixed ₹200
}

// 2. Contract Employee OOP Implementation (Overridden)
export class ContractSalaryEngine implements SalaryRuleEngine {
  calculateHRA(basic: number) { return basic * 0.15; } // 15%
  calculateDA(basic: number) { return basic * 0.08; }  // 8%
  calculateMedical(basic: number) { return basic * 0.03; } // 3%
  calculateTransport() { return 800; } // Fixed ₹800
  calculatePF() { return 0; } // Contract exempt
  calculatePT() { return 200; } // Fixed ₹200
}

// 3. Intern Employee OOP Implementation (Overridden)
export class InternSalaryEngine implements SalaryRuleEngine {
  calculateHRA() { return 0; }
  calculateDA() { return 0; }
  calculateMedical() { return 0; }
  calculateTransport() { return 500; } // ₹500 Stipend Travel Subsidy
  calculatePF() { return 0; } // Exempt
  calculatePT() { return 0; } // Exempt
}

export function getEngineForCategory(category: EmployeeCategory, strictStandard: boolean = false): SalaryRuleEngine {
  if (strictStandard) {
    // If strict standard formula is enforced regardless of category
    return new PermanentSalaryEngine();
  }

  switch (category) {
    case 'CONTRACT':
      return new ContractSalaryEngine();
    case 'INTERN':
      return new InternSalaryEngine();
    case 'PERMANENT':
    default:
      return new PermanentSalaryEngine();
  }
}

/**
 * Core Payroll Calculator
 * Automatically calculates all allowances and deductions given basic salary and other deductions
 */
export function calculateSalaryBreakdown(
  basicSalary: number,
  category: EmployeeCategory = 'PERMANENT',
  otherDeductions: number = 0,
  strictStandard: boolean = false
): SalaryBreakdown {
  const safeBasic = Math.max(0, Number(basicSalary) || 0);
  const safeOtherDeductions = Math.max(0, Number(otherDeductions) || 0);

  const engine = getEngineForCategory(category, strictStandard);

  const hra = engine.calculateHRA(safeBasic);
  const da = engine.calculateDA(safeBasic);
  const medicalAllowance = engine.calculateMedical(safeBasic);
  const transportAllowance = engine.calculateTransport();

  const totalAllowances = hra + da + medicalAllowance + transportAllowance;
  const grossSalary = safeBasic + totalAllowances;

  const pf = engine.calculatePF(safeBasic);
  const professionalTax = engine.calculatePT();
  const totalDeductions = pf + professionalTax + safeOtherDeductions;

  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    basicSalary: safeBasic,
    hra: Math.round(hra * 100) / 100,
    da: Math.round(da * 100) / 100,
    medicalAllowance: Math.round(medicalAllowance * 100) / 100,
    transportAllowance: Math.round(transportAllowance * 100) / 100,
    totalAllowances: Math.round(totalAllowances * 100) / 100,
    grossSalary: Math.round(grossSalary * 100) / 100,
    pf: Math.round(pf * 100) / 100,
    professionalTax: Math.round(professionalTax * 100) / 100,
    otherDeductions: Math.round(safeOtherDeductions * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
  };
}

/**
 * Format currency in Indian Rupees format (₹)
 */
export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(val || 0);
}

/**
 * Converts numbers into Indian English words (for salary slips)
 */
export function numberToWordsIndian(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(num);
  if (n === 0) return 'Zero Rupees Only';

  function convertTwoDigits(n: number): string {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
  }

  function convertThreeDigits(n: number): string {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
    }
    const rem = n % 100;
    if (rem > 0) {
      str += convertTwoDigits(rem);
    }
    return str.trim();
  }

  let words = '';
  const crore = Math.floor(n / 10000000);
  let rem = n % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  if (crore > 0) words += convertTwoDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertTwoDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertTwoDigits(thousand) + ' Thousand ';
  if (rem > 0) words += convertThreeDigits(rem);

  return 'Rupees ' + words.trim() + ' Only';
}
