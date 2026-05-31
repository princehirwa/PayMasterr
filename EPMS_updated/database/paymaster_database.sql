-- ============================================
-- EPMS - Employee Payroll Management System
-- Database: EPMS
-- PayMaster Ltd, Rubavu District, Rwanda
-- ============================================

CREATE DATABASE IF NOT EXISTS PayMaster;
USE PayMaster;

-- Department Table
CREATE TABLE IF NOT EXISTS Department (
  departmentCode VARCHAR(10) PRIMARY KEY,
  departmentName VARCHAR(100) NOT NULL
);

-- Employee Table
CREATE TABLE IF NOT EXISTS Employee (
  employeeNumber VARCHAR(15) PRIMARY KEY,
  firstName      VARCHAR(50) NOT NULL,
  lastName       VARCHAR(50) NOT NULL,
  address        VARCHAR(150),
  position       VARCHAR(80),
  telephone      VARCHAR(15),
  gender         ENUM('Male','Female','Other'),
  hiredDate      DATE,
  departmentCode VARCHAR(10),
  FOREIGN KEY (departmentCode) REFERENCES Department(departmentCode) ON DELETE SET NULL
);

-- Salary Table
CREATE TABLE IF NOT EXISTS Salary (
  salaryId       INT AUTO_INCREMENT PRIMARY KEY,
  grossSalary    DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL,
  netSalary      DECIMAL(12,2) GENERATED ALWAYS AS (grossSalary - totalDeduction) STORED,
  monthOfPayment DATE NOT NULL,
  employeeNumber VARCHAR(15),
  FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber) ON DELETE CASCADE
);

-- Users Table (Authentication)
CREATE TABLE IF NOT EXISTS Users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL  -- bcrypt hashed
);

-- ============================================
-- Sample Data
-- ============================================

INSERT INTO Department (departmentCode, departmentName) VALUES
  ('HR',  'Human Resources'),
  ('IT',  'Information Technology'),
  ('FIN', 'Finance'),
  ('OPS', 'Operations'),
  ('LOG', 'Logistics');

INSERT INTO Employee (employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode) VALUES
  ('EMP001', 'Jean',   'Uwimana',  'Rubavu, Rwanda', 'HR Manager',      '0781234567', 'Female', '2020-01-15', 'HR'),
  ('EMP002', 'Pierre', 'Habimana', 'Gisenyi, Rwanda','Software Developer','0782345678', 'Male',  '2021-03-20', 'IT'),
  ('EMP003', 'Alice',  'Mutesi',   'Kigali, Rwanda', 'Accountant',      '0783456789', 'Female', '2019-07-10', 'FIN');
