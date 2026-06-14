import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";

function Home() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  const services = [
    {
      name: "Clubhouse",
      icon: "🏢",
      description: "Book the community clubhouse for birthdays, parties, or residential assemblies.",
      badge: "Events"
    },
    {
      name: "Gymnasium",
      icon: "🏋️‍♂️",
      description: "Reserve your daily workout slots at our fully-equipped, modern community gym.",
      badge: "Fitness"
    },
    {
      name: "Swimming Pool",
      icon: "🏊‍♂️",
      description: "Access the lap pool with dedicated family or professional training slots.",
      badge: "Leisure"
    },
    {
      name: "Tennis Court",
      icon: "🎾",
      description: "Book tennis courts for recreation, singles play, or community tournaments.",
      badge: "Sports"
    },
    {
      name: "Plumbing Maintenance",
      icon: "🔧",
      description: "Get immediate plumbing support for leaky pipes, taps, and water system fixes.",
      badge: "Support"
    },
    {
      name: "Electrical Support",
      icon: "⚡",
      description: "Schedule certified electricians for wire fixes, short circuits, or appliance setup.",
      badge: "Support"
    }
  ];

  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-700 to-slate-900 px-6 py-20 text-white shadow-2xl sm:px-12 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="relative mx-auto max-w-4xl text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium backdrop-blur-md">
            🚀 The Smart Way to Manage Residential Services
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Book Services & Slots
            <span className="block mt-2 bg-gradient-to-r from-violet-200 via-indigo-100 to-white bg-clip-text text-transparent">
              In A Few Clicks.
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-violet-100/90 sm:text-xl">
            Welcome to Skippr, the ultimate service booking platform for modern apartment communities. Book facilities, request repair support, and track approvals seamlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <NavLink
                to={currentUser?.role === "ADMIN" ? "/admin" : "/customer"}
                className="rounded-full bg-white px-8 py-4 text-base font-semibold text-violet-700 shadow-lg transition hover:bg-slate-50"
              >
                Go to Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="rounded-full bg-white px-8 py-4 text-base font-semibold text-violet-700 shadow-lg transition hover:bg-slate-50"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20"
                >
                  Create Account
                </NavLink>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature stats */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-md shadow-slate-100 transition hover:shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Facility Bookings</p>
            <p className="mt-3 text-4xl font-bold text-violet-600 sm:text-5xl">100%</p>
            <p className="mt-2 text-sm text-slate-500">Automated Approvals & Dynamic Slots</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-md shadow-slate-100 transition hover:shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Support Staff</p>
            <p className="mt-3 text-4xl font-bold text-violet-600 sm:text-5xl">24/7</p>
            <p className="mt-2 text-sm text-slate-500">Certified technicians & facility support</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-md shadow-slate-100 transition hover:shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Tenant Satisfaction</p>
            <p className="mt-3 text-4xl font-bold text-violet-600 sm:text-5xl">4.9★</p>
            <p className="mt-2 text-sm text-slate-500">Loved by over 500+ active residents</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Available Services & Amenities</h2>
          <p className="mx-auto max-w-xl text-slate-600">
            Book community venues and request in-house maintenance directly. Choose your date and pick an open slot instantly.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative rounded-[2rem] border border-slate-100 bg-white p-8 shadow-md shadow-slate-50/50 transition-all duration-300 hover:-translate-y-1 hover:border-violet-100 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{service.icon}</span>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  {service.badge}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">{service.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
              <div className="mt-6 flex items-center text-sm font-semibold text-violet-600 transition group-hover:text-violet-700">
                <span>Book now</span>
                <svg className="ml-2 h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Banner */}
      <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/50 sm:p-12 md:p-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Are you an Apartment Resident?</h2>
            <p className="text-slate-600 leading-relaxed">
              Contact your building administrator or log in with your credentials to book slots for the swimming pool, book electrical repairs, check dates, and review approval history on a single dashboard.
            </p>
            <div className="flex gap-4">
              <NavLink
                to="/register"
                className="rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-100 transition hover:bg-violet-700"
              >
                Join Now
              </NavLink>
              <NavLink
                to="/login"
                className="rounded-full bg-slate-100 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Sign In
              </NavLink>
            </div>
          </div>
          <div className="relative rounded-[2rem] bg-gradient-to-br from-violet-100 to-indigo-50 p-8 text-center flex flex-col justify-center items-center border border-violet-100">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-md text-3xl">🔑</div>
            <p className="mt-6 text-lg font-bold text-slate-900">Admin Dashboard Access</p>
            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              System Administrators can log in to manage residential blocks, add apartment flats, review slot capacities, and approve or reject resident booking requests.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;