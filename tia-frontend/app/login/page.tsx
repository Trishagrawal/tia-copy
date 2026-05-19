"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, useAuth } from "@/context/AuthContext";
import { login, createUser, getCurrentUser } from "@/lib/api";
import {
  Input,
  Select,
  Button,
  Alert,
  useToast,
} from "@/components";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("student");
  const [department, setDepartment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const { addToast } = useToast();

  const validateLoginForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    if (!validateLoginForm()) return;

    setLoading(true);

    const response = await login(email, password);

    if (response.error) {
      setError(response.error);
      addToast(response.error, "error");
      setLoading(false);
      return;
    }

    if (response.data?.access_token) {
      setToken(response.data.access_token);

      const userResponse = await getCurrentUser<User>();
      if (userResponse.data) {
        setUser(userResponse.data);
        addToast("Welcome back!", "success");
        router.push("/dashboard");
      } else {
        const errMsg = "Failed to fetch user information";
        setError(errMsg);
        addToast(errMsg, "error");
      }
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    if (!validateSignupForm()) return;

    setLoading(true);

    const response = await createUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role,
      department,
    });

    if (response.error) {
      setError(response.error);
      addToast(response.error, "error");
      setLoading(false);
      return;
    }

    // Auto-login after signup
    const loginResponse = await login(email, password);
    if (loginResponse.data?.access_token) {
      setToken(loginResponse.data.access_token);

      const userResponse = await getCurrentUser<User>();
      if (userResponse.data) {
        setUser(userResponse.data);
        addToast("Account created successfully!", "success");
        router.push("/dashboard");
      }
    } else {
      const errMsg = loginResponse.error || "Failed to login after signup";
      setError(errMsg);
      addToast(errMsg, "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-3">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">TIA</h1>
            <p className="text-sm text-gray-600 mt-1">
              The Innovative Assistant
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
              className="mb-6"
            />
          )}

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                id="login-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
                required
              />

              <Input
                id="login-password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: "" });
                }}
                error={errors.password}
                required
              />

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                fullWidth
                className="mt-6"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="signup-firstname"
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName)
                      setErrors({ ...errors, firstName: "" });
                  }}
                  error={errors.firstName}
                  required
                />
                <Input
                  id="signup-lastname"
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName)
                      setErrors({ ...errors, lastName: "" });
                  }}
                  error={errors.lastName}
                  required
                />
              </div>

              <Input
                id="signup-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
                required
              />

              <Select
                id="signup-role"
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: "student", label: "Student" },
                  { value: "faculty", label: "Faculty" },
                ]}
              />

              <Input
                id="signup-department"
                label="Department (Optional)"
                type="text"
                placeholder="e.g., Liberal Arts"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                helperText="Your academic department"
              />

              <Input
                id="signup-password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: "" });
                }}
                error={errors.password}
                helperText={
                  !errors.password ? "At least 6 characters" : undefined
                }
                required
              />

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                fullWidth
                className="mt-6"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}

          {/* Toggle Form */}
          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            {isLogin ? (
              <p className="text-gray-600 text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                    setErrors({});
                  }}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setErrors({});
                  }}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
