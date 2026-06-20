import { Link } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import {hasMinLength,  isEmail,  isEqualsToOtherValue,  isNotEmpty} from "../../../utils/validation";
import { register } from "../services/authApi";
import { useInput } from "../../../hooks/useInput.js";
import { useCheckbox } from "../../../hooks/useCheckBox.js";
import Input from "../../../components/ui/Input.jsx";
import Reset from "../../../components/ui/Reset.jsx";
import Submit from "../../../components/ui/Submit.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

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
  } = useInput("",(value) => hasMinLength(value, 6) && isEqualsToOtherValue(value, passwordValue));

  const {
    value: termsAccepted,
    handleChange: handleTermsChange,
    hasError: termsHasError,
    reset: handleTermsReset,
  } = useCheckbox(false, (value) => value === true);

 // Validation states for enabling submit button
  const isUsernameValid = isNotEmpty(usernameValue);
  const isEmailValid = isEmail(emailValue);
  const isPasswordValid = hasMinLength(passwordValue, 6);
  const isConfirmPasswordValid = hasMinLength(confirmPasswordValue, 6) &&  isEqualsToOtherValue(confirmPasswordValue, passwordValue);
  const canSubmit = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && termsAccepted;
  
  // Validation state for enabling reset button
  const canReset = usernameValue.trim() !== "" || emailValue.trim() !== "" || passwordValue !== "" || confirmPasswordValue !== "" || termsAccepted;

  async function handleSubmit(e) {
    e.preventDefault();
    // Final validation check before submission
    if (!canSubmit) {
      return;
    }
    setLoading(true);
    try {
      const userData = {
        email: emailValue,
        password: passwordValue,
        username: usernameValue,
      };

      await register(userData);
      toast.success("Registration successful ✅");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "Registration failed ❌");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-[#f7f7fb] p-6 shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-10">
        <div className="mb-8 grid grid-cols-2 gap-2 rounded-full bg-[#dbdbe3] p-1.5">
          <Link
            to="/login"
            className="rounded-full px-4 py-3 text-center text-base font-bold text-white/80 transition hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-[linear-gradient(90deg,#ff6a8d_0%,#ff2f74_100%)] px-4 py-3 text-center text-base font-bold text-white shadow-[0_8px_24px_rgba(255,68,135,0.45)]"
            aria-current="page"
          >
            Register
          </Link>
        </div>

        <h2 className="mb-8 text-center text-4xl font-extrabold tracking-wide text-[#171b3d]">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              value={usernameValue}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              placeholder="Choose a username"
              className={`w-full rounded-2xl border px-5 py-3 text-base outline-none transition ${
                usernameHasError
                  ? "border-red-500 bg-red-50"
                  : "border-[#d9def0] bg-[#edf2fc] focus:border-[#6f7eea]"
              }`}
            />
    
            <Input
              label="Email"
              type="email"
              value={emailValue}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="name@example.com"
              className={`w-full rounded-2xl border px-5 py-3 text-base outline-none transition ${
                emailHasError
                  ? "border-red-500 bg-red-50"
                  : "border-[#d9def0] bg-[#edf2fc] focus:border-[#6f7eea]"
              }`}
            />
           
            <Input
              label="Password"
              type="password"
              value={passwordValue}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              placeholder="At least 6 characters"
              className={`w-full rounded-2xl border px-5 py-3 text-base outline-none transition ${
                passwordHasError
                  ? "border-red-500 bg-red-50"
                  : "border-[#d5d9eb] bg-white shadow-[0_8px_16px_rgba(58,69,131,0.12)] focus:border-[#6f7eea]"
              }`}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPasswordValue}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              placeholder="Retype your password"
              className={`w-full rounded-2xl border px-5 py-3 text-base outline-none transition ${
                confirmPasswordHasError
                  ? "border-red-500 bg-red-50"
                  : "border-[#d5d9eb] bg-white shadow-[0_8px_16px_rgba(58,69,131,0.12)] focus:border-[#6f7eea]"
              }`}
              error={confirmPasswordHasError ? "Passwords do not match." : null}
            />
          

          <div className="pt-1">
            <label className="flex items-center gap-3 text-sm text-[#4f5376]">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="h-4 w-4 rounded border-[#b7bfd8] text-[#393e98] focus:ring-[#626ee0]"
              />
              I agree to the terms and conditions
            </label>
            {termsHasError && (
              <p className="mt-2 text-sm font-medium text-red-500">You must accept the terms.</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
          <Reset
            title="Reset"
            disabled={!canReset || loading}
            onReset={() => {
              handleUsernameReset();
              handleEmailReset();
              handlePasswordReset();
              handleConfirmPasswordReset();
              handleTermsReset();
              }}
            className="rounded-2xl border border-[#cfd4ea] px-5 py-3 text-base font-semibold text-[#2a2f68] transition hover:bg-[#ecefff]"
          />
        
              <Submit
                title="Register"
                loading={loading}
                disabled={!canSubmit}
                loadingLabel="Creating account..."
                className="rounded-2xl bg-[linear-gradient(90deg,#3d3fa5_0%,#1d2146_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(31,35,82,0.35)] transition hover:brightness-110"
              />
            
           
          </div>
        </form>
      </div>
    </div>
  );
}