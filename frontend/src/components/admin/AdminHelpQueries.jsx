import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";

function AdminHelpQueries() {
  const [queries, setQueries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, RESOLVED
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQueries();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const loadQueries = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/admin-api/help-queries");
      setQueries(res.data.payload.queries || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load help queries");
    } finally {
      setFetching(false);
    }
  };

  const handleResolveQuery = async (queryId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/admin-api/help-queries/${queryId}/resolve`);
      toast.success("Help query marked as resolved!");
      showMessage("Query resolved successfully.");
      loadQueries();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to resolve query");
      toast.error(err.response?.data?.message || "Failed to resolve query");
    } finally {
      setLoading(false);
    }
  };

  // Filter queries locally
  const filteredQueries = queries.filter(q => {
    if (statusFilter !== "ALL" && q.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {(message || error) && (
        <section className="rounded-2xl p-4 shadow-sm">
          {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        </section>
      )}

      <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Resident Help Queries</h2>
            <p className="mt-2 text-sm text-slate-500">Monitor and resolve inquiries and concerns submitted by flat owners.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Filter:</span>
            {['ALL', 'PENDING', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status ? "bg-violet-600 text-white shadow-md shadow-violet-100" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[750px] divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr>
                <th className="py-3 pr-4 font-semibold text-slate-650 w-[25%]">Resident / Flat</th>
                <th className="py-3 pr-4 font-semibold text-slate-650 w-[20%]">Subject</th>
                <th className="py-3 pr-4 font-semibold text-slate-650 w-[35%]">Message Details</th>
                <th className="py-3 pr-4 font-semibold text-slate-650 w-[10%]">Status</th>
                <th className="py-3 font-semibold text-slate-650 w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fetching ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-slate-550">
                    Loading queries...
                  </td>
                </tr>
              ) : filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-slate-500">
                    No help queries found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredQueries.map((query) => (
                  <tr key={query.id} className="hover:bg-slate-50">
                    {/* User profile & details */}
                    <td className="py-4 pr-4 align-top text-slate-800">
                      <div className="font-bold">{query.user?.fullName || "Unknown"}</div>
                      <div className="text-xs text-slate-550 font-semibold mt-0.5">
                        {query.user?.flat ? `Block ${query.user.flat.block?.name || query.user.flat.blockId} • Flat ${query.user.flat.flatNumber}` : "No Flat"}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{query.user?.email}</div>
                      <div className="text-xs text-slate-400">{query.user?.mobile}</div>
                    </td>

                    {/* Subject */}
                    <td className="py-4 pr-4 align-top font-semibold text-slate-800">
                      {query.subject}
                    </td>

                    {/* Message Details */}
                    <td className="py-4 pr-4 align-top text-slate-600 leading-relaxed break-words whitespace-pre-line">
                      <div>{query.message}</div>
                      <div className="text-[10px] text-slate-400 mt-2">
                        Submitted: {new Date(query.createdAt).toLocaleString()}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 pr-4 align-top">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        query.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {query.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 align-top">
                      <button
                        onClick={() => handleResolveQuery(query.id)}
                        disabled={query.status === "RESOLVED" || loading}
                        className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminHelpQueries;
