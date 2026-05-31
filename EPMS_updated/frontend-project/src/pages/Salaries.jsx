import React, { useState, useEffect } from 'react';
import { getSalaries, addSalary, updateSalary, deleteSalary, getEmployees } from '../services/api';

const emptyForm = { grossSalary: '', totalDeduction: '', monthOfPayment: '', employeeNumber: '' };

export default function Salaries() {
  const [form, setForm] = useState(emptyForm);
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = async () => {
    try {
      const [sal, emp] = await Promise.all([getSalaries(), getEmployees()]);
      setSalaries(sal.data);
      setEmployees(emp.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const netPreview = form.grossSalary && form.totalDeduction
    ? (parseFloat(form.grossSalary) - parseFloat(form.totalDeduction)).toFixed(2)
    : '-';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError(''); setLoading(true);
    try {
      if (editId) {
        await updateSalary(editId, form);
        setMsg('Salary record updated successfully!');
        setEditId(null);
      } else {
        await addSalary(form);
        setMsg('Salary record added successfully!');
      }
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save salary record.');
    } finally { setLoading(false); }
  };

  const handleEdit = (sal) => {
    setEditId(sal.salaryId);
    setForm({
      grossSalary: sal.grossSalary,
      totalDeduction: sal.totalDeduction,
      monthOfPayment: sal.monthOfPayment?.slice(0, 10),
      employeeNumber: sal.employeeNumber
    });
    setMsg(''); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteSalary(id);
      setMsg('Salary record deleted.');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete.');
    }
  };

  const cancelEdit = () => { setEditId(null); setForm(emptyForm); setMsg(''); setError(''); };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">💰 Salary Management</h1>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {editId ? '✏️ Edit Salary Record' : 'Add Salary Record'}
        </h2>
        {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{msg}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
            <select name="employeeNumber" value={form.employeeNumber} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="">Select Employee</option>
              {employees.map(e => (
                <option key={e.employeeNumber} value={e.employeeNumber}>
                  {e.firstName} {e.lastName} ({e.employeeNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month of Payment *</label>
            <input type="date" name="monthOfPayment" value={form.monthOfPayment} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary (RWF) *</label>
            <input type="number" name="grossSalary" value={form.grossSalary} onChange={handleChange} required min="0" step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Deduction (RWF) *</label>
            <input type="number" name="totalDeduction" value={form.totalDeduction} onChange={handleChange} required min="0" step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          {/* Net Salary Preview */}
          <div className="md:col-span-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <span className="text-blue-700 font-medium text-sm">Net Salary (Auto-calculated):</span>
              <span className="text-blue-900 font-bold">{netPreview !== '-' ? `RWF ${parseFloat(netPreview).toLocaleString()}` : '-'}</span>
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60">
              {loading ? 'Saving...' : editId ? 'Update Record' : '+ Add Salary'}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">Salary Records ({salaries.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                {['#', 'Employee', 'Department', 'Gross Salary', 'Deductions', 'Net Salary', 'Month', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salaries.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No salary records yet</td></tr>
              ) : salaries.map((sal, i) => (
                <tr key={sal.salaryId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{sal.firstName} {sal.lastName}</td>
                  <td className="px-4 py-3 text-gray-500">{sal.departmentName || '-'}</td>
                  <td className="px-4 py-3">RWF {parseFloat(sal.grossSalary).toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">-RWF {parseFloat(sal.totalDeduction).toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">RWF {parseFloat(sal.netSalary).toLocaleString()}</td>
                  <td className="px-4 py-3">{sal.monthOfPayment ? new Date(sal.monthOfPayment).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(sal)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-lg transition">
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(sal.salaryId)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-2.5 py-1 rounded-lg transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 text-sm mb-4">Are you sure you want to delete this salary record? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
