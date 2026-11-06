package com.palindustries.payroll.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * =========================================================================
 * PROJECT: PAL INDUSTRIES - EMPLOYEE PAYROLL MANAGEMENT SYSTEM
 * CHAIRMAN: ANKUR PAL
 * =========================================================================
 *
 * DatabaseConnection:
 * Implements Singleton design pattern for MySQL JDBC connectivity.
 * Database: pal_industries_payroll
 */
public class DatabaseConnection {
    // Database connection parameters
    private static final String URL = "jdbc:mysql://localhost:3306/pal_industries_payroll?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root"; // Update to your MySQL root password

    private static Connection connection = null;

    // Private constructor to prevent direct instantiation
    private DatabaseConnection() {}

    /**
     * Returns an active MySQL Connection.
     */
    public static synchronized Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                // Load MySQL JDBC Driver
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
                System.out.println("[DatabaseConnection] Connected successfully to pal_industries_payroll");
            }
        } catch (ClassNotFoundException e) {
            System.err.println("[DatabaseConnection] MySQL JDBC Driver not found! Ensure mysql-connector-j.jar is in classpath: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("[DatabaseConnection] Database connection error: " + e.getMessage());
        }
        return connection;
    }

    /**
     * Safely closes the database connection.
     */
    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("[DatabaseConnection] Connection closed.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
