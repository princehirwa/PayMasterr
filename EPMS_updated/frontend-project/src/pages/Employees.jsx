import React, { useState, useEffect } from 'react';
import { addEmployee, getEmployees, getDepartments } from '../services/api';

export default function Employees() {
  const [form, setForm] = useState({
    employeeNumber: '', firstName: '', lastName: '', address: '',
    position: '', telephone: '', gender: '', hiredDate: '', departmentCode: ''
  });
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [emp, dept] = await Promise.all([getEmployees(), getDepartments()]);
      setEmployees(emp.data);
      setDepartments(dept.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError(''); setLoading(true);
    try {
      await addEmployee(form);
      setMsg('Employee added successfully!');
      setForm({ employeeNumber: '', firstName: '', lastName: '', address: '', position: '', telephone: '', gender: '', hiredDate: '', departmentCode: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee.');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 Employee Management</h1>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Employee</h2>
        {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{msg}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'employeeNumber', label: 'Employee Number', type: 'text', required: true },
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'address', label: 'Address', type: 'text' },
            { name: 'position', label: 'Position', type: 'text' },
            { name: 'telephone', label: 'Telephone', type: 'tel' },
            { name: 'hiredDate', label: 'Hired Date', type: 'date' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}{field.required && ' *'}</label>
              <input
                type={field.type} name={field.name} value={form[field.name]}
                onChange={handleChange} required={field.required}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select name="departmentCode" value={form.departmentCode} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.departmentCode} value={d.departmentCode}>{d.departmentName}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60">
              {loading ? 'Saving...' : '+ Add Employee'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">Employee Records ({employees.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                {['Emp No', 'First Name', 'Last Name', 'Position', 'Department', 'Gender', 'Telephone', 'Hired Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No employees yet</td></tr>
              ) : employees.map(emp => (
                <tr key={emp.employeeNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-blue-700">{emp.employeeNumber}</td>
                  <td className="px-4 py-3">{emp.firstName}</td>
                  <td className="px-4 py-3">{emp.lastName}</td>
                  <td className="px-4 py-3">{emp.position || '-'}</td>
                  <td className="px-4 py-3">{emp.departmentName || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${emp.gender === 'Male' ? 'bg-blue-100 text-blue-700' : emp.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>
                      {emp.gender || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{emp.telephone || '-'}</td>
                  <td className="px-4 py-3">{emp.hiredDate ? new Date(emp.hiredDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
