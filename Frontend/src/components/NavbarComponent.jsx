import React from "react";
import {
  Home,
  Compass,
  User,
  MessageCircle,
  Bell,
  Settings,
<<<<<<< HEAD:Frontend/src/components/NavbarComponent.jsx
  LogOut,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout"); // Call logout API
      sessionStorage.clear(); // Clear stored data
      toast.success("Logged out successfully.");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

=======
  Plus,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore((state) => state);
>>>>>>> 863d417fd35179da1196c9a62701ea8df0c4e9d2:Frontend/src/components/Navbar.jsx
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="sticky top-0 h-screen w-72 bg-black border-r border-neutral-200/20 hidden lg:block">
        <div className="flex flex-col h-full px-2">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200/20">
            <h1 className="text-2xl font-bold text-white">Creative Threads</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 space-y-1">
            <a
              href="/"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all active"
            >
              <Home size={22} />
              <span>Feed</span>
            </a>
            <a
              href="/Explore"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Compass size={22} />
              <span>Explore</span>
            </a>
            <a
<<<<<<< HEAD:Frontend/src/components/NavbarComponent.jsx
              href="/Profile"
=======
              href="/profile"
>>>>>>> 863d417fd35179da1196c9a62701ea8df0c4e9d2:Frontend/src/components/Navbar.jsx
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <User size={22} />
              <span>Profile</span>
            </a>
            <a
              href="/Chat"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <MessageCircle size={22} />
              <span>Chat</span>
            </a>
            <a
              href="/Notifications"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Bell size={22} />
              <span>Notifications</span>
            </a>
            <a
<<<<<<< HEAD:Frontend/src/components/NavbarComponent.jsx
              href="/Settings"
=======
              href="/createpost"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Plus size={22} />
              <span>Create Post</span>
            </a>
            <a
              href="#settings"
>>>>>>> 863d417fd35179da1196c9a62701ea8df0c4e9d2:Frontend/src/components/Navbar.jsx
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Settings size={22} />
              <span>Settings</span>
            </a>
          </div>

<<<<<<< HEAD:Frontend/src/components/NavbarComponent.jsx
          {/* Logout Button */}
          <div className="p-6 border-t border-neutral-200/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-white text-xl rounded-2xl px-6 py-3 hover:bg-[#1A1A1A] transition-all"
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>
=======
          {/* User Profile Section */}
          <div className="py-6 border-t border-neutral-200/20 ">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{authUser.username}</p>
                <p className="text-xs text-white">{authUser.email}</p>
              </div>
            </div>
>>>>>>> 863d417fd35179da1196c9a62701ea8df0c4e9d2:Frontend/src/components/Navbar.jsx
          </div>
        </div>
      </nav>

      {/* 📱 Bottom navbar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-200/20 flex justify-around items-center h-16 px-4">
        <a href="/">
          <Home className="text-white w-6 h-6" />
        </a>
        <a href="/Explore">
          <Compass className="text-white w-6 h-6" />
        </a>
<<<<<<< HEAD:Frontend/src/components/NavbarComponent.jsx
        <a href="/Profile">
=======
        <a href="/profile">
>>>>>>> 863d417fd35179da1196c9a62701ea8df0c4e9d2:Frontend/src/components/Navbar.jsx
          <User className="text-white w-6 h-6" />
        </a>
        <a href="/Chat">
          <MessageCircle className="text-white w-6 h-6" />
        </a>
        <a href="/Settings">
          <Settings className="text-white w-6 h-6" />
        </a>
      </div>
    </>
  );
};

export default Navbar;
