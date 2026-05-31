import React, { useEffect, useState } from 'react';
import { getEmployees, getDepartments, getSalaries } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-xl shadow p-6 flex items-center gap-4 border-l-4 ${color}`}>
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ employees: 0, departments: 0, salaries: 0, totalNet: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emp, dept, sal] = await Promise.all([getEmployees(), getDepartments(), getSalaries()]);
        const totalNet = sal.data.reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0);
        setStats({ employees: emp.data.length, departments: dept.data.length, salaries: sal.data.length, totalNet });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.username}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's an overview of PayMaster EPMS</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Employees" value={stats.employees} icon="👤" color="border-blue-500" />
        <StatCard label="Departments" value={stats.departments} icon="🏢" color="border-green-500" />
        <StatCard label="Salary Records" value={stats.salaries} icon="💰" color="border-orange-500" />
        <StatCard label="Total Net Paid (RWF)" value={stats.totalNet.toLocaleString()} icon="📈" color="border-purple-500" />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="font-medium text-blue-800 mb-2">📋 System Features</p>
            <ul className="space-y-1">
              <li>• Employee registration & management</li>
              <li>• Department tracking</li>
              <li>• Automated payroll calculation</li>
              <li>• Daily, weekly & monthly reports</li>
            </ul>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="font-medium text-orange-800 mb-2">🏢 Company</p>
            <ul className="space-y-1">
              <li>• <strong>Company:</strong> PayMaster Ltd</li>
              <li>• <strong>Location:</strong> Rubavu District, Rwanda</li>
              <li>• <strong>Sector:</strong> Transportation & Logistics</li>
              <li>• <strong>System:</strong> EPMS v1.0.0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
