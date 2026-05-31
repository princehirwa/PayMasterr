import React, { useState, useEffect } from 'react';
import { addDepartment, getDepartments } from '../services/api';

export default function Departments() {
  const [form, setForm] = useState({ departmentCode: '', departmentName: '' });
  const [departments, setDepartments] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDepts = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError(''); setLoading(true);
    try {
      await addDepartment(form);
      setMsg('Department added successfully!');
      setForm({ departmentCode: '', departmentName: '' });
      fetchDepts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add department.');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🏢 Department Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Department</h2>
          {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{msg}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
              <input type="text" name="departmentCode" value={form.departmentCode} onChange={handleChange} required
                placeholder="e.g. HR, IT, FIN"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
              <input type="text" name="departmentName" value={form.departmentName} onChange={handleChange} required
                placeholder="e.g. Human Resources"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60">
              {loading ? 'Saving...' : '+ Add Department'}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Departments ({departments.length})</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Department Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400">No departments yet</td></tr>
              ) : departments.map((d, i) => (
                <tr key={d.departmentCode} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 font-mono text-xs px-2 py-1 rounded">{d.departmentCode}</span></td>
                  <td className="px-4 py-3 font-medium">{d.departmentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
