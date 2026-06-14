import { useEffect, useState } from "react";
import axios from "axios";

function AdminOverview() {
  const [stats, setStats] = useState({
    blocks: 0,
    flats: 0,
    bookings: 0,
    pendingBookings: 0,
    pendingUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [blocksRes, flatsRes, bookingsRes, pendingBookingsRes, pendingUsersRes] = await Promise.all([
        axios.get("/admin-api/blocks"),
        axios.get("/admin-api/flats"),
        axios.get("/admin-api/bookings"),
        axios.get("/admin-api/bookings?status=PENDING"),
        axios.get("/admin-api/users?approvalStatus=PENDING"),
      ]);

      setStats({
        blocks: blocksRes.data.payload.blocks?.length || 0,
        flats: flatsRes.data.payload.flats?.length || 0,
        bookings: bookingsRes.data.payload.bookings?.length || 0,
        pendingBookings: pendingBookingsRes.data.payload.bookings?.length || 0,
        pendingUsers: pendingUsersRes.data.payload.users?.length || 0,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-slate-500 animate-pulse">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Blocks</span>
            <span className="text-2xl">🏢</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-slate-900">{stats.blocks}</p>
        </div>

        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Flats</span>
            <span className="text-2xl">🔑</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-slate-900">{stats.flats}</p>
        </div>

        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Bookings</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-slate-900">{stats.bookings}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Actions */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div>
                <p className="font-bold text-amber-950 text-sm">Booking Approvals</p>
                <p className="text-xs text-amber-800 mt-1">Bookings waiting for verification</p>
              </div>
              <span className="bg-amber-500 text-white rounded-full px-3.5 py-1 text-xs font-bold">
                {stats.pendingBookings}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-violet-50 rounded-2xl border border-violet-100">
              <div>
                <p className="font-bold text-violet-950 text-sm">Resident Registrations</p>
                <p className="text-xs text-violet-800 mt-1">Pending registration requests</p>
              </div>
              <span className="bg-violet-600 text-white rounded-full px-3.5 py-1 text-xs font-bold">
                {stats.pendingUsers}
              </span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">System Information</h2>
            <p className="text-sm text-slate-650 leading-relaxed">
              Skippr Booking management software allows administration staff to config and review slot requests
              submitted by residents, manage block infrastructure, flat lists, and verify newly registered occupant accounts.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
            Skippr Admin Core v1.1.0 • Connected to Postgres Dialect
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
