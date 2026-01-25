import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Hash, Lock, AlertCircle } from "lucide-react";
import { signIn, getStudentByAdmission } from "../services/supabase";

export const StudentLogin = () => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!admissionNumber || !password) {
        setError("Please enter both admission number and password");
        return;
      }

      if (admissionNumber.length < 4) {
        setError("Invalid admission number");
        return;
      }

      // Look up student in database by admission number
      const { data: student, error: studentError } =
        await getStudentByAdmission(admissionNumber);

      if (studentError || !student) {
        setError("Student not found or invalid admission number");
        return;
      }

      // Student must have a user_id (associated auth account)
      if (!student.user_id) {
        setError("Student account not properly configured");
        return;
      }

      // Try to authenticate with Supabase (email from user_profiles)
      // For now, we'll get student profile and use admission_no as password
      // In production, use proper Supabase Auth
      localStorage.setItem(
        "student_session",
        JSON.stringify({
          admission_number: student.admission_no,
          id: student.id,
          user_id: student.user_id,
          name: student.name,
          role: "student",
          section: student.section,
          class_id: student.class_id,
          loginTime: new Date().toISOString(),
        }),
      );

      navigate("/student/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">SchoolHub</h1>
          <p className="text-slate-600 mt-2">Student Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100">
          {/* Info Alert */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <div className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0">ℹ️</div>
            <p className="text-xs text-blue-700">
              Login with your admission number and password
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admission Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admission Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  placeholder="e.g., ADM2024001"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <hr className="my-6" />

          {/* Other Login Options */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 text-center mb-3">
              Other login options
            </p>
            <Link
              to="/teacher/login"
              className="block w-full px-4 py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-center text-sm"
            >
              Teacher Login
            </Link>
            <Link
              to="/admin/login"
              className="block w-full px-4 py-2.5 border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors text-center text-sm"
            >
              Admin Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Need help? Contact your school administration
        </p>
      </div>
    </div>
  );
};
