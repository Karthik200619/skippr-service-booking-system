import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashBaord from "./components/UserDashBaord";
import AdminDashBoard from "./components/AdminDashBoard";
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