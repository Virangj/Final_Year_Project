import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { MoreVertical } from "lucide-react";

const DEFAULT_AVATAR = "/default-avatar.png"; // ensure this is in public folder

const ChatComponent = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/message/users");
        console.log(res);        
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch chat users", err);
      }
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (userId) => {
    setActiveUser(userId);
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      console.log(res);      
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
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const activeUserData = users.find((u) => u._id === activeUser);

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-2rem)] border border-neutral-200/20 bg-black rounded-lg">
          {/* Sidebar */}
          <div className="w-96 border-r border-neutral-200/20 flex flex-col">
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
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{user.username}</h3>
                        <span className="text-xs text-gray-400">
                          {user.time}
                        </span>
                      </div>
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
          <div className="flex-1 flex flex-col">
            {activeUserData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-200/20 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={activeUserData.profilePic || DEFAULT_AVATAR}
                      alt="active-profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold">
                        {activeUserData.username}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {activeUserData.role} • Online
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-neutral-800 rounded-full">
                    <MoreVertical className="w-6 h-6" />
                  </button>
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
                            ? user?.profilePic
                            : DEFAULT_AVATAR // Optional: replace with your own profile once available
                        }
                        alt="sender"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div
                        className={`rounded-lg p-4 max-w-xs sm:max-w-md break-words ${
                          msg.fromSelf
                            ? "bg-gray-800 text-white"
                            : "bg-neutral-700 text-white"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span className="text-xs block mt-1 text-gray-400">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
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
