import React from "react";
import {
  Home,
  Compass,
  User,
  MessageCircle,
  Bell,
  Settings,
  Plus,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore((state) => state);
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="sticky top-0 h-screen w-64 bg-black border-r border-neutral-200/20 hidden lg:block">
        <div className="flex flex-col h-full px-2">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200/20">
            <h1 className="text-2xl font-bold text-white">Creative Threads</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 space-y-1">
            <a
              href="/Feed"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all active"
            >
              <Home size={22} />
              <span>Feed</span>
            </a>
            <a
              href="#explore"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Compass size={22} />
              <span>Explore</span>
            </a>
            <a
              href="/profile"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <User size={22} />
              <span>Profile</span>
            </a>
            <a
              href="#chat"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <MessageCircle size={22} />
              <span>Chat</span>
            </a>
            <a
              href="#notifications"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Bell size={22} />
              <span>Notifications</span>
            </a>
            <a
              href="/createpost"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Plus size={22} />
              <span>Create Post</span>
            </a>
            <a
              href="#settings"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Settings size={22} />
              <span>Settings</span>
            </a>
          </div>

          {/* User Profile Section */}
          <div className="py-6 border-t border-neutral-200/20 ">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{authUser.username}</p>
                <p className="text-xs text-white">{authUser.email}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 Bottom navbar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-200/20 flex justify-around items-center h-16 px-4">
        <a href="/Feed">
          <Home className="text-white w-6 h-6" />
        </a>
        <a href="#explore">
          <Compass className="text-white w-6 h-6" />
        </a>
        <a href="/profile">
          <User className="text-white w-6 h-6" />
        </a>
        <a href="#chat">
          <MessageCircle className="text-white w-6 h-6" />
        </a>
        <a href="#settings">
          <Settings className="text-white w-6 h-6" />
        </a>
      </div>
    </>
  );
};

export default Navbar;
