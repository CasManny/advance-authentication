import axios from "axios";
import { create } from "zustand";
const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: false,
  message: null,
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
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      console.log(response);
      set({
        user: response.data.user,
        isCheckingAuth: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/sign-in`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        isLoading: false,
        user: response.data.user,
      });
    } catch (error) {
      console.log(error);
      set({ isLoading: false, error: error.response.data.error });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/logout`);
      set({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ error: "Error logging out", isLoading: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
