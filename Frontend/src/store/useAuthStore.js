import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

export const useAuthStore = create(persist((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdateProfile: false,
  isCheckingAuth: true,
  token: false,

  user: (data) => {
    set({ authUser: data });
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", { withCredentials: true });
      set({ token: true });
    } catch (error) {
      console.log("Error in CheckAuth: ", error.message);
      set({ authUser: null });
      set({ token: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup1: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login1: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log(res.data);
      toast.success("Logged in successfully");
      set({ authUser: res.data });

    } catch (error) {
      toast.error("Couldn't connect")
    } finally {
      set({ isLoggingIn: false });
    }
  },
}),
  {
    name: "user-storage",
    storage: createJSONStorage(() => sessionStorage),
  }
));
