import { useEffect, useState } from "react";
import axios from 'axios';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // New Block and Slot Filter State
  const [blocks, setBlocks] = useState([]);
  const [slots, setSlots] = useState([]);
  const [blockFilter, setBlockFilter] = useState("ALL");
  const [slotFilter, setSlotFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings("ALL");
    
    // Load blocks for filter
    axios.get("/common-api/blocks")
      .then(res => setBlocks(res.data.payload.blocks || []))
      .catch(err => console.error("Error fetching blocks:", err));

    // Load slots for filter
    axios.get("/common-api/slots")
      .then(res => setSlots(res.data.payload.slots || []))
      .catch(err => console.error("Error fetching slots:", err));
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const loadBookings = async (status) => {
    setFetching(true);
    try {
      const query = status && status !== "ALL" ? `?status=${status}` : "";
      const res = await axios.get(`/admin-api/bookings${query}`);
      setBookings(res.data.payload.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load bookings");
    } finally {
      setFetching(false);
    }
  };

  const updateBooking = async (bookingId, action) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/admin-api/bookings/${bookingId}/${action}`);
      const actionMsg = action === "reject-others" ? "Other bookings rejected" : `Booking ${action}ed`;
      showMessage(`${actionMsg} successfully.`);
      loadBookings(statusFilter);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to perform ${action} action`);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for Block and Slot Time
  const filteredBookings = bookings.filter((booking) => {
    if (blockFilter !== "ALL") {
      const blockName = booking.User?.flat?.block?.name;
      if (blockName !== blockFilter) return false;
    }
    if (slotFilter !== "ALL") {
      const slotTime = booking.Slot ? `${booking.Slot.startTime} - ${booking.Slot.endTime}` : "";
      if (slotTime !== slotFilter) return false;
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
            <h2 className="text-xl font-semibold text-slate-900">Booking Approvals</h2>
            <p className="mt-2 text-sm text-slate-500">Review booking requests and update booking status in one place.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Filter:</span>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  loadBookings(status);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status ? "bg-violet-600 text-white shadow-md shadow-violet-100" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Filters for Block & Slot Time */}
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-slate-50/70 p-4 border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Block:</span>
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium focus:border-violet-500 focus:outline-none"
            >
              <option value="ALL">All Blocks</option>
              {blocks.map((b) => (
                <option key={b.id} value={b.name}>Block {b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Slot Time:</span>
            <select
              value={slotFilter}
              onChange={(e) => setSlotFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium focus:border-violet-500 focus:outline-none"
            >
              <option value="ALL">All Slot Times</option>
              {slots.map((s) => (
                <option key={s.id} value={`${s.startTime} - ${s.endTime}`}>{s.startTime} - {s.endTime}</option>
              ))}
            </select>
          </div>

          {(blockFilter !== "ALL" || slotFilter !== "ALL") && (
            <button
              onClick={() => {
                setBlockFilter("ALL");
                setSlotFilter("ALL");
              }}
              className="sm:ml-auto text-xs font-semibold text-violet-650 hover:text-violet-800 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr>
                <th className="py-3 pr-4 font-semibold text-slate-650">User / Block</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Service</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Slot</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Date</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Status</th>
                <th className="py-3 font-semibold text-slate-650">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fetching ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-slate-550">
                    Loading bookings data...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-slate-500">
                    No bookings found matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="py-4 pr-4 align-top text-slate-800">
                      <div className="font-bold">{booking.User?.fullName || booking.userId}</div>
                      <div className="text-xs text-slate-550 font-semibold mt-0.5">
                        {booking.User?.flat ? `Block ${booking.User.flat.block?.name || booking.User.flat.blockId} • Flat ${booking.User.flat.flatNumber}` : "No flat assigned"}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{booking.User?.email}</div>
                      <div className="text-xs text-slate-400">{booking.User?.mobile}</div>
                    </td>
                    <td className="py-4 pr-4 align-top text-slate-800 font-medium">{booking.Service?.name || "-"}</td>
                    <td className="py-4 pr-4 align-top text-slate-800 font-medium">
                      {booking.Slot?.startTime} - {booking.Slot?.endTime}
                    </td>
                    <td className="py-4 pr-4 align-top text-slate-650">{booking.bookingDate}</td>
                    <td className="py-4 pr-4 align-top">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        booking.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : booking.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateBooking(booking.id, "approve")}
                          disabled={booking.status !== "PENDING" || loading}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateBooking(booking.id, "reject")}
                          disabled={booking.status !== "PENDING" || loading}
                          className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          Reject
                        </button>
                        {booking.status === "APPROVED" && (
                          <button
                            onClick={() => updateBooking(booking.id, "reject-others")}
                            disabled={loading}
                            className="rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50"
                          >
                            Reject Others
                          </button>
                        )}
                      </div>
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

export default AdminBookings;
