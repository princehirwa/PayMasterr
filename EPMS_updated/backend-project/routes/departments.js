const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Add department (INSERT)
router.post('/', verifyToken, async (req, res) => {
  const { departmentCode, departmentName } = req.body;
  if (!departmentCode || !departmentName)
    return res.status(400).json({ message: 'Department code and name are required.' });
  try {
    await db.query('INSERT INTO Department (departmentCode, departmentName) VALUES (?, ?)', [departmentCode, departmentName]);
    res.status(201).json({ message: 'Department added successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Department code already exists.' });
    res.status(500).json({ message: err.message });
  }
});

// Get all departments
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Department ORDER BY departmentName');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
