import React, { useState } from 'react';
import { getDailyReport, getWeeklyReport, getMonthlyReport, getEmployeeReport, getDepartmentReport } from '../services/api';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState({
    date: new Date().toISOString().slice(0, 10),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const fetchReport = async () => {
    setLoading(true); setError(''); setReport(null);
    try {
      let res;
      if (activeTab === 'daily') res = await getDailyReport(params.date);
      else if (activeTab === 'weekly') res = await getWeeklyReport(params.date);
      else if (activeTab === 'monthly') res = await getMonthlyReport(params.year, params.month);
      else if (activeTab === 'employees') res = await getEmployeeReport();
      else if (activeTab === 'departments') res = await getDepartmentReport();
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report.');
    } finally { setLoading(false); }
  };

  const tabs = [
    { key: 'daily', label: '📅 Daily' },
    { key: 'weekly', label: '📆 Weekly' },
    { key: 'monthly', label: '🗓️ Monthly' },
    { key: 'employees', label: '👥 Employees' },
    { key: 'departments', label: '🏢 Departments' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Reports</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setReport(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-wrap gap-4 items-end">
        {(activeTab === 'daily' || activeTab === 'weekly') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input type="date" value={params.date}
              onChange={e => setParams({ ...params, date: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        {activeTab === 'monthly' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select value={params.month} onChange={e => setParams({ ...params, month: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={params.year} onChange={e => setParams({ ...params, year: e.target.value })}
                min="2020" max="2100"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        )}
        <button onClick={fetchReport} disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60">
          {loading ? 'Loading...' : '🔍 Generate Report'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Report Output */}
      {report && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 text-white px-6 py-4">
            <h2 className="text-lg font-bold">PayMaster Ltd — Employee Payroll Management System</h2>
            <p className="text-blue-200 text-sm">
              {activeTab === 'daily' && `Daily Report — ${params.date}`}
              {activeTab === 'weekly' && `Weekly Report — Week of ${params.date}`}
              {activeTab === 'monthly' && `Monthly Report — ${months[params.month - 1]} ${params.year}`}
              {activeTab === 'employees' && 'Employee Summary Report'}
              {activeTab === 'departments' && 'Department Summary Report'}
              {' '}| Generated: {new Date().toLocaleString()}
            </p>
          </div>

          {/* Monthly Summary Cards */}
          {activeTab === 'monthly' && report.summary && (
            <div className="grid grid-cols-3 gap-4 p-6 bg-blue-50">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Total Gross</p>
                <p className="text-xl font-bold text-gray-800">RWF {report.summary.totalGross.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Total Deductions</p>
                <p className="text-xl font-bold text-red-600">RWF {report.summary.totalDeductions.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Total Net</p>
                <p className="text-xl font-bold text-green-700">RWF {report.summary.totalNet.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Salary Table (daily, weekly, monthly) */}
          {['daily','weekly','monthly'].includes(activeTab) && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 font-semibold text-gray-600">
                  <tr>
                    {['#','Emp No','Employee Name','Position','Department','Gross (RWF)','Deductions (RWF)','Net (RWF)','Month'].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.data.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-8 text-gray-400">No records for this period</td></tr>
                  ) : report.data.map((row, i) => (
                    <tr key={row.salaryId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-blue-700 text-xs">{row.employeeNumber}</td>
                      <td className="px-4 py-3 font-medium">{row.firstName} {row.lastName}</td>
                      <td className="px-4 py-3 text-gray-500">{row.position || '-'}</td>
                      <td className="px-4 py-3 text-gray-500">{row.departmentName || '-'}</td>
                      <td className="px-4 py-3">{parseFloat(row.grossSalary).toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-600">{parseFloat(row.totalDeduction).toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-700 font-semibold">{parseFloat(row.netSalary).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">{row.monthOfPayment ? new Date(row.monthOfPayment).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Employee Report */}
          {activeTab === 'employees' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 font-semibold text-gray-600">
                  <tr>
                    {['#','Emp No','Name','Position','Department','Gender','Telephone','Hired Date','Payments','Total Net'].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.data.length === 0 ? (
                    <tr><td colSpan={10} className="text-center py-8 text-gray-400">No employee records</td></tr>
                  ) : report.data.map((row, i) => (
                    <tr key={row.employeeNumber} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-blue-700 text-xs">{row.employeeNumber}</td>
                      <td className="px-4 py-3 font-medium">{row.firstName} {row.lastName}</td>
                      <td className="px-4 py-3 text-gray-500">{row.position || '-'}</td>
                      <td className="px-4 py-3 text-gray-500">{row.departmentName || '-'}</td>
                      <td className="px-4 py-3">{row.gender || '-'}</td>
                      <td className="px-4 py-3">{row.telephone || '-'}</td>
                      <td className="px-4 py-3">{row.hiredDate ? new Date(row.hiredDate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 text-center">{row.paymentCount}</td>
                      <td className="px-4 py-3 text-green-700 font-semibold">{row.totalNetPaid ? `RWF ${parseFloat(row.totalNetPaid).toLocaleString()}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Department Report */}
          {activeTab === 'departments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 font-semibold text-gray-600">
                  <tr>
                    {['#','Code','Department Name','Employees','Total Net Paid'].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.data.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">No department records</td></tr>
                  ) : report.data.map((row, i) => (
                    <tr key={row.departmentCode} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 font-mono text-xs px-2 py-1 rounded">{row.departmentCode}</span></td>
                      <td className="px-4 py-3 font-medium">{row.departmentName}</td>
                      <td className="px-4 py-3 text-center font-semibold">{row.employeeCount}</td>
                      <td className="px-4 py-3 text-green-700 font-semibold">{row.totalNetPaid ? `RWF ${parseFloat(row.totalNetPaid).toLocaleString()}` : 'RWF 0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-400 border-t">
            Total records: {report.data?.length || 0} | PayMaster Ltd EPMS — Rubavu District, Rwanda
          </div>
        </div>
      )}
    </div>
  );
}
