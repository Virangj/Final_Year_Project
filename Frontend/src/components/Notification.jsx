import React, { useEffect, useState } from "react";
// import axios from 'axios'; // Uncomment for API
import { MoreVertical } from "lucide-react";
import { socket } from "../lib/socket";
import { showNotification } from "../lib/notification";

const Notification = () => {
  const [notifications, setNotifications] = useState({});

  // Static fallback data
  const staticData = [
    {
      id: "1",
      sender: { username: "Sarah Miller", profilePic: "/images/sarah.jpg" },
      message: 'liked your artwork "Digital Dreams"',
      timeAgo: "2 hours ago",
      group: "Today",
    },
    {
      id: "2",
      sender: { username: "John Doe", profilePic: "/images/john.jpg" },
      message: "started following you",
      timeAgo: "5 hours ago",
      group: "Today",
    },
    {
      id: "3",
      sender: { username: "Emma Wilson", profilePic: "/images/emma.jpg" },
      message:
        'commented on your post: "This is absolutely stunning! Love the details."',
      timeAgo: "2 days ago",
      group: "This Week",
    },
    {
      id: "4",
      sender: {
        username: "Creative Threads",
        profilePic: "/images/creative.jpg",
      },
      message: 'featured your artwork in "Weekly Highlights"',
      timeAgo: "4 days ago",
      group: "This Week",
    },
    {
      id: "5",
      sender: { username: "Alex Chen", profilePic: "/images/alex.jpg" },
      message: "shared your artwork",
      timeAgo: "1 week ago",
      group: "Earlier",
    },
  ];

  useEffect(() => {
    // Using static data for now
    const grouped = staticData.reduce((acc, notif) => {
      const group = notif.group || "Other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(notif);
      return acc;
    }, {});
    setNotifications(grouped);

    // Future API integration
    /*
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications'); // Replace with your endpoint
        const grouped = res.data.reduce((acc, notif) => {
          const group = notif.group || "Other";
          if (!acc[group]) acc[group] = [];
          acc[group].push(notif);
          return acc;
        }, {});
        setNotifications(grouped);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchNotifications();
    */
  }, []);
  useEffect(() => {
    socket.on("receiveNotification", (notification) => {
      console.log("New notification:", notification);
      showNotification(notification); // your custom logic
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  const NotificationCard = ({ sender, message, timeAgo }) => (
    <div className="p-4 hover:bg-neutral-800 border-l-4 border-indigo-500">
      <div className="flex items-start">
        <img
          src={sender.profilePic || "/fallback.jpg"}
          alt={sender.username}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="ml-4 flex-1">
          <p className="text-sm text-white">
            <span className="font-semibold text-indigo-400">
              {sender.username}
            </span>{" "}
            {message}
          </p>
          <p className="text-xs text-neutral-400 mt-1">{timeAgo}</p>
        </div>
        <button className="p-2 hover:bg-neutral-700 rounded-full text-white">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {Object.keys(notifications).map((group) => (
        <div
          key={group}
          className="bg-neutral-900 border border-neutral-700 rounded-lg"
        >
          <div className="p-4 border-b border-neutral-800">
            <h3 className="font-semibold text-neutral-400">{group}</h3>
          </div>
          {notifications[group].map((notif) => (
            <NotificationCard key={notif.id} {...notif} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Notification;
