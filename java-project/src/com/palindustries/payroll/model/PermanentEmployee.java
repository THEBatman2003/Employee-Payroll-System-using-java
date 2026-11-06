package com.palindustries.payroll.model;

/**
 * Derived Class: PermanentEmployee
 * Extends base Employee class.
 * Demonstrates:
 * - Inheritance (extends Employee)
 * - Constructor chaining (super(...))
 * - Method Overriding (@Override)
 *
 * PAL INDUSTRIES Rules for Permanent Staff:
 * HRA: 20% of Basic
 * DA: 10% of Basic
 * Medical: 5% of Basic
 * Transport: Fixed Rs. 1000
 * PF: 12% of Basic
 * Professional Tax: Fixed Rs. 200
 *
 * Chairman: ANKUR PAL
 */
public class PermanentEmployee extends Employee {

    public PermanentEmployee(String employeeId, String name, String gender, String contactNumber,
                             String email, String address, String department, String designation,
                             String joiningDate, double basicSalary) {
        super(employeeId, name, gender, contactNumber, email, address, department, designation,
              "PERMANENT", joiningDate, basicSalary);
    }

    @Override
    public double calculateHRA() {
        return getBasicSalary() * 0.20; // 20%
    }

    @Override
    public double calculateDA() {
        return getBasicSalary() * 0.10; // 10%
    }

    @Override
    public double calculateMedicalAllowance() {
        return getBasicSalary() * 0.05; // 5%
    }

    @Override
    public double calculateTransportAllowance() {
        return 1000.0; // Fixed Rs. 1000
    }

    @Override
    public double calculateProvidentFund() {
        return getBasicSalary() * 0.12; // 12% Statutory PF
    }

    @Override
    public double calculateProfessionalTax() {
        return 200.0; // Fixed Rs. 200
    }
}
