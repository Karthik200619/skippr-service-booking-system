import { NavLink } from "react-router";

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-240px)] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
        The page you are looking for does not exist or may have moved. Head back to the home page and continue from there.
      </p>
      <NavLink
        to="/"
        className="mt-8 inline-flex rounded-3xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        Go back home
      </NavLink>
    </div>
  );
}

export default NotFound;
