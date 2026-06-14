import { create } from "zustand";
import axiosInstance from "../api/axios.js";

export const useAuth = create((set) => ({

    currentUser: null,
    loading: false,
    isAuthenticated: false,
    error: null,

    // Login
    login: async (loginObj) => {
        try {

            set({
                loading: true,
                error: null
            });

            const res = await axiosInstance.post(
                "/common-api/login",
                loginObj
            );

            set({
                loading: false,
                isAuthenticated: true,
                currentUser: res.data.payload.user
            });

            return true;

        } catch (err) {

            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: err.response?.data?.message || "Login failed"
            });

            return false;
        }
    },

    // Register
    register: async (formData) => {
        try {

            set({
                loading: true,
                error: null
            });

            const res = await axiosInstance.post(
                "/user-api/register",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            set({
                loading: false
            });

            return res.data;

        } catch (err) {

            set({
                loading: false,
                error: err.response?.data?.message || "Registration failed"
            });

            return null;
        }
    },

    // Logout
    logout: async () => {
        try {

            set({
                loading: true,
                error: null
            });

            await axiosInstance.post(
                "/common-api/logout"
            );

            set({
                currentUser: null,
                isAuthenticated: false,
                loading: false
            });

        } catch (err) {

            set({
                currentUser: null,
                isAuthenticated: false,
                loading: false,
                error: err.response?.data?.message || "Logout failed"
            });
        }
    },

    // Restore Login
    checkAuth: async () => {
        try {

            set({ loading: true });

            const res = await axiosInstance.get(
                "/common-api/check-auth"
            );

            set({
                currentUser: res.data.payload.user,
                isAuthenticated: true,
                loading: false
            });

        } catch (err) {

            set({
                currentUser: null,
                isAuthenticated: false,
                loading: false
            });
        }
    }

}));