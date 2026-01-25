import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Users, GraduationCap, Shield } from "lucide-react";

export const RoleSelector = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-4xl">S</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">SchoolHub</h1>
          <p className="text-slate-300 text-lg">School Management System</p>
          <p className="text-slate-400 text-sm mt-2">
            Select your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Admin Card */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Admin</h2>
            <p className="text-purple-100 text-sm mb-6">
              Manage the school, teachers, students, and system settings
            </p>
            <div className="space-y-2">
              <Link
                to="/admin/login"
                className="block w-full bg-white text-purple-600 font-semibold py-2.5 rounded-lg hover:bg-purple-50 transition-colors text-center"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </Link>
              <Link
                to="/admin/register"
                className="block w-full border-2 border-white text-white font-semibold py-2.5 rounded-lg hover:bg-white hover:text-purple-600 transition-colors text-center"
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Register
              </Link>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Teacher</h2>
            <p className="text-blue-100 text-sm mb-6">
              Manage classes, marks, attendance, and student performance
            </p>
            <div className="space-y-2">
              <Link
                to="/teacher/login"
                className="block w-full bg-white text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </Link>
              <Link
                to="/teacher/register"
                className="block w-full border-2 border-white text-white font-semibold py-2.5 rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-center"
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Register
              </Link>
            </div>
          </div>

          {/* Student Card */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-6">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Student</h2>
            <p className="text-green-100 text-sm mb-6">
              View your marks, attendance, and academic performance
            </p>
            <div className="space-y-2">
              <Link
                to="/student/login"
                className="block w-full bg-white text-green-600 font-semibold py-2.5 rounded-lg hover:bg-green-50 transition-colors text-center"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-primary-500 font-bold">✓</span>
              <span>Complete Student Management</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-500 font-bold">✓</span>
              <span>Mark & Attendance Tracking</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-500 font-bold">✓</span>
              <span>Class & Subject Management</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-500 font-bold">✓</span>
              <span>Performance Analytics</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-500 font-bold">✓</span>
              <span>PDF Report Generation</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-500 font-bold">✓</span>
              <span>Role-Based Access Control</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          Protected by Supabase Authentication • All Rights Reserved © 2024
        </p>
      </div>
    </div>
  );
};
