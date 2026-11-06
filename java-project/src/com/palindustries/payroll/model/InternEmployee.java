package com.palindustries.payroll.model;

/**
 * Derived Class: InternEmployee
 * Extends base Employee class.
 * Demonstrates:
 * - Polymorphism: Intern specific stipend calculation rules
 *
 * PAL INDUSTRIES Rules for Interns:
 * HRA: 0% (Covered via Campus Stipend Policy)
 * DA: 0%
 * Medical: 0%
 * Transport Allowance: Fixed Rs. 500 (Subsidy)
 * PF: 0% (Exempt)
 * Professional Tax: 0% (Exempt)
 *
 * Chairman: ANKUR PAL
 */
public class InternEmployee extends Employee {

    public InternEmployee(String employeeId, String name, String gender, String contactNumber,
                          String email, String address, String department, String designation,
                          String joiningDate, double basicSalary) {
        super(employeeId, name, gender, contactNumber, email, address, department, designation,
              "INTERN", joiningDate, basicSalary);
    }

    @Override
    public double calculateHRA() {
        return 0.0;
    }

    @Override
    public double calculateDA() {
        return 0.0;
    }

    @Override
    public double calculateMedicalAllowance() {
        return 0.0;
    }

    @Override
    public double calculateTransportAllowance() {
        return 500.0; // Fixed Rs. 500
    }

    @Override
    public double calculateProvidentFund() {
        return 0.0; // Exempt
    }

    @Override
    public double calculateProfessionalTax() {
        return 0.0; // Exempt
    }
}
