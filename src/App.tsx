import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import {
  TopNav,
  Sidebar,
  TeacherProtectedRoute,
  AdminProtectedRoute,
  StudentProtectedRoute,
} from "./components";
import {
  Dashboard,
  Students,
  Teachers,
  Classes,
  Subjects,
  Marks,
  Reports,
  Login,
  Register,
  AdminLogin,
  AdminRegister,
  StudentLogin,
  StudentDashboard,
  RoleSelector,
} from "./pages";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopNav
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-64 transition-all duration-300">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<RoleSelector />} />

        {/* ============ TEACHER ROUTES ============ */}
        <Route path="/teacher/login" element={<Login />} />
        <Route path="/teacher/register" element={<Register />} />

        {/* Teacher Dashboard (Protected) */}
        <Route
          path="/teacher/*"
          element={
            <TeacherProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="students" element={<Students />} />
                  <Route path="teachers" element={<Teachers />} />
                  <Route path="classes" element={<Classes />} />
                  <Route path="subjects" element={<Subjects />} />
                  <Route path="marks" element={<Marks />} />
                  <Route path="reports" element={<Reports />} />
                </Routes>
              </DashboardLayout>
            </TeacherProtectedRoute>
          }
        />

        {/* ============ ADMIN ROUTES ============ */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="students" element={<Students />} />
                  <Route path="teachers" element={<Teachers />} />
                  <Route path="classes" element={<Classes />} />
                  <Route path="subjects" element={<Subjects />} />
                  <Route path="marks" element={<Marks />} />
                  <Route path="reports" element={<Reports />} />
                </Routes>
              </DashboardLayout>
            </AdminProtectedRoute>
          }
        />

        {/* ============ STUDENT ROUTES ============ */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route
          path="/student/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />

        {/* Legacy routes for backward compatibility */}
        <Route
          path="/dashboard"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route
          path="/students"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route
          path="/teachers"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route
          path="/classes"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route
          path="/subjects"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route path="/marks" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/reports"
          element={<Navigate to="/admin/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
