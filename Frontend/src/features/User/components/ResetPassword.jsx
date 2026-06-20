import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Reset from "../../../components/ui/Reset";
import Submit from "../../../components/ui/Submit";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { resetMyPassword } from "../services/userApi";
import { hasMinLength } from "../../../utils/validation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validCurrent = hasMinLength(currentPassword, 6);
  const validNew = hasMinLength(newPassword, 6);
  const validConfirm = confirmPassword === newPassword && hasMinLength(confirmPassword, 6);
  const canSubmit = validCurrent && validNew && validConfirm;
  const canReset = currentPassword || newPassword || confirmPassword;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setLoading(true);

    try {
      await resetMyPassword({ currentPassword, newPassword });
      toast.success("Password changed successfully. Please login again.");
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-[#f7f7fb] p-6 shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-10">
        <div className="mb-8 rounded-full bg-[#dbdbe3] p-1.5 sm:w-fit">
          <div className="rounded-full bg-[linear-gradient(90deg,#ff6a8d_0%,#ff2f74_100%)] px-8 py-3 text-center text-base font-bold text-white shadow-[0_8px_24px_rgba(255,68,135,0.45)]">
            Reset Password
          </div>
        </div>

        <h1 className="mb-3 text-center text-4xl font-extrabold tracking-wide text-[#171b3d]">
          Change Password
        </h1>
        <p className="mb-8 text-center text-sm text-[#5a5f85] sm:text-base">
          Enter your current password and choose a new secure password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Enter current password"
            error={!validCurrent && currentPassword ? "At least 6 characters" : null}
            className="w-full rounded-2xl border px-5 py-3 text-base outline-none transition border-[#d5d9eb] bg-white shadow-[0_8px_16px_rgba(58,69,131,0.12)] focus:border-[#6f7eea]"
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 6 characters"
            error={!validNew && newPassword ? "At least 6 characters" : null}
            className="w-full rounded-2xl border px-5 py-3 text-base outline-none transition border-[#d5d9eb] bg-white shadow-[0_8px_16px_rgba(58,69,131,0.12)] focus:border-[#6f7eea]"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            error={!validConfirm && confirmPassword ? "Passwords do not match" : null}
            className="w-full rounded-2xl border px-5 py-3 text-base outline-none transition border-[#d5d9eb] bg-white shadow-[0_8px_16px_rgba(58,69,131,0.12)] focus:border-[#6f7eea]"
          />

          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            <Reset
              title="Reset"
              disabled={!canReset || loading}
              onReset={handleReset}
              className="rounded-2xl border border-[#cfd4ea] px-5 py-3 text-base font-semibold text-[#2a2f68] transition hover:bg-[#ecefff]"
            />

            <Submit
              title="Update Password"
              loading={loading}
              disabled={!canSubmit}
              loadingLabel="Updating..."
              className="rounded-2xl bg-[linear-gradient(90deg,#3d3fa5_0%,#1d2146_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(31,35,82,0.35)] transition hover:brightness-110"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
