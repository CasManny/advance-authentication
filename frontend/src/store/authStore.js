import axios from "axios";
import { create } from "zustand";
const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (email, name, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/sign-up`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.error || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({
        error: error.response.data.error || "Something went wrong",
        isLoading: false,
      });
    }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null })
        try {
            const response = await axios.get(`${API_URL}/check-auth`)
            set({ user: response.data.user, isCheckingAuth: false, isAuthenticated: true})
        } catch (error) {
            set({isCheckingAuth: false, isAuthenticated: false})
        }
  }
}));
