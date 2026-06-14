import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashBaord from "./components/UserDashBaord";
import AdminDashBoard from "./components/AdminDashBoard";
import AdminOverview from "./components/admin/AdminOverview";
import AdminBlocks from "./components/admin/AdminBlocks";
import AdminFlats from "./components/admin/AdminFlats";
import AdminBookings from "./components/admin/AdminBookings";
import AdminUsers from "./components/admin/AdminUsers";
import AdminHelpQueries from "./components/admin/AdminHelpQueries";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import RootLaylout from "./components/RootLaylout";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./components/VerifyEmail";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLaylout />,
    children: [
      { 
        path: "/", 
        element: <Home /> 
      },
      { 
        path: "/login", 
        element: <Login /> 
      },
      { 
        path: "/register", 
        element: <Register /> 
      },
      { 
        path: "/verify-email", 
        element: <VerifyEmail /> 
      },
      {
        path: "/customer",
        element: (
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <UserDashBaord />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashBoard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminOverview /> },
          { path: "blocks", element: <AdminBlocks /> },
          { path: "flats", element: <AdminFlats /> },
          { path: "bookings", element: <AdminBookings /> },
          { path: "users", element: <AdminUsers /> },
          { path: "queries", element: <AdminHelpQueries /> },
        ]
      },
      { path: "/unauthorized", element: <Unauthorized /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;