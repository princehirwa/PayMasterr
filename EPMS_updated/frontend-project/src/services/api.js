import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('epms_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export const getEmployees = () => API.get('/employees');
export const addEmployee = (data) => API.post('/employees', data);

export const getDepartments = () => API.get('/departments');
export const addDepartment = (data) => API.post('/departments', data);

export const getSalaries = () => API.get('/salaries');
export const getSalary = (id) => API.get(`/salaries/${id}`);
export const addSalary = (data) => API.post('/salaries', data);
export const updateSalary = (id, data) => API.put(`/salaries/${id}`, data);
export const deleteSalary = (id) => API.delete(`/salaries/${id}`);

export const getDailyReport = (date) => API.get(`/reports/daily?date=${date}`);
export const getWeeklyReport = (date) => API.get(`/reports/weekly?date=${date}`);
export const getMonthlyReport = (year, month) => API.get(`/reports/monthly?year=${year}&month=${month}`);
export const getEmployeeReport = () => API.get('/reports/employees');
export const getDepartmentReport = () => API.get('/reports/departments');

export default API;
