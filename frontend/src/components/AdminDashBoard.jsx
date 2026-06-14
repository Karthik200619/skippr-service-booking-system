import { Outlet, NavLink } from "react-router";
import { useAuth } from "../store/authStore";

function AdminDashBoard() {
  const currentUser = useAuth((state) => state.currentUser);

  return (
    <div className="space-y-8">
      {/* Admin Greeting header */}
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_28px_60px_-35px_rgba(15,23,42,0.35)]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-600">Admin Control Panel</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Welcome back{currentUser ? `, ${currentUser.fullName}` : ""}.
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Manage residential blocks, flat configurations, slot bookings, and resident registration approvals.
          </p>
        </div>
      </section>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-px scrollbar-none">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `pb-4 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/admin/blocks"
          className={({ isActive }) =>
            `pb-4 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`
          }
        >
          Manage Blocks
        </NavLink>
        <NavLink
          to="/admin/flats"
          className={({ isActive }) =>
            `pb-4 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`
          }
        >
          Manage Flats
        </NavLink>
        <NavLink
          to="/admin/bookings"
          className={({ isActive }) =>
            `pb-4 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`
          }
        >
          Booking Approvals
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `pb-4 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`
          }
        >
          Resident Approvals
        </NavLink>
        <NavLink
          to="/admin/queries"
          className={({ isActive }) =>
            `pb-4 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`
          }
        >
          Help Queries
        </NavLink>
      </div>

      {/* Sub-page content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashBoard;