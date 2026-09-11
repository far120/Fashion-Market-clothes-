import { useEffect, useState } from "react";
import Error from "../../../components/ui/Erorr";
import Spinner from "../../../components/ui/Spinner";
import { getUserLogs } from "../services/userApi";

export default function AdminUserLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [emailInput, setEmailInput] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  // ======================
  // Fetch Logs
  // ======================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserLogs({
          page,
          limit: 5,
          order: "desc",
          email: emailFilter || undefined,
        });

        setLogs(data?.result || []);
        setPage(data?.page || 1);
        setTotalPages(data?.totalPages || 1);
        setTotalResults(data?.totalResults || 0);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page, emailFilter]);

  // ======================
  // Handlers
  // ======================
  function handleApplyFilter(e) {
    e.preventDefault();
    setPage(1);
    setEmailFilter(emailInput.trim());
  }

  function handleClearFilter() {
    setEmailInput("");
    setEmailFilter("");
    setPage(1);
  }

  // ======================
  // UI
  // ======================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-600 font-medium">Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Error message={error.message} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] px-4 py-10 text-[#FAF9F6] sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col gap-3">
          <span className="inline-flex w-fit rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Audit Intelligence
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
            System & User Activity Logs
          </h1>
          <p className="text-sm text-slate-400">
            Real-time audit log recording user actions, HTTP endpoints, method verbs, and response status codes.
          </p>
        </div>

        {/* 🔍 Search Bar Panel */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#0D1322] p-6 shadow-lg">
          <form onSubmit={handleApplyFilter} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Search audit logs by email address..."
                className="w-full rounded-xl border border-white/15 bg-[#090D16] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95 sm:whitespace-nowrap"
            >
              Search Logs
            </button>

            <button
              type="button"
              onClick={handleClearFilter}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-300 transition hover:bg-white/10 active:scale-95"
            >
              Clear
            </button>
          </form>

          {emailFilter && (
            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs">
              <span className="text-slate-400">Filtering by email:</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 font-semibold text-[#D4AF37]">
                {emailFilter}
                <button onClick={handleClearFilter} className="hover:text-white">
                  ✕
                </button>
              </span>
            </div>
          )}
        </div>

        {/* 📊 Logs Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0D1322] shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">URL Endpoint</th>
                <th className="px-6 py-4 font-semibold">Status Code</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="transition-colors hover:bg-white/[0.04]">
                    {/* USER */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-serif text-sm font-medium text-white">{log.username || "System User"}</p>
                        <p className="text-xs text-slate-400">{log.email || "-"}</p>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                        {log.action || "-"}
                      </span>
                    </td>

                    {/* METHOD */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          log.method === "GET"
                            ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                            : log.method === "POST"
                            ? "border border-sky-500/30 bg-sky-500/15 text-sky-300"
                            : log.method === "PUT"
                            ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                            : log.method === "DELETE"
                            ? "border border-rose-500/30 bg-rose-500/15 text-rose-300"
                            : "border border-white/15 bg-white/10 text-slate-300"
                        }`}
                      >
                        {log.method || "-"}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="px-6 py-4">
                      <div className="max-w-[220px] truncate font-mono text-xs text-slate-300" title={log.url}>
                        {log.url || "-"}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold ${
                          !log.statusCode
                            ? "bg-white/10 text-slate-400"
                            : log.statusCode >= 200 && log.statusCode < 300
                            ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                            : log.statusCode >= 300 && log.statusCode < 400
                            ? "border border-sky-500/30 bg-sky-500/15 text-sky-300"
                            : log.statusCode >= 400 && log.statusCode < 500
                            ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                            : "border border-rose-500/30 bg-rose-500/15 text-rose-300"
                        }`}
                      >
                        {log.statusCode || "-"}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-400">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Pagination */}
        <div className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0D1322] px-6 py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Page <span className="text-[#D4AF37] font-bold">{page}</span> of <span className="text-white">{totalPages}</span>
          </p>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{logs.length}</span> logs on this page · Total records:{" "}
          <span className="font-semibold text-[#D4AF37]">{totalResults}</span>
        </div>
      </section>
    </div>
  );
}