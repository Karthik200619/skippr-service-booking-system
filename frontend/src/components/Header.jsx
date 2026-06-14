import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="inline-flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">S</span>
          Skippr
        </NavLink>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "rounded-full bg-violet-600 px-4 py-2 text-white"
                : "rounded-full px-4 py-2 text-slate-700 transition hover:bg-slate-100"
            }
          >
            Home
          </NavLink>

          {isAuthenticated && currentUser ? (
            <>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700">
                {currentUser.fullName}
              </span>
              <button
                onClick={logout}
                className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full px-4 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-violet-600 px-4 py-2 text-white transition hover:bg-violet-700"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;