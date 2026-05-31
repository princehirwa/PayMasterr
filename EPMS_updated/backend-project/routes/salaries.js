const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Get all salaries (READ)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, e.firstName, e.lastName, e.position, d.departmentName
       FROM Salary s
       JOIN Employee e ON s.employeeNumber = e.employeeNumber
       LEFT JOIN Department d ON e.departmentCode = d.departmentCode
       ORDER BY s.monthOfPayment DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single salary (READ)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, e.firstName, e.lastName FROM Salary s
       JOIN Employee e ON s.employeeNumber = e.employeeNumber
       WHERE s.salaryId = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Salary record not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add salary (INSERT)
router.post('/', verifyToken, async (req, res) => {
  const { grossSalary, totalDeduction, monthOfPayment, employeeNumber } = req.body;
  if (!grossSalary || !totalDeduction || !monthOfPayment || !employeeNumber)
    return res.status(400).json({ message: 'All salary fields are required.' });
  if (parseFloat(totalDeduction) >= parseFloat(grossSalary))
    return res.status(400).json({ message: 'Total deduction cannot be greater than or equal to gross salary.' });
  try {
    await db.query(
      `INSERT INTO Salary (grossSalary, totalDeduction, monthOfPayment, employeeNumber)
       VALUES (?, ?, ?, ?)`,
      [grossSalary, totalDeduction, monthOfPayment, employeeNumber]
    );
    res.status(201).json({ message: 'Salary record added successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update salary (UPDATE)
router.put('/:id', verifyToken, async (req, res) => {
  const { grossSalary, totalDeduction, monthOfPayment, employeeNumber } = req.body;
  if (parseFloat(totalDeduction) >= parseFloat(grossSalary))
    return res.status(400).json({ message: 'Total deduction cannot be greater than or equal to gross salary.' });
  try {
    const [result] = await db.query(
      `UPDATE Salary SET grossSalary=?, totalDeduction=?, monthOfPayment=?, employeeNumber=?
       WHERE salaryId=?`,
      [grossSalary, totalDeduction, monthOfPayment, employeeNumber, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary record not found.' });
    res.json({ message: 'Salary record updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete salary (DELETE)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Salary WHERE salaryId = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary record not found.' });
    res.json({ message: 'Salary record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
