import { NavLink } from "react-router";

function Unauthorized() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white/95 p-10 text-center shadow-[0_30px_70px_-45px_rgba(15,23,42,0.2)]">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600">Unauthorized</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900">Access denied</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        You do not have permission to view this page. Please return to the home page or sign in with an account that has the right access.
      </p>
      <NavLink
        to="/"
        className="mt-8 inline-flex rounded-3xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        Back to home
      </NavLink>
    </div>
  );
}

export default Unauthorized;
