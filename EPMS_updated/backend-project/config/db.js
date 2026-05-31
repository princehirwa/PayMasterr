const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'PayMaster',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize DB with tables
const initDB = `
CREATE DATABASE IF NOT EXISTS EPMS;
USE EPMS;

CREATE TABLE IF NOT EXISTS Department (
  departmentCode VARCHAR(10) PRIMARY KEY,
  departmentName VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Employee (
  employeeNumber VARCHAR(15) PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  address VARCHAR(150),
  position VARCHAR(80),
  telephone VARCHAR(15),
  gender ENUM('Male','Female','Other'),
  hiredDate DATE,
  departmentCode VARCHAR(10),
  FOREIGN KEY (departmentCode) REFERENCES Department(departmentCode) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Salary (
  salaryId INT AUTO_INCREMENT PRIMARY KEY,
  grossSalary DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL,
  netSalary DECIMAL(12,2) GENERATED ALWAYS AS (grossSalary - totalDeduction) STORED,
  monthOfPayment DATE NOT NULL,
  employeeNumber VARCHAR(15),
  FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
`;

const promisePool = pool.promise();

// Run init queries sequentially
(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  }).promise();
  try {
    await conn.query(initDB);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('DB init error:', err.message);
  } finally {
    await conn.end();
  }
})();

module.exports = promisePool;
