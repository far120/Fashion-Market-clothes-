
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hasMinLength, isNotEmpty } from "../../../utils/validation.js";
import { useInput } from "../../../hooks/useInput.js";
import { useToast } from "../../../context/ToastContext.jsx";
import Input from "../../../components/ui/Input.jsx";
import Reset from "../../../components/ui/Reset.jsx";
import Submit from "../../../components/ui/Submit.jsx";
import { useAuth } from "../hooks/useAuth.js";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  const {
    value: emailValue,
    handleInputChange: handleemailChange,
    handleInputBlur: handleemailBlur,
    hasError: emailHasError,
    handleReset: handleemailReset,
  } = useInput("", (value) => isNotEmpty(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
    handleReset: handlePasswordReset,
  } = useInput("", (value) => hasMinLength(value, 6));

  // Validation states for enabling submit button
  const isemailValid = isNotEmpty(emailValue);
  const isPasswordValid = hasMinLength(passwordValue, 6);
  const canSubmit = isemailValid && isPasswordValid;
  const canReset = emailValue.trim() !== "" || passwordValue !== "";
 

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setLoading(true);
    try {
      await login(emailValue, passwordValue);
      toast.success("Login successful ✅");
      navigate("/profile", { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed ❌");
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-[#f7f7fb] p-6 shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-10">
        <div className="mb-8 grid grid-cols-2 gap-2 rounded-full bg-[#dbdbe3] p-1.5">
          <Link
            to="/login"
            className="rounded-full bg-[linear-gradient(90deg,#ff6a8d_0%,#ff2f74_100%)] px-4 py-3 text-center text-base font-bold text-white shadow-[0_8px_24px_rgba(255,68,135,0.45)]"
            aria-current="page"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full px-4 py-3 text-center text-base font-bold text-white/80 transition hover:text-white"
          >
            Register
          </Link>
        </div>

        <h2 className="mb-8 text-center text-4xl font-extrabold tracking-wide text-[#171b3d]">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="email"
                type="text"
                name="email"
                onBlur={handleemailBlur}
                onChange={handleemailChange}
                value={emailValue}
                placeholder="Enter your email"
                className={`w-full rounded-2xl border px-5 py-3 pr-12 text-base outline-none transition ${
                  emailHasError
                    ? "border-red-500 bg-red-50"
                    : "border-[#d9def0] bg-[#edf2fc] focus:border-[#6f7eea]"
                }`}
              />
              <FiMail className="pointer-events-none absolute right-4 top-13 -translate-y-1/2 text-xl text-[#474d9d]" />
            </div>
          
            <div className="relative">
              <Input
              label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                value={passwordValue}
                placeholder="Enter your password"
                className={`w-full rounded-2xl border px-5 py-3 pr-12 text-base outline-none transition ${
                  passwordHasError
                    ? "border-red-500 bg-red-50"
                    : "border-[#d5d9eb] bg-white shadow-[0_8px_16px_rgba(58,69,131,0.12)] focus:border-[#6f7eea]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-13 -translate-y-1/2 text-xl text-[#474d9d]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Reset
                title="Reset"
                disabled={!canReset || loading}
                onReset={() => {
                handleemailReset();
                handlePasswordReset();
               }}
                className="rounded-2xl border border-[#cfd4ea] px-5 py-3 text-base font-semibold text-[#2a2f68] transition hover:bg-[#ecefff]"
              />
              <Submit
                title="Login"
                loading={loading}
                disabled={!canSubmit}
                loadingLabel="Logging in..."
                className="rounded-2xl bg-[linear-gradient(90deg,#3d3fa5_0%,#1d2146_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(31,35,82,0.35)] transition hover:brightness-110"
              />
                        
          </div>
        </form>
      </div>
    </div>
  );
}