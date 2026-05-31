# 🏢 PayMaster EPMS — Employee Payroll Management System

**PayMaster Ltd | Rubavu District, Western Province, Rwanda**

A full-stack web application built with **React.js**, **Node.js/Express.js**, and **MySQL**.

---

## 📁 Project Structure

```
EPMS/
├── backend-project/          # Node.js + Express API
│   ├── config/db.js          # MySQL connection & DB init
│   ├── middleware/auth.js    # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Login & register
│   │   ├── employees.js      # Employee INSERT + GET
│   │   ├── departments.js    # Department INSERT + GET
│   │   ├── salaries.js       # Salary full CRUD
│   │   └── reports.js        # Daily/Weekly/Monthly reports
│   ├── server.js             # Express app entry
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend-project/         # React.js application
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx    # Responsive navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx     # Login + Register page
│   │   │   ├── Dashboard.jsx # Stats overview
│   │   │   ├── Employees.jsx # Employee form + table
│   │   │   ├── Departments.jsx # Department form + table
│   │   │   ├── Salaries.jsx  # Salary CRUD (add/edit/delete)
│   │   │   └── Reports.jsx   # Daily/Weekly/Monthly/Employee/Dept reports
│   │   ├── services/api.js   # Axios API service layer
│   │   ├── App.jsx           # Router setup
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
└── database/
    └── epms_database.sql     # Full database schema + sample data
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or above)
- MySQL Server (v8 recommended)
- npm

---

### 1. Database Setup

```sql
-- Open MySQL and run:
SOURCE /path/to/EPMS/database/epms_database.sql;
```

Or import via MySQL Workbench / phpMyAdmin.

---

### 2. Backend Setup

```bash
cd backend-project
npm install
```

Edit `.env` with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=EPMS
JWT_SECRET=epms_super_secret_key_2026
```

Start the backend:
```bash
npm start
# or for development:
npx nodemon server.js
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend-project
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Authentication

1. Open http://localhost:3000
2. Click **Register** to create your account
3. Login with your credentials
4. Session is maintained with JWT (8 hour expiry)

---

## 📋 Features

### Menu Pages
| Page | Operations |
|------|-----------|
| Dashboard | Stats overview |
| Employee | INSERT + View records |
| Department | INSERT + View records |
| Salary | INSERT + UPDATE + DELETE + VIEW (full CRUD) |
| Reports | Daily / Weekly / Monthly / Employee / Department |

### Reports
- **Daily** — Salary records for a specific date
- **Weekly** — Records for the selected week
- **Monthly** — Records for selected month/year + summary totals
- **Employee Summary** — All employees with payment history
- **Department Summary** — Per-department employee count & payroll

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| Auth | JWT + bcryptjs |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/employees | List employees |
| POST | /api/employees | Add employee |
| GET | /api/departments | List departments |
| POST | /api/departments | Add department |
| GET | /api/salaries | List salaries |
| POST | /api/salaries | Add salary |
| PUT | /api/salaries/:id | Update salary |
| DELETE | /api/salaries/:id | Delete salary |
| GET | /api/reports/daily | Daily report |
| GET | /api/reports/weekly | Weekly report |
| GET | /api/reports/monthly | Monthly report |
| GET | /api/reports/employees | Employee report |
| GET | /api/reports/departments | Department report |

---

*PayMaster Ltd — EPMS v1.0 | National Practical Exam 2026 | ICT & Multimedia — Software Development*
