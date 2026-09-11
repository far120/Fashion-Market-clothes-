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
    <div className="min-h-screen bg-[#090D16] px-4 py-10 text-[#FAF9F6] sm:px-6 sm:py-16">
      <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              People & Audit Intelligence
            </span>
            <h1 className="mt-3 font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
              User Accounts & System Logs
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Overview of member registrations, staff role distributions, and security event audit trails.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/users"
              className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95"
            >
              Open User Directory
            </Link>
            <Link
              to="/admin/logs"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/20 active:scale-95"
            >
              Open Activity Logs
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/15 p-2.5 text-[#D4AF37]">
              <FiUsers className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{usersData?.totalResults || 0}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-emerald-500/15 p-2.5 text-emerald-400">
              <FiActivity className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Accounts</p>
            <p className="mt-1 font-serif text-3xl font-normal text-emerald-300">{activeCount || 0}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-sky-500/15 p-2.5 text-sky-400">
              <FiActivity className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Audit Logs Recorded</p>
            <p className="mt-1 font-serif text-3xl font-normal text-sky-300">{logsData?.totalResults || 0}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg">
            <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2.5 text-slate-300">
              <FiShield className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Managers Count</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{managersCount}</p>
          </article>

          <article className="rounded-2xl border border-[#D4AF37]/30 bg-[#0D1322] p-5 shadow-lg">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/20 p-2.5 text-[#D4AF37]">
              <FiShield className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Admins Count</p>
            <p className="mt-1 font-serif text-3xl font-normal text-[#D4AF37]">{adminsCount}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg">
            <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2.5 text-slate-300">
              <FiShield className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Standard Members</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{usersCount}</p>
          </article>
        </div>

        {/* Content Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* User List Preview */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Directory</span>
                <h2 className="font-serif text-xl font-medium text-white">Recent Registrations</h2>
              </div>
              <FiUserCheck className="text-2xl text-[#D4AF37]/60" />
            </div>

            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user._id} className="rounded-2xl border border-white/10 bg-[#0D1322] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif text-base font-medium text-white">{user.username || user.email || "User"}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{user.email || "No email"}</p>
                    </div>
                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                      {user.role || "user"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[10px]">
                    <span className={`rounded-full px-2.5 py-0.5 font-semibold ${user.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-slate-500">
                      Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-xs text-slate-400">
                  No users found.
                </p>
              )}
            </div>
          </article>

          {/* Audit Log Preview */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Security</span>
                <h2 className="font-serif text-xl font-medium text-white">Latest Activity Logs</h2>
              </div>
              <FiClock className="text-2xl text-[#D4AF37]/60" />
            </div>

            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log._id} className="rounded-2xl border border-white/10 bg-[#0D1322] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{log.username || "System User"}</p>
                      <p className="mt-0.5 text-xs text-slate-300">{log.action}</p>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                      {log.method || "ACTION"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[200px] font-mono">{log.url || "-"}</span>
                    <span>{log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}</span>
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-xs text-slate-400">
                  No activity logs recorded.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Separation of Concerns</p>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                User permissions and operational audit logs are structured in a dedicated command interface.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 active:scale-95"
          >
            Back to Admin Hub
          </Link>
          <Link
            to="/admin/logs"
            className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95"
          >
            Open Full Activity Logs
          </Link>
        </div>
      </section>
    </div>
  );
}
