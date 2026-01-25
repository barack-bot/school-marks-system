import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

interface StudentProtectedRouteProps {
  children: React.ReactNode;
}

export const TeacherProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = localStorage.getItem("teacher_session");

  if (!session) {
    return <Navigate to="/teacher/login" replace />;
  }

  return <>{children}</>;
};

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const session = localStorage.getItem("admin_session");

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const StudentProtectedRoute = ({
  children,
}: StudentProtectedRouteProps) => {
  const session = localStorage.getItem("student_session");

  if (!session) {
    return <Navigate to="/student/login" replace />;
  }

  return <>{children}</>;
};

// Keep the old name for backwards compatibility
export const ProtectedRoute = TeacherProtectedRoute;
