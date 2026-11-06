package com.palindustries.payroll.dao;

import com.palindustries.payroll.db.DatabaseConnection;
import com.palindustries.payroll.model.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * =========================================================================
 * PROJECT: PAL INDUSTRIES - EMPLOYEE PAYROLL MANAGEMENT SYSTEM
 * CHAIRMAN: ANKUR PAL
 * =========================================================================
 *
 * EmployeeManager: Data Access Object (DAO)
 * Handles CRUD operations for PAL INDUSTRIES employees using PreparedStatements.
 * Prevents SQL Injection.
 */
public class EmployeeManager {

    /**
     * Factory method creating appropriate subtype based on category
     */
    public static Employee createEmployeeInstance(String id, String name, String gender, String contact,
                                                  String email, String address, String dept, String desig,
                                                  String cat, String joiningDate, double basicSalary) {
        if ("CONTRACT".equalsIgnoreCase(cat)) {
            return new ContractEmployee(id, name, gender, contact, email, address, dept, desig, joiningDate, basicSalary);
        } else if ("INTERN".equalsIgnoreCase(cat)) {
            return new InternEmployee(id, name, gender, contact, email, address, dept, desig, joiningDate, basicSalary);
        } else {
            return new PermanentEmployee(id, name, gender, contact, email, address, dept, desig, joiningDate, basicSalary);
        }
    }

    /**
     * Add new Employee with duplicate ID check
     */
    public boolean addEmployee(Employee emp) throws SQLException {
        if (employeeExists(emp.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID " + emp.getEmployeeId() + " already exists in the system!");
        }

        String sql = "INSERT INTO employees (employee_id, name, gender, contact_number, email, address, department, designation, category, joining_date, basic_salary) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setString(1, emp.getEmployeeId());
            pst.setString(2, emp.getName());
            pst.setString(3, emp.getGender());
            pst.setString(4, emp.getContactNumber());
            pst.setString(5, emp.getEmail());
            pst.setString(6, emp.getAddress());
            pst.setString(7, emp.getDepartment());
            pst.setString(8, emp.getDesignation());
            pst.setString(9, emp.getCategory());
            pst.setString(10, emp.getJoiningDate());
            pst.setDouble(11, emp.getBasicSalary());

            int rows = pst.executeUpdate();
            return rows > 0;
        }
    }

    /**
     * Check if Employee ID exists
     */
    public boolean employeeExists(String empId) {
        String sql = "SELECT COUNT(*) FROM employees WHERE employee_id = ?";
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setString(1, empId);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Retrieve all employees
     */
    public List<Employee> getAllEmployees() {
        List<Employee> list = new ArrayList<>();
        String sql = "SELECT * FROM employees ORDER BY employee_id ASC";
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) return list;

        try (Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(createEmployeeInstance(
                    rs.getString("employee_id"),
                    rs.getString("name"),
                    rs.getString("gender"),
                    rs.getString("contact_number"),
                    rs.getString("email"),
                    rs.getString("address"),
                    rs.getString("department"),
                    rs.getString("designation"),
                    rs.getString("category"),
                    rs.getString("joining_date"),
                    rs.getDouble("basic_salary")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * Search employee by ID
     */
    public Employee getEmployeeById(String empId) {
        String sql = "SELECT * FROM employees WHERE employee_id = ?";
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setString(1, empId);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    return createEmployeeInstance(
                        rs.getString("employee_id"),
                        rs.getString("name"),
                        rs.getString("gender"),
                        rs.getString("contact_number"),
                        rs.getString("email"),
                        rs.getString("address"),
                        rs.getString("department"),
                        rs.getString("designation"),
                        rs.getString("category"),
                        rs.getString("joining_date"),
                        rs.getDouble("basic_salary")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Update employee
     */
    public boolean updateEmployee(Employee emp) throws SQLException {
        String sql = "UPDATE employees SET name=?, gender=?, contact_number=?, email=?, address=?, department=?, designation=?, category=?, joining_date=?, basic_salary=? WHERE employee_id=?";
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setString(1, emp.getName());
            pst.setString(2, emp.getGender());
            pst.setString(3, emp.getContactNumber());
            pst.setString(4, emp.getEmail());
            pst.setString(5, emp.getAddress());
            pst.setString(7, emp.getDepartment());
            pst.setString(8, emp.getDesignation());
            pst.setString(9, emp.getCategory());
            pst.setString(10, emp.getJoiningDate());
            pst.setDouble(11, emp.getBasicSalary());
            pst.setString(12, emp.getEmployeeId());

            return pst.executeUpdate() > 0;
        }
    }

    /**
     * Delete employee by ID
     */
    public boolean deleteEmployee(String empId) throws SQLException {
        String sql = "DELETE FROM employees WHERE employee_id = ?";
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setString(1, empId);
            return pst.executeUpdate() > 0;
        }
    }
}
