import { useEffect } from "react";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../store/authStore";

function RootLaylout() {
  const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "1rem",
            background: "#ffffff",
            color: "#0f172a",
            boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
          },
        }}
      />
    </div>
  );
}

export default RootLaylout;