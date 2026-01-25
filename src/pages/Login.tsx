import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { signIn } from "../services/supabase";
import { getUserProfile } from "../services/userService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message || "Failed to sign in");
        return;
      }

      if (data?.user) {
        // Get user profile from database
        const { data: profile, error: profileError } = await getUserProfile(
          data.user.id,
        );

        if (profileError || !profile) {
          setError("User profile not found");
          return;
        }

        // Check if user is teacher
        if (profile.role !== "teacher") {
          setError("Unauthorized: Teacher access only");
          return;
        }

        // Store session
        localStorage.setItem(
          "teacher_session",
          JSON.stringify({
            email: profile.email,
            id: profile.id,
            role: "teacher",
            name: profile.name,
          }),
        );

        navigate("/teacher/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">SchoolHub</h1>
          <p className="text-slate-600 mt-2">Teacher Login</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
              className="w-full btn-primary mt-6 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/teacher/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Register here
            </Link>
          </p>

          {/* Divider */}
          <hr className="my-6" />

          {/* Other Login Options */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 text-center mb-3">
              Other login options
            </p>
            <Link
              to="/admin/login"
              className="block w-full px-4 py-2.5 border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors text-center text-sm"
            >
              Admin Login
            </Link>
            <Link
              to="/student/login"
              className="block w-full px-4 py-2.5 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors text-center text-sm"
            >
              Student Login
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-blue-800">
              Email: teacher@school.com
              <br />
              Password: password123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Protected by Supabase Authentication
        </p>
      </div>
    </div>
  );
};
