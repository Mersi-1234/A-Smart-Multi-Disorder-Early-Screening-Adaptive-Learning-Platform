# 🧠A Smart Multi-Disorder Early Screening & Adaptive Learning Platform

A full-stack role-based web application built using React and Firebase to help early detection and intervention of learning disorders such as Dyslexia, Dyscalculia, and Dysgraphia in school-age children.

The platform supports Students, Parents, Teachers, and Admins with screening tests, adaptive learning modules, real-time communication, and progress tracking.

---

## 🚀 Features

### 👥 Role-Based Authentication System
- Student, Parent, Teacher, Admin roles
- Firebase Authentication integration
- Protected routes with dashboard-based access control
- Auto redirection based on user role

---

### 📊 Screening & Evaluation System
- Reading, Writing, and Mathematics tests
- Automatic score calculation
- Learning disorder detection logic
- Risk percentage analysis
- Final performance report generation

---

### 📚 Adaptive Training Module
- Personalized learning activities based on weak areas
- Parent guidance recommendations
- Food & health suggestions for cognitive improvement
- Progress tracking through re-tests

---

### 💬 Real-Time Communication
- Teacher ↔ Parent chat system
- Built using Cloud Firestore
- Real-time updates
- Offline/local-first fallback support

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, CSS Modules
- **Backend:** Firebase Cloud Firestore
- **Authentication:** Firebase Auth
- **Styling:** CSS Modules
- **State Management:** React Hooks / Context API

---

## 📁 Project Structure
MY-APP/
│
├── vscode/
├── my-app/
│
│ ├── public/
│ ├── node_modules/
│
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── modules/
│ │ ├── pages/
│ │ │ ├── ChildProfile.jsx
│ │ │ ├── FirestoreTest.jsx
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── ParentDashboard.jsx
│ │ │ ├── Report.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── StudentDashboard.jsx
│ │ │ ├── TeacherDashboard.jsx
│ │ │ ├── Test.jsx
│ │ │ ├── Training.jsx
│ │ │
│ │ ├── services/
│ │ ├── styles/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.css
│ │ ├── main.jsx
│
├── package.json
├── vite.config.js
├── README.md



