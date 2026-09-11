
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { hasMinLength, isNotEmpty } from "../../../utils/validation.js";
import { useInput } from "../../../hooks/useInput.js";
import { useToast } from "../../../context/ToastContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import Spinner from "../../../components/ui/Spinner.jsx";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
    handleReset: handleEmailReset,
  } = useInput("", (value) => isNotEmpty(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
    handleReset: handlePasswordReset,
  } = useInput("", (value) => hasMinLength(value, 6));

  const isEmailValid = isNotEmpty(emailValue);
  const isPasswordValid = hasMinLength(passwordValue, 6);
  const canSubmit = isEmailValid && isPasswordValid;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      await login(emailValue, passwordValue);
      toast.success("Welcome back to Fashion Market! ✨");
      navigate("/profile", { replace: true });
    } catch (error) {
      toast.error(error.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Fashion Editorial Banner */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
            alt="Fashion Atelier Model"
            className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 flex items-center justify-center font-serif font-bold text-slate-950 text-lg">
              FM
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">FASHION MARKET</span>
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">PRIVATE ATELIER ACCESS</p>
            <h2 className="text-4xl font-serif leading-tight">"Elegance is not standing out, but being remembered."</h2>
            <p className="text-xs text-slate-300 font-light">— Giorgio Armani</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-8">
          
          {/* Navigation Pill Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-full bg-stone-100 dark:bg-slate-800">
            <Link
              to="/login"
              className="py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Register
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage your orders, saved items, and account preferences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="email"
                  value={emailValue}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="name@domain.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border bg-stone-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
                    emailHasError
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  }`}
                />
              </div>
              {emailHasError && (
                <p className="text-[11px] text-rose-500 font-medium">Please enter a valid email address.</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordValue}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-2xl border bg-stone-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
                    passwordHasError
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {passwordHasError && (
                <p className="text-[11px] text-rose-500 font-medium">Password must be at least 6 characters long.</p>
              )}
            </div>

            {/* Submit & Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <span>Sign In To Atelier</span>
                    <FiArrowRight />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleEmailReset();
                  handlePasswordReset();
                }}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Clear Fields
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-bold text-slate-900 dark:text-amber-400 hover:underline">
              Create an account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}