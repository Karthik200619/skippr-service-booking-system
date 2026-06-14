import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

function UserDashBaord() {
  const currentUser = useAuth((state) => state.currentUser);
  
  // State variables
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Booking Form State
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Initialization
  useEffect(() => {
    loadServices();
    loadBookings();
    
    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setBookingDate(today);
  }, []);

  // Fetch slots whenever service or date changes
  useEffect(() => {
    if (selectedService && bookingDate) {
      loadSlots(selectedService.id, bookingDate);
    } else {
      setSlots([]);
      setSelectedSlotId(null);
    }
  }, [selectedService, bookingDate]);

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const res = await axios.get("/user-api/services");
      setServices(res.data.payload.services || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoadingServices(false);
    }
  };

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await axios.get("/user-api/my-bookings");
      setBookings(res.data.payload.bookings || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadSlots = async (serviceId, date) => {
    setLoadingSlots(true);
    setSelectedSlotId(null);
    try {
      const res = await axios.get(`/user-api/service-slots?serviceId=${serviceId}&bookingDate=${date}`);
      setSlots(res.data.payload.slots || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }
    if (!bookingDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedSlotId) {
      toast.error("Please select a time slot");
      return;
    }

    setSubmittingBooking(true);
    try {
      await axios.post("/user-api/book-service", {
        serviceId: selectedService.id,
        slotId: selectedSlotId,
        bookingDate,
        notes,
        priority
      });
      toast.success("Booking requested successfully!");
      // Reset form
      setSelectedService(null);
      setNotes("");
      setSelectedSlotId(null);
      setPriority("MEDIUM");
      // Reload bookings list
      loadBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Helper to get service icon based on service name
  const getServiceIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("club")) return "🏢";
    if (n.includes("gym")) return "🏋️‍♂️";
    if (n.includes("pool")) return "🏊‍♂️";
    if (n.includes("ten")) return "🎾";
    if (n.includes("plum")) return "🔧";
    if (n.includes("ele")) return "⚡";
    return "🛠️";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card & Profile Summary */}
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)] md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 shadow-md flex-shrink-0">
              {currentUser?.profileImageUrl ? (
                <img
                  src={currentUser.profileImageUrl}
                  alt={currentUser.fullName}
                  className="h-full w-full rounded-2xl object-cover bg-white"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-violet-600">
                  {currentUser?.fullName?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">Resident Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Welcome back, {currentUser?.fullName}.</h1>
              <p className="text-sm text-slate-500">{currentUser?.email} | {currentUser?.mobile}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-3 text-center min-w-[100px] flex-grow md:flex-grow-0">
              <span className="block text-xs font-semibold text-slate-500">Status</span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Verified Resident
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-3 text-center min-w-[100px] flex-grow md:flex-grow-0">
              <span className="block text-xs font-semibold text-slate-500">My Bookings</span>
              <span className="mt-1 block text-lg font-bold text-slate-900">{bookings.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Forms vs Bookings */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* Left column: Booking Request Wizard */}
        <section className="rounded-[2.5rem] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)] md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Book a New Service</h2>
            <p className="text-sm text-slate-500">Select an amenity or repair service, choose a date, and select an available slot.</p>
          </div>

          <form onSubmit={handleBookService} className="space-y-6">
            
            {/* Step 1: Select Service */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">1. Select Service</label>
              {loadingServices ? (
                <p className="text-sm text-slate-500">Loading services...</p>
              ) : (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 ${
                        selectedService?.id === service.id
                          ? "border-violet-600 bg-violet-50/50 text-violet-700 shadow-sm ring-1 ring-violet-500"
                          : "border-slate-200 bg-slate-50/30 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-3xl mb-2">{getServiceIcon(service.name)}</span>
                      <span className="text-xs font-bold leading-tight">{service.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Select Date */}
            <div className="space-y-3">
              <label htmlFor="booking-date" className="block text-sm font-bold text-slate-700">2. Select Booking Date</label>
              <input
                id="booking-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                required
              />
            </div>

            {/* Step 3: Select Slot */}
            {selectedService && bookingDate && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  3. Select Time Slot {loadingSlots && <span className="text-xs text-slate-500 font-normal ml-2">Loading slots...</span>}
                </label>
                
                {loadingSlots ? (
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-14 rounded-2xl bg-slate-100 animate-pulse"></div>
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-amber-600 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    No slots are currently defined for this service or date.
                  </p>
                ) : (
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {slots.map((slot) => {
                      const isAvailable = slot.status === "AVAILABLE" || slot.status === "PENDING";
                      return (
                        <button
                          key={slot.slotId}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedSlotId(slot.slotId)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                            !isAvailable
                              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                              : selectedSlotId === slot.slotId
                              ? "border-violet-600 bg-violet-600 text-white shadow-md"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <span className="text-xs block font-medium opacity-80">Slot</span>
                            <span className="text-sm font-bold">{slot.startTime} - {slot.endTime}</span>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              slot.status === "APPROVED"
                                ? "bg-rose-100 text-rose-700"
                                : slot.status === "PENDING"
                                ? (selectedSlotId === slot.slotId ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800")
                                : selectedSlotId === slot.slotId
                                ? "bg-white/20 text-white"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {slot.status === "APPROVED" ? "APPROVED" : slot.status === "PENDING" ? "PENDING" : "Available"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Select Priority */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">4. Select Priority</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Low", value: "LOW", hoverBg: "hover:border-emerald-500 hover:bg-emerald-50/20 text-emerald-700 border-emerald-100", activeBg: "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-100" },
                  { label: "Medium", value: "MEDIUM", hoverBg: "hover:border-amber-500 hover:bg-amber-50/20 text-amber-700 border-amber-100", activeBg: "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-100" },
                  { label: "High", value: "HIGH", hoverBg: "hover:border-rose-500 hover:bg-rose-50/20 text-rose-700 border-rose-100", activeBg: "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-100" }
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all ${
                      priority === p.value ? p.activeBg : `border-slate-200 bg-slate-50/30 text-slate-700 ${p.hoverBg}`
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Notes */}
            <div className="space-y-3">
              <label htmlFor="booking-notes" className="block text-sm font-bold text-slate-700">5. Optional Notes</label>
              <textarea
                id="booking-notes"
                placeholder="Provide additional details (e.g. door key location, specific issues)..."
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submittingBooking || !selectedService || !bookingDate || !selectedSlotId}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-violet-100 transition hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {submittingBooking ? "Creating Booking Request..." : "Confirm Booking"}
            </button>
          </form>
        </section>

        {/* Right column: Bookings List */}
        <section className="rounded-[2.5rem] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)] md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">My Booking History</h2>
            <button
              onClick={loadBookings}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {loadingBookings ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 rounded-2xl bg-slate-50 animate-pulse"></div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                <span className="text-4xl block mb-2">📅</span>
                <p className="text-sm font-semibold">No bookings found</p>
                <p className="text-xs text-slate-400 mt-1">Select a service and date on the left to request your first slot.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getServiceIcon(booking.Service?.name || "")}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{booking.Service?.name || "Service"}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-500">{booking.bookingDate}</p>
                          <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            booking.priority === "HIGH"
                              ? "bg-rose-100 text-rose-700"
                              : booking.priority === "MEDIUM"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {booking.priority || "MEDIUM"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : booking.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100/80 pt-2 text-xs text-slate-600">
                    <span>🕒 {booking.Slot?.startTime} - {booking.Slot?.endTime}</span>
                    {booking.notes && (
                      <span className="max-w-[120px] truncate italic text-slate-400" title={booking.notes}>
                        "{booking.notes}"
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashBaord;