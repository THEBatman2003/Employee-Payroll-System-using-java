package com.palindustries.payroll.service;

import com.palindustries.payroll.model.Employee;

/**
 * =========================================================================
 * PROJECT: PAL INDUSTRIES - EMPLOYEE PAYROLL MANAGEMENT SYSTEM
 * CHAIRMAN: ANKUR PAL
 * =========================================================================
 *
 * PayrollCalculator:
 * Executes payroll arithmetic and demonstrates Runtime Polymorphism:
 * The method computeBreakdown receives a base class 'Employee' reference
 * and at runtime executes the overridden methods of PermanentEmployee,
 * ContractEmployee, or InternEmployee seamlessly.
 */
public class PayrollCalculator {

    public static class PayrollResult {
        public double basicSalary;
        public double hra;
        public double da;
        public double medicalAllowance;
        public double transportAllowance;
        public double totalAllowances;
        public double grossSalary;
        public double pf;
        public double professionalTax;
        public double otherDeductions;
        public double totalDeductions;
        public double netSalary;
    }

    /**
     * Compute full breakdown using polymorphic dynamic method dispatch
     */
    public static PayrollResult computeBreakdown(Employee emp, double otherDeductions) {
        PayrollResult res = new PayrollResult();
        
        res.basicSalary = emp.getBasicSalary();
        res.hra = emp.calculateHRA();
        res.da = emp.calculateDA();
        res.medicalAllowance = emp.calculateMedicalAllowance();
        res.transportAllowance = emp.calculateTransportAllowance();
        
        res.totalAllowances = res.hra + res.da + res.medicalAllowance + res.transportAllowance;
        res.grossSalary = res.basicSalary + res.totalAllowances;
        
        res.pf = emp.calculateProvidentFund();
        res.professionalTax = emp.calculateProfessionalTax();
        res.otherDeductions = Math.max(0, otherDeductions);
        
        res.totalDeductions = res.pf + res.professionalTax + res.otherDeductions;
        res.netSalary = res.grossSalary - res.totalDeductions;
        
        return res;
    }
}
