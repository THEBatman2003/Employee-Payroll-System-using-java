package com.palindustries.payroll.model;

/**
 * =========================================================================
 * PROJECT: PAL INDUSTRIES - EMPLOYEE PAYROLL MANAGEMENT SYSTEM
 * CHAIRMAN: ANKUR PAL
 * B.Tech Computer Science Engineering Java Mini Project
 * =========================================================================
 *
 * Abstract Base Class: Employee
 * Demonstrates:
 * 1. Encapsulation: Private instance variables with public getters and setters.
 * 2. Abstraction: Abstract methods enforce child classes to implement allowance/deduction rules.
 * 3. Polymorphism: Used as base reference for runtime method dispatch.
 */
public abstract class Employee {
    // Encapsulated private attributes
    private String employeeId;
    private String name;
    private String gender;
    private String contactNumber;
    private String email;
    private String address;
    private String department;
    private String designation;
    private String category; // PERMANENT, CONTRACT, INTERN
    private String joiningDate;
    private double basicSalary;

    // Default Constructor
    public Employee() {}

    // Parameterized Constructor
    public Employee(String employeeId, String name, String gender, String contactNumber,
                    String email, String address, String department, String designation,
                    String category, String joiningDate, double basicSalary) {
        this.employeeId = employeeId;
        this.name = name;
        this.gender = gender;
        this.contactNumber = contactNumber;
        this.email = email;
        this.address = address;
        this.department = department;
        this.designation = designation;
        this.category = category;
        this.joiningDate = joiningDate;
        this.basicSalary = basicSalary;
    }

    // Abstract Methods - Overridden by Permanent, Contract, and Intern subclasses
    public abstract double calculateHRA();
    public abstract double calculateDA();
    public abstract double calculateMedicalAllowance();
    public abstract double calculateTransportAllowance();
    public abstract double calculateProvidentFund();
    public abstract double calculateProfessionalTax();

    // Concrete Common Methods
    public double calculateTotalAllowances() {
        return calculateHRA() + calculateDA() + calculateMedicalAllowance() + calculateTransportAllowance();
    }

    public double calculateGrossSalary() {
        return basicSalary + calculateTotalAllowances();
    }

    public double calculateTotalDeductions(double otherDeductions) {
        return calculateProvidentFund() + calculateProfessionalTax() + Math.max(0, otherDeductions);
    }

    public double calculateNetSalary(double otherDeductions) {
        return calculateGrossSalary() - calculateTotalDeductions(otherDeductions);
    }

    // Getters and Setters (Encapsulation)
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getJoiningDate() { return joiningDate; }
    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }

    public double getBasicSalary() { return basicSalary; }
    public void setBasicSalary(double basicSalary) { this.basicSalary = basicSalary; }

    @Override
    public String toString() {
        return "Employee [ID=" + employeeId + ", Name=" + name + ", Category=" + category + ", Dept=" + department + "]";
    }
}
