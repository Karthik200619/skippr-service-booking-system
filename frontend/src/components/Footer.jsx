import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import axios from "axios";
import { toast } from "react-hot-toast";

function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/user-api/help-queries", { subject, message });
      toast.success("Help query submitted successfully!");
      setSubject("");
      setMessage("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit help query");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-lg font-bold text-white">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-650 text-white font-extrabold text-sm shadow-md shadow-violet-900/35">
                S
              </span>
              <span>Skippr</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Modernizing residential service bookings. Book clubhouses, gyms, pools, or request plumbing and electrical support with instant admin approval tracking.
            </p>
          </div>

          {/* Column 2: Contact details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Contact Us</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-violet-500">📧</span>
                <a href="mailto:support@skippr.com" className="hover:text-white transition">support@skippr.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-500">📞</span>
                <a href="tel:+1555SKIPPR" className="hover:text-white transition">+1-555-SKIPPR (754-777)</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-0.5">📍</span>
                <span>Suite 404, Skippr Heights, Bangalore, KA, India</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Help Query */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Need Assistance?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Encountered a bug or have a suggestion? Send a help query directly to our building administrators.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-950/50 transition hover:bg-violet-500 active:scale-95"
            >
              ✉️ Contact Admin
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Skippr. All rights reserved.</p>
          <p>Secure dashboard, slot booking, and responsive resident experience.</p>
        </div>
      </div>

      {/* Help Query Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl transition-all scale-100">
            {isAuthenticated ? (
              // Logged In: Form
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Submit a Help Query</h3>
                  <p className="mt-1.5 text-xs text-slate-500">Explain your concern, and the administrator will look into it.</p>
                </div>

                <form onSubmit={handleSubmitQuery} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Booking slot issue, Profile update query"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Message Details</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Describe your issue or feedback in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSubject("");
                        setMessage("");
                      }}
                      className="w-1/2 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-550 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-1/2 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-100 hover:bg-violet-700 disabled:opacity-50 transition"
                    >
                      {submitting ? "Sending..." : "Send Query"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Not Logged In: Prompt login
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
                  🔒
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Authentication Required</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    You need to be logged in to submit a help query to the building administrators.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      navigate("/login");
                    }}
                    className="w-1/2 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-100 hover:bg-violet-700 transition"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;