const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Add employee (INSERT)
router.post('/', verifyToken, async (req, res) => {
  const { employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode } = req.body;
  if (!employeeNumber || !firstName || !lastName)
    return res.status(400).json({ message: 'Employee number, first name and last name are required.' });
  try {
    await db.query(
      `INSERT INTO Employee (employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode]
    );
    res.status(201).json({ message: 'Employee added successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Employee number already exists.' });
    res.status(500).json({ message: err.message });
  }
});

// Get all employees (for dropdowns/reports)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.*, d.departmentName FROM Employee e
       LEFT JOIN Department d ON e.departmentCode = d.departmentCode
       ORDER BY e.firstName`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
