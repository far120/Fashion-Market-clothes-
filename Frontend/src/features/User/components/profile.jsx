import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, updateProfile } from "../services/userApi.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import Error from "../../../components/ui/Erorr.jsx";
import { useInput } from "../../../hooks/useInput.js";
import { useToast } from "../../../context/ToastContext";
import { isEmail,isNotEmpty } from "../../../utils/validation";
import Input from "../../../components/ui/Input.jsx";
import Reset from "../../../components/ui/Reset.jsx";
import Submit from "../../../components/ui/Submit.jsx";
import { useAuth } from "../../auth/hooks/useAuth.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [initialValues, setInitialValues] = useState({ username: "", email: "" });

  const toast = useToast();

  // inputs
  const {
    value: usernameValue,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
  } = useInput("", (value) => isNotEmpty(value));

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", (value) => isEmail(value));


// Validation states for enabling submit button
  const isUsernameValid = isNotEmpty(usernameValue);
  const isEmailValid = isEmail(emailValue);
  const hasChanges =
    usernameValue.trim() !== initialValues.username ||
    emailValue.trim() !== initialValues.email;
  const canSubmit = isUsernameValid && isEmailValid && hasChanges;
  
  // Validation state for enabling reset button
  const canReset = hasChanges;

  function syncFormValues(profileData) {
    const username = profileData?.username || "";
    const email = profileData?.email || "";
    handleUsernameChange({ target: { value: username } });
    handleEmailChange({ target: { value: email } });
    setInitialValues({ username, email });
  }


  // fetch profile
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const data = user || (await getProfile());
        syncFormValues(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (usernameHasError || emailHasError) return;
    setSaving(true);
    try {
      const profileData = {
        username: usernameValue.trim(),
        email: emailValue.trim(),
      };
      const updatedData = await updateProfile(profileData);
      setUser(updatedData);
      syncFormValues(updatedData);
      toast.success("Profile updated successfully ✅");
    } catch (error) {
      toast.error(error.message || "Failed to update profile ❌");
    } finally {
      setSaving(false);
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl bg-[#f7f7fb] p-8 text-center shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-10">
          <div className="mb-4 rounded-full bg-[#ecefff] px-4 py-1 text-sm font-bold tracking-wide text-[#5057a1]">
            Profile
          </div>
          <Spinner size="lg" />
          <p className="mt-4 text-lg font-semibold text-[#2b3278]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }
  if (error) return <Error message={error.message} />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-[#f7f7fb] p-6 shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-10">
        <div className="mb-8 rounded-full bg-[#dbdbe3] p-1.5">
          <div className="rounded-full bg-[linear-gradient(90deg,#ff6a8d_0%,#ff2f74_100%)] px-4 py-3 text-center text-base font-bold text-white shadow-[0_8px_24px_rgba(255,68,135,0.45)]">
            Profile Settings
          </div>
        </div>

        <h1 className="mb-3 text-center text-4xl font-extrabold tracking-wide text-[#171b3d]">
          My Profile
        </h1>
        <p className="mb-8 text-center text-sm text-[#5a5f85] sm:text-base">
          Update your account details using the same UI style as the auth screens.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            type="text"
            value={usernameValue}
            onChange={handleUsernameChange}
            onBlur={handleUsernameBlur}
            error={usernameHasError && "Invalid username"}
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
            error={emailHasError && "Invalid email"}
            className={`w-full rounded-2xl border px-5 py-3 text-base outline-none transition ${
              emailHasError
                ? "border-red-500 bg-red-50"
                : "border-[#d9def0] bg-[#edf2fc] focus:border-[#6f7eea]"
            }`}
          />

          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            <Reset
              title="Reset"
              disabled={!canReset || loading || saving}
              onReset={() => {
                handleUsernameChange({ target: { value: initialValues.username } });
                handleEmailChange({ target: { value: initialValues.email } });
              }}
              className="rounded-2xl border border-[#cfd4ea] px-5 py-3 text-base font-semibold text-[#2a2f68] transition hover:bg-[#ecefff]"
            />

            <Submit
              title="Save Changes"
              loading={saving}
              disabled={!canSubmit || loading}
              loadingLabel="Saving changes..."
              className="rounded-2xl bg-[linear-gradient(90deg,#3d3fa5_0%,#1d2146_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(31,35,82,0.35)] transition hover:brightness-110"
            />
          </div>
        </form>

        <section className="mt-8 rounded-2xl border border-[#d9def0] bg-white p-5 shadow-[0_8px_16px_rgba(58,69,131,0.08)]">
          <h2 className="text-xl font-bold text-[#2c3380]">Security</h2>
          <p className="mt-2 text-sm text-[#5d6288]">
            If you think your password is weak or exposed, update it now.
          </p>

          <Link
            to="/reset-password"
            className="mt-4 inline-flex rounded-2xl bg-[linear-gradient(90deg,#3d3fa5_0%,#1d2146_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(31,35,82,0.35)] transition hover:brightness-110"
          >
            Reset Password
          </Link>
        </section>
      </div>
    </div>
  );
}