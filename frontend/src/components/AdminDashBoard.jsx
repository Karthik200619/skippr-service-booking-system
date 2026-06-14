import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useAuth } from "../store/authStore";

function AdminDashBoard() {
  const currentUser = useAuth((state) => state.currentUser);
  const [blocks, setBlocks] = useState([]);
  const [flats, setFlats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const {
    register: registerBlock,
    handleSubmit: handleCreateBlock,
    reset: resetBlockForm,
    formState: { errors: blockErrors },
  } = useForm();

  const {
    register: registerFlat,
    handleSubmit: handleCreateFlat,
    reset: resetFlatForm,
    formState: { errors: flatErrors },
  } = useForm();

  useEffect(() => {
    loadBlocks();
    loadFlats();
    loadBookings("ALL");
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const loadBlocks = async () => {
    try {
      const res = await axios.get("/admin-api/blocks");
      setBlocks(res.data.payload.blocks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load blocks");
    }
  };

  const loadFlats = async () => {
    try {
      const res = await axios.get("/admin-api/flats");
      setFlats(res.data.payload.flats || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load flats");
    }
  };

  const loadBookings = async (status) => {
    try {
      const query = status && status !== "ALL" ? `?status=${status}` : "";
      const res = await axios.get(`/admin-api/bookings${query}`);
      setBookings(res.data.payload.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load bookings");
    }
  };

  const createBlock = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/admin-api/block", data);
      showMessage("Block created successfully.");
      resetBlockForm();
      loadBlocks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create block");
    } finally {
      setLoading(false);
    }
  };

  const createFlat = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/admin-api/flat", data);
      showMessage("Flat created successfully.");
      resetFlatForm();
      loadFlats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create flat");
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (bookingId, action) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/admin-api/bookings/${bookingId}/${action}`);
      showMessage(`Booking ${action}ed successfully.`);
      loadBookings(statusFilter);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${action} booking`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_28px_60px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-600">Admin dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back{currentUser ? `, ${currentUser.fullName}` : ""}.</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Manage blocks, flats, and booking approvals from one responsive admin screen.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Blocks</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{blocks.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Flats</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{flats.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Bookings</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{bookings.length}</p>
            </div>
          </div>
        </div>
      </section>

      {(message || error) && (
        <section className="rounded-3xl p-4 shadow-sm">
          {message && <p className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
          <h2 className="text-xl font-semibold text-slate-900">Create New Block</h2>
          <p className="mt-2 text-sm text-slate-500">Add a residential block and its base metadata.</p>
          <form className="mt-6 space-y-4" onSubmit={handleCreateBlock(createBlock)}>
            <label className="block text-sm text-slate-700">
              Block Name
              <input
                type="text"
                placeholder="Example: Rose Tower"
                className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...registerBlock("name", { required: "Block name is required" })}
              />
              {blockErrors.name && <span className="mt-2 block text-sm text-rose-600">{blockErrors.name.message}</span>}
            </label>
            <label className="block text-sm text-slate-700">
              Total Floors
              <input
                type="number"
                min="1"
                className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...registerBlock("totalFloors", { required: "Total floors is required" })}
              />
              {blockErrors.totalFloors && <span className="mt-2 block text-sm text-rose-600">{blockErrors.totalFloors.message}</span>}
            </label>
            <label className="block text-sm text-slate-700">
              Description
              <textarea
                rows="4"
                className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                placeholder="Add a short description for this block"
                {...registerBlock("description", {
                  required: "Description is required",
                })}
              />
              {blockErrors.description && <span className="mt-2 block text-sm text-rose-600">{blockErrors.description.message}</span>}
            </label>
            <button type="submit" className="mt-2 inline-flex w-full justify-center rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
              {loading ? "Saving block..." : "Create Block"}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
          <h2 className="text-xl font-semibold text-slate-900">Create New Flat</h2>
          <p className="mt-2 text-sm text-slate-500">Add flat details and assign it to an existing block.</p>
          <form className="mt-6 space-y-4" onSubmit={handleCreateFlat(createFlat)}>
            <label className="block text-sm text-slate-700">
              Block
              <select
                className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...registerFlat("blockId", { required: "Select a block" })}
              >
                <option value="">Select block</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>{block.name}</option>
                ))}
              </select>
              {flatErrors.blockId && <span className="mt-2 block text-sm text-rose-600">{flatErrors.blockId.message}</span>}
            </label>
            <label className="block text-sm text-slate-700">
              Flat Number
              <input
                type="text"
                placeholder="101A"
                className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...registerFlat("flatNumber", { required: "Flat number is required" })}
              />
              {flatErrors.flatNumber && <span className="mt-2 block text-sm text-rose-600">{flatErrors.flatNumber.message}</span>}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-700">
                Floor
                <input
                  type="number"
                  min="1"
                  placeholder="2"
                  className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  {...registerFlat("floor", { required: "Floor is required" })}
                />
                {flatErrors.floor && <span className="mt-2 block text-sm text-rose-600">{flatErrors.floor.message}</span>}
              </label>
              <label className="block text-sm text-slate-700">
                Parking Slot
                <input
                  type="text"
                  placeholder="P-12"
                  className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  {...registerFlat("parkingSlot", {
                    required: "Parking slot is required",
                  })}
                />
                {flatErrors.parkingSlot && <span className="mt-2 block text-sm text-rose-600">{flatErrors.parkingSlot.message}</span>}
              </label>
            </div>
            <label className="block text-sm text-slate-700">
              BHK Type
              <select
                className="mt-2 w-full rounded-3xl border border-slate-300/90 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...registerFlat("bhkType", { required: "Select BHK type" })}
              >
                <option value="">Select type</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
              </select>
              {flatErrors.bhkType && <span className="mt-2 block text-sm text-rose-600">{flatErrors.bhkType.message}</span>}
            </label>
            <button type="submit" className="mt-2 inline-flex w-full justify-center rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
              {loading ? "Saving flat..." : "Create Flat"}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Booking Approvals</h2>
              <p className="mt-2 text-sm text-slate-500">Review booking requests and update booking status in one place.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-500">Filter:</span>
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    loadBookings(status);
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition ${statusFilter === status ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 pr-4 font-semibold text-slate-600">User</th>
                  <th className="py-3 pr-4 font-semibold text-slate-600">Service</th>
                  <th className="py-3 pr-4 font-semibold text-slate-600">Slot</th>
                  <th className="py-3 pr-4 font-semibold text-slate-600">Date</th>
                  <th className="py-3 pr-4 font-semibold text-slate-600">Status</th>
                  <th className="py-3 font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-sm text-slate-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="py-4 pr-4 align-top text-slate-800">
                        {booking.User?.fullName || booking.userId}
                        <div className="text-xs text-slate-500">{booking.User?.email}</div>
                      </td>
                      <td className="py-4 pr-4 align-top text-slate-800">{booking.Service?.name || "-"}</td>
                      <td className="py-4 pr-4 align-top text-slate-800">{booking.Slot?.startTime} - {booking.Slot?.endTime}</td>
                      <td className="py-4 pr-4 align-top text-slate-800">{booking.bookingDate}</td>
                      <td className="py-4 pr-4 align-top">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : booking.status === "REJECTED" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateBooking(booking.id, "approve")}
                            disabled={booking.status !== "PENDING"}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBooking(booking.id, "reject")}
                            disabled={booking.status !== "PENDING"}
                            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
            <h2 className="text-xl font-semibold text-slate-900">Blocks</h2>
            <p className="mt-2 text-sm text-slate-500">Manage the blocks you created and inspect their details.</p>
            <div className="mt-6 space-y-4">
              {blocks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">No blocks available.</div>
              ) : (
                blocks.map((block) => (
                  <div key={block.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-slate-900">{block.name}</h3>
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{block.totalFloors} floors</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{block.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
            <h2 className="text-xl font-semibold text-slate-900">Flats</h2>
            <p className="mt-2 text-sm text-slate-500">Review the flats assigned to each block.</p>
            <div className="mt-6 space-y-4">
              {flats.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">No flats created yet.</div>
              ) : (
                flats.map((flat) => (
                  <div key={flat.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{flat.flatNumber} — {flat.bhkType}</h3>
                        <p className="mt-1 text-sm text-slate-600">Block: {flat.block?.name ?? flat.blockId}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">Floor {flat.floor}</span>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">Parking {flat.parkingSlot}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashBoard;