-- =========================================================================
-- DATABASE: pal_industries_payroll
-- PROJECT: PAL INDUSTRIES - EMPLOYEE PAYROLL MANAGEMENT SYSTEM
-- CHAIRMAN: ANKUR PAL
-- Technology: MySQL 8.0+ / MariaDB
-- =========================================================================

DROP DATABASE IF EXISTS pal_industries_payroll;
CREATE DATABASE pal_industries_payroll CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pal_industries_payroll;

-- -------------------------------------------------------------------------
-- 1. Table: admin (Authentication)
-- -------------------------------------------------------------------------
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Super Administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Administrator credentials: admin / admin123
INSERT INTO admin (username, password, full_name, role) VALUES 
('admin', 'admin123', 'Ankur Pal (Chairman Desk)', 'Executive Administrator'),
('hr_manager', 'hrpass123', 'Suresh Menon', 'HR Lead');

-- -------------------------------------------------------------------------
-- 2. Table: departments (Reference Table)
-- -------------------------------------------------------------------------
CREATE TABLE departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    head_of_department VARCHAR(100) NOT NULL
);

INSERT INTO departments (dept_name, head_of_department) VALUES
('Engineering', 'Rajesh Sharma'),
('Operations', 'Vikram Malhotra'),
('Finance', 'Pooja Agarwal'),
('Human Resources', 'Sneha Kapoor'),
('Sales & Marketing', 'Amitabh Verma'),
('Quality Assurance', 'Rohan Saxena');

-- -------------------------------------------------------------------------
-- 3. Table: employees (Master Employee Records)
-- Demonstrates OOP Entity Mapping
-- -------------------------------------------------------------------------
CREATE TABLE employees (
    employee_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    category ENUM('PERMANENT', 'CONTRACT', 'INTERN') NOT NULL,
    joining_date DATE NOT NULL,
    basic_salary DECIMAL(12, 2) NOT NULL CHECK (basic_salary >= 0),
    status ENUM('Active', 'On Leave', 'Terminated') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Seed Employees for PAL INDUSTRIES
INSERT INTO employees (employee_id, name, gender, contact_number, email, address, department, designation, category, joining_date, basic_salary, status) VALUES
('PI-101', 'Arjun Singhania', 'Male', '+91 98765 43210', 'arjun.s@palindustries.com', 'Suite 402, Green Park, New Delhi', 'Engineering', 'Lead Systems Architect', 'PERMANENT', '2022-03-15', 85000.00, 'Active'),
('PI-102', 'Deepika Sharma', 'Female', '+91 98111 22334', 'deepika.s@palindustries.com', 'B-14, Vasant Vihar, New Delhi', 'Human Resources', 'Senior HR Manager', 'PERMANENT', '2021-07-01', 65000.00, 'Active'),
('PI-103', 'Karan Mehra', 'Male', '+91 98450 11223', 'karan.m@palindustries.com', 'Flat 12A, Cyber Heights, Gurugram', 'Finance', 'Financial Controller', 'PERMANENT', '2023-01-10', 72000.00, 'Active'),
('PI-104', 'Priya Nambiar', 'Female', '+91 97123 45678', 'priya.n@palindustries.com', 'Sector 56, Golf Course Rd, Gurugram', 'Engineering', 'Full Stack Java Developer', 'PERMANENT', '2023-06-20', 55000.00, 'Active'),
('PI-105', 'Rohan Verma', 'Male', '+91 99201 88472', 'rohan.v@palindustries.com', 'H-29, Model Town, Delhi', 'Operations', 'Supply Chain Consultant', 'CONTRACT', '2024-02-01', 48000.00, 'Active'),
('PI-106', 'Aanya Joshi', 'Female', '+91 96543 21890', 'aanya.j@palindustries.com', 'A-3, South Extension, New Delhi', 'Sales & Marketing', 'Digital Brand Strategist', 'CONTRACT', '2024-04-15', 42000.00, 'Active'),
('PI-107', 'Harshvardhan Rao', 'Male', '+91 91234 56789', 'harsh.r@palindustries.com', 'D-56, Noida Sector 62', 'Quality Assurance', 'Automation QA Engineer', 'CONTRACT', '2024-05-10', 40000.00, 'Active'),
('PI-108', 'Tanya Deshmukh', 'Female', '+91 93456 78901', 'tanya.d@palindustries.com', 'Campus Hostel 4, IIT Delhi', 'Engineering', 'Software Engineering Intern', 'INTERN', '2024-08-01', 25000.00, 'Active'),
('PI-109', 'Naveen Choudhury', 'Male', '+91 94567 89012', 'naveen.c@palindustries.com', 'PG-8, South Campus, Delhi', 'Operations', 'Industrial Logistics Intern', 'INTERN', '2024-09-01', 22000.00, 'Active');

-- -------------------------------------------------------------------------
-- 4. Table: payroll (Monthly Payroll Transactions)
-- -------------------------------------------------------------------------
CREATE TABLE payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL,
    pay_month VARCHAR(30) NOT NULL, -- e.g. 'October 2026'
    basic_salary DECIMAL(12, 2) NOT NULL,
    hra DECIMAL(12, 2) NOT NULL,
    da DECIMAL(12, 2) NOT NULL,
    medical_allowance DECIMAL(12, 2) NOT NULL,
    transport_allowance DECIMAL(12, 2) NOT NULL,
    gross_salary DECIMAL(12, 2) NOT NULL,
    provident_fund DECIMAL(12, 2) NOT NULL,
    professional_tax DECIMAL(12, 2) NOT NULL,
    other_deductions DECIMAL(12, 2) DEFAULT 0.00,
    total_deductions DECIMAL(12, 2) NOT NULL,
    net_salary DECIMAL(12, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'Bank Transfer',
    transaction_ref VARCHAR(100),
    authorized_by VARCHAR(100) DEFAULT 'ANKUR PAL, Chairman',
    status ENUM('Paid', 'Processing', 'Held') DEFAULT 'Paid',
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Seed recent payroll records
INSERT INTO payroll (employee_id, pay_month, basic_salary, hra, da, medical_allowance, transport_allowance, gross_salary, provident_fund, professional_tax, other_deductions, total_deductions, net_salary, payment_date, transaction_ref) VALUES
('PI-101', 'October 2026', 85000.00, 17000.00, 8500.00, 4250.00, 1000.00, 115750.00, 10200.00, 200.00, 0.00, 10400.00, 105350.00, '2026-10-31', 'TXN-PI-202610-101'),
('PI-102', 'October 2026', 65000.00, 13000.00, 6500.00, 3250.00, 1000.00, 88750.00, 7800.00, 200.00, 0.00, 8000.00, 80750.00, '2026-10-31', 'TXN-PI-202610-102'),
('PI-103', 'October 2026', 72000.00, 14400.00, 7200.00, 3600.00, 1000.00, 98200.00, 8640.00, 200.00, 500.00, 9340.00, 88860.00, '2026-10-31', 'TXN-PI-202610-103'),
('PI-105', 'October 2026', 48000.00, 7200.00, 3840.00, 1440.00, 800.00, 61280.00, 0.00, 200.00, 0.00, 200.00, 61080.00, '2026-10-31', 'TXN-PI-202610-105'),
('PI-108', 'October 2026', 25000.00, 0.00, 0.00, 0.00, 500.00, 25500.00, 0.00, 0.00, 0.00, 0.00, 25500.00, '2026-10-31', 'TXN-PI-202610-108');
