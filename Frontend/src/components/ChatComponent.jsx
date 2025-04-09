import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { MoreVertical } from "lucide-react";

const DEFAULT_AVATAR = "/default-avatar.png"; // place this in public folder

const ChatComponent = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false); // for mobile responsiveness

  useEffect(() => {
    // Get current user from sessionStorage
    const stored = sessionStorage.getItem("user-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed?.state?.authUser);
    }

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/message/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch chat users", err);
      }
    };

    fetchUsers();
  }, []);

  const fetchMessages = async (userId) => {
    setActiveUser(userId);
    setShowChat(true); // open chat on mobile

    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMsg = {
      fromSelf: true,
      text: inputMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    try {
      await axiosInstance.post(`/message/send/${activeUser}`, {
        text: inputMessage,
      });

      // Move active user to top
      setUsers((prev) => {
        const updated = prev.filter((u) => u._id !== activeUser);
        const current = prev.find((u) => u._id === activeUser);
        return [current, ...updated];
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const activeUserData = users.find((u) => u._id === activeUser);

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen border border-neutral-200/20 bg-black rounded-lg">
          {/* Sidebar */}
          <div
            className={`w-96 border-r border-neutral-200/20 flex flex-col md:block ${
              showChat ? "hidden md:flex" : "block"
            }`}
          >
            <div className="p-4 border-b border-neutral-200/20">
              <input
                type="search"
                placeholder="Search conversations..."
                className="w-full px-4 py-2 pl-10 bg-black border border-neutral-200/20 rounded-lg text-white placeholder-gray-400"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => fetchMessages(user._id)}
                  className={`p-4 border-b border-neutral-200/20 cursor-pointer hover:bg-neutral-800 ${
                    activeUser === user._id ? "bg-neutral-900" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src={user.profilePic || DEFAULT_AVATAR}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold">{user.username}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`flex-1 flex flex-col ${!showChat && "hidden md:flex"}`}>
            {activeUserData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-200/20 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowChat(false)}
                      className="md:hidden text-gray-400 mr-4"
                    >
                      ←
                    </button>
                    <img
                      src={activeUserData.profilePic || DEFAULT_AVATAR}
                      alt="active-profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold">{activeUserData.username}</h3>
                      <p className="text-sm text-gray-400">
                        {activeUserData.role} • Online
                      </p>
                    </div>
                  </div>
                  <MoreVertical className="w-6 h-6" />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-end gap-2 ${
                        msg.fromSelf
                          ? "justify-end flex-row-reverse"
                          : "justify-start"
                      }`}
                    >
                      <img
                        src={
                          msg.fromSelf
                            ? currentUser?.profilePic || DEFAULT_AVATAR
                            : activeUserData.profilePic || DEFAULT_AVATAR
                        }
                        alt="sender"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div
                        className={`rounded-lg px-4 py-2 break-words relative max-w-[75%] ${
                          msg.fromSelf
                            ? "bg-gray-800 text-white self-end"
                            : "bg-neutral-700 text-white self-start"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span className="text-xs block mt-1 text-gray-400 text-right">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-neutral-200/20">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-black text-white border border-neutral-200/20 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
