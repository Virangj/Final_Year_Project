import React, { useEffect, useState } from "react";
import { Bell, MessageCircle, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // Uncomment when using real API

const mockNotifications = [
  {
    _id: "1",
    type: "like",
    message: "Anna liked your artwork.",
    timeAgo: "2h ago",
  },
  {
    _id: "2",
    type: "comment",
    message: "James commented: Amazing work!",
    timeAgo: "4h ago",
  },
  {
    _id: "3",
    type: "follow",
    message: "Maya started following you.",
    timeAgo: "1d ago",
  },
  {
    _id: "4",
    type: "like",
    message: "Leo liked your post.",
    timeAgo: "2d ago",
  },
  {
    _id: "5",
    type: "comment",
    message: "Sophia commented: 🔥🔥🔥",
    timeAgo: "3d ago",
  },
];

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Uncomment this for real API
    /*
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    */

    // Mock for testing
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="w-[360px] h-full px-4 py-6 bg-black text-white border-l border-neutral-200/20 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell size={20} />
        Notifications
      </h2>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <ul className="space-y-4">
            {notifications.slice(0, 5).map((note) => (
              <li key={note._id} className="flex items-start gap-3">
                <div>
                  {note.type === "like" && <Heart className="w-5 h-5 text-pink-500" />}
                  {note.type === "comment" && <MessageCircle className="w-5 h-5 text-blue-400" />}
                  {note.type === "follow" && <Bell className="w-5 h-5 text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{note.message}</p>
                  <p className="text-xs text-gray-400">{note.timeAgo}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/notifications")}
            className="mt-6 text-sm text-blue-400 hover:underline"
          >
            See all notifications →
          </button>
        </>
      )}
    </div>
  );
};

export default Notification;
