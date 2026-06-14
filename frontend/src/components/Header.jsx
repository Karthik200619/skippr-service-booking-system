import { useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="inline-flex items-center gap-3 text-xl font-bold text-slate-900" onClick={closeMenu}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md font-extrabold">
              S
            </span>
            <span>Skippr</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${
                  isActive
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              Home
            </NavLink>

            {isAuthenticated && currentUser ? (
              <>
                <NavLink
                  to={currentUser.role === "ADMIN" ? "/admin" : "/customer"}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition ${
                      isActive
                        ? "bg-violet-600 text-white shadow-sm shadow-violet-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <div className="h-4 w-px bg-slate-200"></div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2 text-xs text-slate-600">
                  {currentUser.profileImageUrl ? (
                    <img
                      src={currentUser.profileImageUrl}
                      alt="avatar"
                      className="h-5 w-5 rounded-full object-cover border border-violet-200"
                    />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  )}
                  {currentUser.fullName}
                </span>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-violet-600 px-4 py-2 text-white shadow-sm shadow-violet-100 transition hover:bg-violet-700 hover:shadow"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                // Close Icon (X)
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-lg transition-all duration-300">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              Home
            </NavLink>

            {isAuthenticated && currentUser ? (
              <>
                <NavLink
                  to={currentUser.role === "ADMIN" ? "/admin" : "/customer"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <div className="my-2 border-t border-slate-100"></div>
                <div className="flex items-center gap-3 px-4 py-2">
                  {currentUser.profileImageUrl && (
                    <img
                      src={currentUser.profileImageUrl}
                      alt="avatar"
                      className="h-8 w-8 rounded-full object-cover border border-violet-200"
                    />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{currentUser.fullName}</div>
                    <div className="text-xs text-slate-500">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="mt-2 w-full rounded-2xl bg-slate-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-slate-100"></div>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-2xl bg-violet-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-violet-100 hover:bg-violet-700"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;