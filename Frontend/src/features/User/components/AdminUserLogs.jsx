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
<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-6xl rounded-3xl bg-[#f7f7fb] p-6 shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-10">
        <div className="mb-8 rounded-full bg-[#dbdbe3] p-1.5 sm:w-fit">
          <div className="rounded-full bg-[linear-gradient(90deg,#ff6a8d_0%,#ff2f74_100%)] px-8 py-3 text-center text-base font-bold text-white shadow-[0_8px_24px_rgba(255,68,135,0.45)]">
            User Activity Logs
          </div>
        </div>
      
        <section className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-200 overflow-hidden">
          {/* 🔍 Search Bar */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6">
            <form onSubmit={handleApplyFilter} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  placeholder="Search by email address..."
                  className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg active:scale-95 sm:whitespace-nowrap"
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

            {/* Active Filter Tag */}
            {emailFilter && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-gray-600">Filtering by:</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 font-medium">
                  {emailFilter}
                  <button
                    onClick={handleClearFilter}
                    className="hover:text-indigo-900"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* 📊 Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* HEADER */}
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-blue-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    URL
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Timestamp
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-slate-200">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="transition-colors hover:bg-indigo-50/40 border-slate-200"
                    >
                      {/* USER */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {log.username || "-"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {log.email || "-"}
                          </p>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {log.action || "-"}
                        </span>
                      </td>

                      {/* METHOD */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                            log.method === "GET"
                              ? "bg-green-100 text-green-700"
                              : log.method === "POST"
                              ? "bg-blue-100 text-blue-700"
                              : log.method === "PUT"
                              ? "bg-yellow-100 text-yellow-700"
                              : log.method === "DELETE"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {log.method || "-"}
                        </span>
                      </td>

                      {/* URL */}
                      <td className="px-6 py-4">
                        <div
                          className="max-w-[220px] truncate text-gray-600 text-xs font-mono"
                          title={log.url}
                        >
                          {log.url || "-"}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            !log.statusCode
                              ? "bg-gray-100 text-gray-700"
                              : log.statusCode >= 200 && log.statusCode < 300
                              ? "bg-green-100 text-green-700"
                              : log.statusCode >= 300 && log.statusCode < 400
                              ? "bg-blue-100 text-blue-700"
                              : log.statusCode >= 400 && log.statusCode < 500
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {log.statusCode || "-"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-gray-600 text-xs whitespace-nowrap">
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
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-600 font-medium">No logs found</p>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your search filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination */}
          <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                Next
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Showing <span className="font-semibold">{logs.length}</span> logs on
            this page • Total results:{" "}
            <span className="font-semibold">
              {totalResults} estimated
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}