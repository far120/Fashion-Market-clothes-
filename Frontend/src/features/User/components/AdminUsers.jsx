import { useEffect, useState } from "react";
import Error from "../../../components/ui/Erorr";
import Spinner from "../../../components/ui/Spinner";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  activateUser,
  changeUserRole,
  deleteUser,
  getUsers,
} from "../services/userApi";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [actionLoadingUserId, setActionLoadingUserId] = useState("");
  const [dataInput, setDataInput] = useState({
    email: "",
    username: "",
    role: "",
    isActive: "",
  });

  const [usernameValue, setUsernameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

    // ======================
    // Fetch users
    // ======================
    
    
     async function fetchUsers() { 
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers({
        page,
        limit: 5,
        order: "desc",
        email: dataInput.email || undefined,
        username: dataInput.username || undefined,
        role: dataInput.role || roleValue || undefined,
        isActive: dataInput.isActive || statusValue || undefined,
      });
      setUsers(data?.result || []);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
      setTotalResults(data?.totalResults || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchUsers();

  }, [page, dataInput , statusValue , roleValue  ]);

  
  async function handleRoleChange(targetUser) {
    const nextRole = targetUser.role === "admin" ? "user" : "admin";
    setActionLoadingUserId(targetUser._id);

    try {
      await changeUserRole(targetUser._id, nextRole);
      setUsers((prev) =>
        prev.map((item) =>
          item._id === targetUser._id ? { ...item, role: nextRole } : item
        )
      );
      toast.success(`Role updated to ${nextRole}`);
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setActionLoadingUserId("");
    }
  }

  async function handleActivationToggle(targetUser) {
    setActionLoadingUserId(targetUser._id);
    try {
      await activateUser(targetUser._id);
      setUsers((prev) =>
        prev.map((item) =>
          item._id === targetUser._id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(
        targetUser.isActive ? "User deactivated" : "User activated"
      );
    } catch (err) {
      toast.error(err.message || "Failed to activate/deactivate user");
    } finally {
      setActionLoadingUserId("");
    }
  }

  async function handleDelete(targetUser) {
    const confirmed = window.confirm(
      `Delete user ${targetUser.username || targetUser.email}?`
    );

    if (!confirmed) {
      return;
    }
    setActionLoadingUserId(targetUser._id);
    try {
      await deleteUser(targetUser._id);
      setUsers((prev) => prev.filter((item) => item._id !== targetUser._id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setActionLoadingUserId("");
    }
  }

  async function handleApplyFilter(e) {
    e.preventDefault();
    setDataInput({
      email: emailValue.trim(),
      username: usernameValue.trim(),
      role: roleValue,
      isActive: statusValue,
    });
    setPage(1);
  }

  async function handleClearFilter() {
    setUsernameValue("");
    setEmailValue("");
    setRoleValue("");
    setStatusValue("");
    setDataInput({ email: "", username: "", role: "", isActive: "" });
    setPage(1);
  }




  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4">
        <Error message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] px-4 py-10 text-[#FAF9F6] sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col gap-3">
          <span className="inline-flex w-fit rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Account Governance
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
            User Accounts & Roles
          </h1>
          <p className="text-sm text-slate-400">
            Manage VIP member access, grant administrator privileges, and toggle account activation statuses.
          </p>
        </div>

        {/* 🔍 Search & Filter Bar */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#0D1322] p-6 shadow-lg">
          <form onSubmit={handleApplyFilter} className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  value={usernameValue}
                  onChange={(event) => setUsernameValue(event.target.value)}
                  placeholder="Search by username..."
                  className="w-full rounded-xl border border-white/15 bg-[#090D16] px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={emailValue}
                  onChange={(event) => setEmailValue(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-white/15 bg-[#090D16] px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Role
                </label>
                <select
                  value={roleValue}
                  onChange={(event) => setRoleValue(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#090D16] px-4 py-2.5 text-xs text-white outline-none transition focus:border-[#D4AF37]"
                >
                  <option value="" className="bg-[#090D16]">All roles</option>
                  <option value="user" className="bg-[#090D16]">User</option>
                  <option value="admin" className="bg-[#090D16]">Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Status
                </label>
                <select
                  value={statusValue}
                  onChange={(event) => setStatusValue(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#090D16] px-4 py-2.5 text-xs text-white outline-none transition focus:border-[#D4AF37]"
                >
                  <option value="" className="bg-[#090D16]">All statuses</option>
                  <option value="true" className="bg-[#090D16]">Active</option>
                  <option value="false" className="bg-[#090D16]">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClearFilter}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-300 transition hover:bg-white/10 active:scale-95"
              >
                Clear
              </button>
            </div>
          </form>

          {(dataInput.username || dataInput.email || dataInput.role || dataInput.isActive) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs">
              <span className="text-slate-400">Active filters:</span>
              {dataInput.username && (
                <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 font-semibold text-[#D4AF37]">
                  User: {dataInput.username}
                </span>
              )}
              {dataInput.email && (
                <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 font-semibold text-[#D4AF37]">
                  Email: {dataInput.email}
                </span>
              )}
              {dataInput.role && (
                <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 font-semibold text-[#D4AF37]">
                  Role: {dataInput.role}
                </span>
              )}
              {dataInput.isActive && (
                <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 font-semibold text-[#D4AF37]">
                  Status: {dataInput.isActive === "true" ? "Active" : "Inactive"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 📊 Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0D1322] shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {users.map((item) => {
                const isCurrentUser = item._id === currentUser?._id;
                const actionBusy = actionLoadingUserId === item._id;

                return (
                  <tr key={item._id} className="transition-colors hover:bg-white/[0.04]">
                    <td className="px-6 py-4 font-serif text-sm font-medium text-white">{item.username}</td>
                    <td className="px-6 py-4 text-slate-400">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          item.isActive
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${item.isActive ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleRoleChange(item)}
                          disabled={actionBusy || isCurrentUser}
                          className="rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {item.role === "admin" ? "Make User" : "Make Admin"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleActivationToggle(item)}
                          disabled={actionBusy || isCurrentUser}
                          className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {item.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={actionBusy || isCurrentUser}
                          className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Pagination */}
        <div className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0D1322] px-6 py-4">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Page <span className="text-[#D4AF37] font-bold">{page}</span> of <span className="text-white">{totalPages}</span>
          </p>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </section>
    </div>
  );
}