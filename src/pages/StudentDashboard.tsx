import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  BookOpen,
  BarChart3,
  FileText,
  User,
  Clock,
} from "lucide-react";

export const StudentDashboard = () => {
  const navigate = useNavigate();

  const getStudentInfo = () => {
    const session = localStorage.getItem("student_session");
    if (session) {
      try {
        return JSON.parse(session);
      } catch {
        return null;
      }
    }
    return null;
  };

  const studentInfo = getStudentInfo();

  const handleLogout = () => {
    localStorage.removeItem("student_session");
    navigate("/student/login");
  };

  // Mock data for student
  const mockStudentData = {
    name: "Aarav Sharma",
    class: "10-A",
    roll: 15,
    subjects: [
      { name: "Mathematics", marks: 92, total: 100 },
      { name: "English", marks: 85, total: 100 },
      { name: "Science", marks: 88, total: 100 },
      { name: "Social Studies", marks: 90, total: 100 },
    ],
    attendance: 95,
    performance: "Excellent",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 shadow-soft z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">SchoolHub</h1>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">
                {mockStudentData.name}
              </p>
              <p className="text-xs text-slate-500">
                Admission: {studentInfo?.admissionNumber}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-6 h-6 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {mockStudentData.name.split(" ")[0]}!
            </h1>
            <p className="text-green-100">
              Class {mockStudentData.class} • Roll No. {mockStudentData.roll}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Attendance Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Attendance</h3>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {mockStudentData.attendance}%
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Days present: 152/160
              </p>
            </div>

            {/* GPA Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Performance</h3>
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {mockStudentData.performance}
              </p>
              <p className="text-sm text-slate-500 mt-2">Overall rating</p>
            </div>

            {/* Subjects Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Subjects</h3>
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {mockStudentData.subjects.length}
              </p>
              <p className="text-sm text-slate-500 mt-2">Enrolled subjects</p>
            </div>
          </div>

          {/* Marks Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-slate-600" />
                Subject-wise Marks
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      Marks Obtained
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudentData.subjects.map((subject, idx) => {
                    const percentage = (subject.marks / subject.total) * 100;
                    const grade =
                      percentage >= 90
                        ? "A+"
                        : percentage >= 80
                          ? "A"
                          : percentage >= 70
                            ? "B"
                            : "C";

                    return (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {subject.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 text-right">
                          {subject.marks}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 text-right">
                          {subject.total}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 text-right font-semibold">
                          {percentage.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              grade === "A+"
                                ? "bg-green-100 text-green-700"
                                : grade === "A"
                                  ? "bg-blue-100 text-blue-700"
                                  : grade === "B"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">📚 Quick Info</h3>
            <p className="text-sm text-blue-800">
              For any queries about your marks, attendance, or academic
              performance, please contact your class teacher or school
              administration office.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
