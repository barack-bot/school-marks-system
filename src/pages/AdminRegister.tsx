import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { signUp } from "../services/supabase";
import { createUserProfile } from "../services/userService";
import {
  canRegisterAdmin,
  registerAdmin,
  getAdminCount,
  getMaxAdminLimit,
} from "../services/adminManager";

export const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const [canRegister, setCanRegister] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const count = getAdminCount();
    setAdminCount(count);
    setCanRegister(canRegisterAdmin());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check admin limit
    if (!canRegisterAdmin()) {
      setError(
        `Maximum admin limit (${getMaxAdminLimit()}) has been reached. No more admins can be registered.`,
      );
      return;
    }

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
      );

      if (signUpError) {
        setError(signUpError.message || "Failed to register");
        return;
      }

      const userId = data?.user?.id;
      if (!userId) {
        setError("Failed to get user ID");
        return;
      }

      // Create admin profile in database
      const { error: profileError } = await createUserProfile(
        userId,
        formData.email,
        formData.name,
        "admin",
      );

      if (profileError) {
        setError(profileError.message || "Failed to create profile");
        return;
      }

      // Register admin in local manager
      registerAdmin({
        id: userId,
        email: formData.email,
        name: formData.name,
        registeredAt: new Date().toISOString(),
      });

      // Store session
      localStorage.setItem(
        "admin_session",
        JSON.stringify({
          email: formData.email,
          id: userId,
          role: "admin",
        }),
      );

      setSuccess("Registration successful! Redirecting to admin dashboard...");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
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
          <p className="text-slate-600 mt-2">Admin Registration</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100">
          {/* Admin Limit Alert */}
          {!canRegister && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Registration Closed
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Maximum {getMaxAdminLimit()} admins allowed. All admin slots
                  are filled.
                </p>
              </div>
            </div>
          )}

          {/* Admin Count */}
          <div className="mb-6 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-900">
              Admin Registrations:{" "}
              <span className="font-bold">
                {adminCount}/{getMaxAdminLimit()}
              </span>
            </p>
            <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all"
                style={{ width: `${(adminCount / getMaxAdminLimit()) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <fieldset disabled={!canRegister}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !canRegister}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!canRegister
                  ? "Registration Closed"
                  : loading
                    ? "Registering..."
                    : "Create Admin Account"}
              </button>
            </form>
          </fieldset>

          {/* Login Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Protected by Supabase Authentication
        </p>
      </div>
    </div>
  );
};
