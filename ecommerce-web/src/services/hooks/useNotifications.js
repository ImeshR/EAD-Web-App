import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useNotifications = (userId, notificationTypes) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications based on types
  const fetchNotifications = useCallback(async () => {
    try {
      let notificationsData = [];
      for (let type of notificationTypes) {
        const response = await axios.get(`/api/Notification/type/${type}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        notificationsData = [...notificationsData, ...response.data];
      }

      setNotifications(notificationsData);

      const unreadNotifications = notificationsData.filter(
        (notification) => notification.readStatus === false
      );
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [notificationTypes]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 60000);

      return () => clearInterval(intervalId);
    }
  }, []);

  const clearNotifications = async () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return { notifications, unreadCount, clearNotifications };
};

export default useNotifications;
