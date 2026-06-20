import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiActivity, FiClock, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { getUserLogs, getUsers } from "../../features/User/services/userApi";

export default function AdminUsersDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [logsData, setLogsData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const [usersResponse, logsResponse] = await Promise.all([
          getUsers({ page: 1, limit: 20, order: "desc" }),
          getUserLogs({ page: 1, limit: 8, order: "desc" }),
        ]);

        if (mounted) {
          setUsersData(usersResponse);
          setLogsData(logsResponse);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const users = usersData?.result || [];
  const logs = logsData?.result || [];

  
  const managersCount = useMemo(() => {
    return users.filter((item) => item.role === "manager").length;
  }, [users]);
  const adminsCount = useMemo(() => {
    return users.filter((item) => item.role === "admin").length;
  }, [users]);
  const usersCount = useMemo(() => {
    return users.filter((item) => item.role === "user").length;
  }, [users]);

  const activeCount = useMemo(() => {
    return users.filter((item) => item.isActive).length;
  }, [users]);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eff6ff_0%,#f8fafc_44%,#ffffff_100%)] px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-7xl rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur sm:p-10">
        <div className="flex flex-col gap-6 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-700">
              People & Logs
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Users, roles, and activity in one place.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              This dashboard keeps the people side of the system separate from commerce so the interface stays calm,
              clear, and professional.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/users"
              className="rounded-2xl bg-[linear-gradient(90deg,#0f172a_0%,#1e293b_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:brightness-110"
            >
              Open User Management
            </Link>
            <Link
              to="/admin/logs"
              className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 transition hover:bg-sky-100"
            >
              Open Logs
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-slate-900 p-2 text-white">
              <FiUsers className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Total Users</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{usersData?.totalResults || 0}</p>
          </article>

           <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-sky-100 p-2 text-sky-700">
              <FiActivity className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Total Active users</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{ activeCount || 0}</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-sky-100 p-2 text-sky-700">
              <FiActivity className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Total Logs</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{logsData?.totalResults || 0}</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-emerald-100 p-2 text-emerald-700">
              <FiShield className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Managers In List</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{managersCount}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-emerald-100 p-2 text-emerald-700">
              <FiShield className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Admins In List</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{adminsCount}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-emerald-100 p-2 text-emerald-700">
              <FiShield className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Users In List</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{usersCount}</p>
          </article>

        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Users</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Recent user list</h2>
              </div>
              <FiUserCheck className="text-2xl text-slate-400" />
            </div>

            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{user.username || user.email || "User"}</p>
                      <p className="mt-1 text-sm text-slate-500">{user.email || "No email"}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      {user.role || "user"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="rounded-full bg-white px-3 py-1">{user.isActive ? "Active" : "Inactive"}</span>
                    <span className="rounded-full bg-white px-3 py-1">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No users found.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_14px_32px_rgba(15,23,42,0.12)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Activity</p>
                <h2 className="mt-1 text-xl font-black">Latest logs</h2>
              </div>
              <FiClock className="text-2xl text-sky-200" />
            </div>

            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{log.username || "System user"}</p>
                      <p className="mt-1 text-sm text-slate-300">{log.action}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-200">
                      {log.method || "ACTION"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">{log.url || "-"}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                  </p>
                </div>
              ))}

              {logs.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
                  No activity found.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.18)_0%,rgba(15,23,42,0.08)_100%)] p-4">
              <p className="text-sm font-semibold text-sky-200">Focused workflow</p>
              <p className="mt-1 text-sm text-slate-300">
                User management and audit logs now live together without mixing product operations into the same surface.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to Admin Hub
          </Link>
          <Link
            to="/admin/logs"
            className="rounded-2xl bg-[linear-gradient(90deg,#0f172a_0%,#334155_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:brightness-110"
          >
            Open Full Logs
          </Link>
        </div>
      </section>
    </div>
  );
}
