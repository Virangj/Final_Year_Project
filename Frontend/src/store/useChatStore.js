import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessages: async (messageData) => {
    const { authUser } = useAuthStore.getState();
    const { selectedUser, messages, addNewMessageToChat } = get();
  
    const newMessage = {
      _id: new Date().getTime(), // Temporary ID
      senderId: authUser._id,
      text: messageData.text || "",
      image: messageData.image || "",
      createdAt: new Date().toISOString(),
    };
  
    // 1. Optimistically add to UI
    addNewMessageToChat(newMessage);
  
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      
      const messagePayload = {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        message: {
          text: messageData.text || "",
          image: messageData.image || "",
        },
        createdAt: new Date().toISOString(),
      };
      
      socket.emit("sendMessage", messagePayload);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  },
  
  setSelectedUser: (selectedUser) => {
    set({ selectedUser: selectedUser });
  },

  addNewMessageToChat: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
}));
