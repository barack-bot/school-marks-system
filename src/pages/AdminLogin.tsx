import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { signIn, getUserProfile } from "../services/supabase";

export const AdminLogin = () => {
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
        setError(signInError.message || "Invalid email or password");
        return;
      }

      if (data?.user) {
        // Verify email is confirmed for admin
        if (!data.user.email_confirmed_at) {
          setError(
            "Your email has not been verified yet. Please check your email and click the verification link to continue.",
          );
          return;
        }

        // Get user profile from user_profiles table
        const { data: profile, error: profileError } = await getUserProfile(
          data.user.id,
        );

        if (profileError || !profile) {
          setError("User profile not found");
          return;
        }

        // Check if user is admin (enforced by Supabase RLS)
        if (profile.role !== "admin") {
          setError("Unauthorized: Admin access only");
          return;
        }

        // Store session
        localStorage.setItem(
          "admin_session",
          JSON.stringify({
            email: profile.email,
            id: profile.id,
            role: profile.role,
            full_name: profile.full_name,
          }),
        );

        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">SchoolHub</h1>
          <p className="text-slate-600 mt-2">Admin Portal</p>
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
                  placeholder="admin@school.com"
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
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/admin/register"
              className="text-purple-600 hover:text-purple-700 font-medium"
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
              to="/teacher/login"
              className="block w-full px-4 py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-center text-sm"
            >
              Teacher Login
            </Link>
            <Link
              to="/student/login"
              className="block w-full px-4 py-2.5 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors text-center text-sm"
            >
              Student Login
            </Link>
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
