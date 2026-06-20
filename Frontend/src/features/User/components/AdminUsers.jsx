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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-6xl rounded-3xl bg-[#f7f7fb] p-6 shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-10">
        <div className="mb-8 rounded-full bg-[#dbdbe3] p-1.5 sm:w-fit">
          <div className="rounded-full bg-[linear-gradient(90deg,#ff6a8d_0%,#ff2f74_100%)] px-8 py-3 text-center text-base font-bold text-white shadow-[0_8px_24px_rgba(255,68,135,0.45)]">
            Admin Users Management
          </div>
        </div>

        <h1 className="mb-6 text-3xl font-extrabold tracking-wide text-[#171b3d] sm:text-4xl">
          Users
        </h1>

        {/* <section className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-200 overflow-hidden"> */}
          {/* 🔍 Search Bar */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6">
            <form onSubmit={handleApplyFilter} className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <label className="mb-1 block text-sm font-semibold text-[#545778]">Username</label>
                  <input
                  type="text"
                  value={usernameValue}
                  onChange={(event) => setUsernameValue(event.target.value)}
                  placeholder="Search by username"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="mb-1 block text-sm font-semibold text-[#545778]">Email</label>
                  <input
                  type="email"
                  value={emailValue}
                  onChange={(event) => setEmailValue(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="mb-1 block text-sm font-semibold text-[#545778]">Role</label>
                  <select
                    value={roleValue}
                    onChange={(event) => setRoleValue(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">All roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="mb-1 block text-sm font-semibold text-[#545778]">Status</label>
                  <select
                    value={statusValue}
                    onChange={(event) => setStatusValue(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">All status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg active:scale-95 lg:whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>

              <button
                type="button"
                onClick={handleClearFilter}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-gray-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                Clear
              </button>
            </form>

            {(dataInput.username || dataInput.email || dataInput.role || dataInput.isActive) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600">Filtering by:</span>
                {dataInput.username && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
                    user: {dataInput.username}
                  </span>
                )}
                {dataInput.email && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
                    email: {dataInput.email}
                  </span>
                )}
                {dataInput.role && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
                    role: {dataInput.role}
                  </span>
                )}
                {dataInput.isActive && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
                    status: {dataInput.isActive === "true" ? "active" : "inactive"}
                  </span>
                )}
              </div>
            )}
          </div>


        <div className="overflow-x-auto rounded-2xl border border-[#d7dcf2] bg-white shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gradient-to-r from-[#eef1ff] to-[#e8ecff] text-left text-[#2f3478]">
              <tr>
                <th className="px-6 py-4 font-bold">Username</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                const isCurrentUser = item._id === currentUser?._id;
                const actionBusy = actionLoadingUserId === item._id;

                return (
                  <tr key={item._id} className="border-t border-[#eceffd] hover:bg-[#f9faff] transition-colors text-[#3b3f67]">
                    <td className="px-6 py-4 font-semibold text-[#171b3d]">{item.username}</td>
                    <td className="px-6 py-4 text-[#535883]">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#f0f1ff] text-[#3d3fa5]">
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-bold ${
                          item.isActive
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          item.isActive ? "bg-green-500" : "bg-red-500"
                        }`}></span>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleRoleChange(item)}
                          disabled={actionBusy || isCurrentUser}
                          className="rounded-lg bg-gradient-to-r from-[#2f3792] to-[#3d3fa5] hover:from-[#252d7a] hover:to-[#32348c] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {item.role === "admin" ? "Make User" : "Make Admin"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleActivationToggle(item)}
                          disabled={actionBusy || isCurrentUser}
                          className="rounded-lg bg-gradient-to-r from-[#6f52c9] to-[#7d5fb8] hover:from-[#5e456e] hover:to-[#6b4da6] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {item.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={actionBusy || isCurrentUser}
                          className="rounded-lg bg-gradient-to-r from-[#d94e5b] to-[#c53a56] hover:from-[#bf3f52] hover:to-[#b02c48] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
                  <td colSpan={5} className="px-6 py-12 text-center text-[#9098ad] font-medium">
                    <div className="text-5xl mb-3">📭</div>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 px-6 py-6 bg-gradient-to-r from-[#f9faff] to-[#f0f1ff] rounded-xl border border-[#e8ecff]">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="rounded-lg border-2 border-[#cfd4ea] px-5 py-2.5 font-bold text-[#2a2f68] transition hover:bg-[#ecefff] hover:border-[#a8b0d4] transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-[#3b3f67]">
              Page <span className="bg-[#3d3fa5] text-white px-3 py-1 rounded-lg">{page}</span> of <span className="text-[#3d3fa5] font-bold">{totalPages}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border-2 border-[#cfd4ea] px-5 py-2.5 font-bold text-[#2a2f68] transition hover:bg-[#ecefff] hover:border-[#a8b0d4] transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Next →
          </button>
        </div>
      </section>
    </div>
  );
}