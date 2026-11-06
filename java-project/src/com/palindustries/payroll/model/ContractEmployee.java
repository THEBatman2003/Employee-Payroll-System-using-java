package com.palindustries.payroll.model;

/**
 * Derived Class: ContractEmployee
 * Extends base Employee class.
 * Demonstrates:
 * - Method Overriding with Contract-specific business logic
 *
 * PAL INDUSTRIES Rules for Contract Staff:
 * HRA: 15% of Basic
 * DA: 8% of Basic
 * Medical: 3% of Basic
 * Transport: Fixed Rs. 800
 * PF: 0% (Contractors manage their own statutory fund)
 * Professional Tax: Fixed Rs. 200
 *
 * Chairman: ANKUR PAL
 */
public class ContractEmployee extends Employee {

    public ContractEmployee(String employeeId, String name, String gender, String contactNumber,
                            String email, String address, String department, String designation,
                            String joiningDate, double basicSalary) {
        super(employeeId, name, gender, contactNumber, email, address, department, designation,
              "CONTRACT", joiningDate, basicSalary);
    }

    @Override
    public double calculateHRA() {
        return getBasicSalary() * 0.15; // 15%
    }

    @Override
    public double calculateDA() {
        return getBasicSalary() * 0.08; // 8%
    }

    @Override
    public double calculateMedicalAllowance() {
        return getBasicSalary() * 0.03; // 3%
    }

    @Override
    public double calculateTransportAllowance() {
        return 800.0; // Fixed Rs. 800
    }

    @Override
    public double calculateProvidentFund() {
        return 0.0; // Exempt for contract workers
    }

    @Override
    public double calculateProfessionalTax() {
        return 200.0; // Fixed Rs. 200
    }
}
