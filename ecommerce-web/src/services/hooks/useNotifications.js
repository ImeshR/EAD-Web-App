import { useState, useEffect } from "react";
import axios from "axios";

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/Notification`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data.data;

      setNotifications(data);
      const unreadNotifications = data.filter(
        (notification) => !notification.readStatus
      );
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();

      const intervalId = setInterval(fetchNotifications, 30000);

      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return { notifications, unreadCount, clearNotifications };
};

export default useNotifications;
