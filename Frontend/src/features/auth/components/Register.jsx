import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiCheck, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { hasMinLength, isEmail, isEqualsToOtherValue, isNotEmpty } from "../../../utils/validation";
import { useInput } from "../../../hooks/useInput.js";
import { useCheckbox } from "../../../hooks/useCheckBox.js";
import { useAuth } from "../hooks/useAuth.js";
import Spinner from "../../../components/ui/Spinner.jsx";

export default function Register() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const {
    value: usernameValue,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
    handleReset: handleUsernameReset,
  } = useInput("", (value) => isNotEmpty(value));

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
    handleReset: handleEmailReset,
  } = useInput("", (value) => isEmail(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
    handleReset: handlePasswordReset,
  } = useInput("", (value) => hasMinLength(value, 6));

  const {
    value: confirmPasswordValue,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordHasError,
    handleReset: handleConfirmPasswordReset,
  } = useInput("", (value) => hasMinLength(value, 6) && isEqualsToOtherValue(value, passwordValue));

  const {
    value: termsAccepted,
    handleChange: handleTermsChange,
    hasError: termsHasError,
    reset: handleTermsReset,
  } = useCheckbox(false, (value) => value === true);

  const isUsernameValid = isNotEmpty(usernameValue);
  const isEmailValid = isEmail(emailValue);
  const isPasswordValid = hasMinLength(passwordValue, 6);
  const isConfirmPasswordValid = hasMinLength(confirmPasswordValue, 6) && isEqualsToOtherValue(confirmPasswordValue, passwordValue);
  const canSubmit = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && termsAccepted;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      await register({
        email: emailValue,
        password: passwordValue,
        username: usernameValue,
      });
      toast.success("Account created! Welcome to Atelier ✨");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "Registration failed ❌");
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
            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop"
            alt="Fashion Suit Model"
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
            <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">JOIN THE ATELIER CLUB</p>
            <h2 className="text-4xl font-serif leading-tight">"Fashion passes, style is eternal."</h2>
            <p className="text-xs text-slate-300 font-light">— Yves Saint Laurent</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          
          {/* Switcher Pills */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-full bg-stone-100 dark:bg-slate-800">
            <Link
              to="/login"
              className="py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md"
            >
              Register
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Join to enjoy private lookbooks, free express shipping, and seamless checkout.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Name / Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  value={usernameValue}
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameBlur}
                  placeholder="e.g. Elena Rostova"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-2xl border bg-stone-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
                    usernameHasError
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-amber-500"
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="email"
                  value={emailValue}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="name@domain.com"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-2xl border bg-stone-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
                    emailHasError
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-amber-500"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="password"
                  value={passwordValue}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="At least 6 characters"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-2xl border bg-stone-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
                    passwordHasError
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-amber-500"
                  }`}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="password"
                  value={confirmPasswordValue}
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  placeholder="Retype password"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-2xl border bg-stone-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
                    confirmPasswordHasError
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-amber-500"
                  }`}
                />
              </div>
              {confirmPasswordHasError && (
                <p className="text-[11px] text-rose-500 font-medium">Passwords do not match.</p>
              )}
            </div>

            {/* Terms */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>I agree to the Terms of Service & Privacy Policy</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <span>Create Atelier Account</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-slate-900 dark:text-amber-400 hover:underline">
              Sign in
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}