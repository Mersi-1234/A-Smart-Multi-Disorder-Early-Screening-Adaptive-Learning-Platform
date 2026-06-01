import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Test from "./pages/Test";
import ChildProfile from "./pages/ChildProfile";
import Report from "./pages/Report";
import Training from "./pages/Training";

import ReadingTest from "./modules/detection/ReadingTest";
import WritingTest from "./modules/detection/WritingTest";
import MathTest from "./modules/detection/MathTest";

import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

import RoleSelector from "./components/RoleSelector";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Role selector */}
        <Route path="/role" element={<RoleSelector />} />

        {/* Dashboards */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Child profile */}
        <Route
          path="/child-profile"
          element={
            <ProtectedRoute allowedRoles={["parent", "teacher"]}>
              <ChildProfile />
            </ProtectedRoute>
          }
        />

        {/* Detection flow */}
        <Route
          path="/test"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Test />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reading"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ReadingTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/writing"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <WritingTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/math"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MathTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={["student", "parent", "teacher"]}>
              <Report />
            </ProtectedRoute>
          }
        />

        {/* Training */}
        <Route
          path="/training"
          element={
            <ProtectedRoute allowedRoles={["student", "parent", "teacher"]}>
              <Training />
            </ProtectedRoute>
          }
        />



        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;