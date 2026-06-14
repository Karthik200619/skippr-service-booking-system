// to reduce the boiler plate code and implemnetation instead of Context API
// I am using the Zustand Store 
import { create } from "zustand";
import axios from 'axios';

axios.defaults.withCredentials = true;

export const useAuth = create((set) => ({
    // define the states
    currentUser: null,
    loading: false,
    isAuthenticated: false,
    error: null,

    clearError: () => {
        set({ error: null });
    },
    // login Object 
    // Login
    login: async (loginObj) => {
        try {

            set({
                loading: true,
                error: null
            });
            // make a call to login route
            const res = await axios.post("/common-api/login",loginObj);
            // if we get vaild res add the user to currentUser of Global store
            set({
                currentUser: res.data.payload.user,
                isAuthenticated: true,
                loading: false,
                error: null
            });

            return true;
            // if err occurs
        } catch (err) {
            // if error occured set the currentUser state and isAuthenticated to null
            set({
                currentUser: null,
                isAuthenticated: false,
                loading: false,
                error:
                    err.response?.data?.message ||
                    "Login failed"
            });

            return false;
        }
    },

    // Register
    // here since we are using form data 
    // 
    register: async (formData) => {
        try {

            set({
                loading: true,
                error: null
            });

            const res = await axios.post("/user-api/register",formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            set({
                loading: false,
                error: null
            });

            return res.data;

        } catch (err) {

            set({
                loading: false,
                error:
                    err.response?.data?.message ||
                    "Registration failed"
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

            await axios.post("/common-api/logout");

            set({
                currentUser: null,
                isAuthenticated: false,
                loading: false,
                error: null
            });

        } catch (err) {

            set({
                currentUser: null,
                isAuthenticated: false,
                loading: false,
                error:
                    err.response?.data?.message ||
                    "Logout failed"
            });
        }
    },

    // Check Auth
    checkAuth: async () => {
        try {

            set({
                loading: true
            });

            const res = await axios.get("/common-api/check-auth");

            set({
                currentUser: res.data.payload.user,
                isAuthenticated: true,
                loading: false,
                error: null
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