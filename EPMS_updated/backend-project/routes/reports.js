const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Daily report - salaries paid today
router.get('/daily', verifyToken, async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  try {
    const [rows] = await db.query(
      `SELECT s.salaryId, e.employeeNumber, e.firstName, e.lastName, e.position,
              d.departmentName, s.grossSalary, s.totalDeduction, s.netSalary, s.monthOfPayment
       FROM Salary s
       JOIN Employee e ON s.employeeNumber = e.employeeNumber
       LEFT JOIN Department d ON e.departmentCode = d.departmentCode
       WHERE DATE(s.monthOfPayment) = ?
       ORDER BY e.lastName`,
      [date]
    );
    res.json({ type: 'daily', date, data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Weekly report - current week
router.get('/weekly', verifyToken, async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  try {
    const [rows] = await db.query(
      `SELECT s.salaryId, e.employeeNumber, e.firstName, e.lastName, e.position,
              d.departmentName, s.grossSalary, s.totalDeduction, s.netSalary, s.monthOfPayment
       FROM Salary s
       JOIN Employee e ON s.employeeNumber = e.employeeNumber
       LEFT JOIN Department d ON e.departmentCode = d.departmentCode
       WHERE YEARWEEK(s.monthOfPayment, 1) = YEARWEEK(?, 1)
       ORDER BY e.lastName`,
      [date]
    );
    res.json({ type: 'weekly', weekOf: date, data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Monthly report
router.get('/monthly', verifyToken, async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month || (new Date().getMonth() + 1);
  try {
    const [rows] = await db.query(
      `SELECT s.salaryId, e.employeeNumber, e.firstName, e.lastName, e.position,
              d.departmentName, s.grossSalary, s.totalDeduction, s.netSalary, s.monthOfPayment
       FROM Salary s
       JOIN Employee e ON s.employeeNumber = e.employeeNumber
       LEFT JOIN Department d ON e.departmentCode = d.departmentCode
       WHERE YEAR(s.monthOfPayment) = ? AND MONTH(s.monthOfPayment) = ?
       ORDER BY e.lastName`,
      [year, month]
    );
    // Summary
    const summary = rows.reduce((acc, r) => {
      acc.totalGross += parseFloat(r.grossSalary);
      acc.totalDeductions += parseFloat(r.totalDeduction);
      acc.totalNet += parseFloat(r.netSalary);
      return acc;
    }, { totalGross: 0, totalDeductions: 0, totalNet: 0 });
    res.json({ type: 'monthly', year, month, summary, data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Employee summary report
router.get('/employees', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.employeeNumber, e.firstName, e.lastName, e.position, e.gender,
              e.telephone, e.address, e.hiredDate, d.departmentName,
              COUNT(s.salaryId) as paymentCount,
              SUM(s.netSalary) as totalNetPaid
       FROM Employee e
       LEFT JOIN Department d ON e.departmentCode = d.departmentCode
       LEFT JOIN Salary s ON e.employeeNumber = s.employeeNumber
       GROUP BY e.employeeNumber
       ORDER BY e.firstName`
    );
    res.json({ type: 'employees', data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Department report
router.get('/departments', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.departmentCode, d.departmentName,
              COUNT(e.employeeNumber) as employeeCount,
              SUM(s.netSalary) as totalNetPaid
       FROM Department d
       LEFT JOIN Employee e ON d.departmentCode = e.departmentCode
       LEFT JOIN Salary s ON e.employeeNumber = s.employeeNumber
       GROUP BY d.departmentCode
       ORDER BY d.departmentName`
    );
    res.json({ type: 'departments', data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
