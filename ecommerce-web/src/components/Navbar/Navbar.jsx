import React, { useContext, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Bell } from "react-feather";
import { Badge, notification , Button } from "antd";
import { UserContext } from "../../services/hooks/UserContext";
import useNotifications from "../../services/hooks/useNotifications";
import axios from "axios";

const NavBar = ({ profileImage }) => {
  const { user, logout } = useContext(UserContext);

  const getNotificationTypes = (role) => {
    switch (role) {
      case "Vendor":
        return ["LowStockAlert", "Order"];
      case "CSR":
        return ["OrderDeletion", "NewUserRegistration"];
      default:
        return ["LowStockAlert", "Order", "OrderDeletion", "NewUserRegistration"];
    }
  };

  const notificationTypes = getNotificationTypes(user?.role);
  const { notifications, unreadCount, clearNotifications, removeNotificationFromState } = useNotifications(
    user?.id,
    notificationTypes
  );

  useEffect(() => {
    console.log("Unread Count:", unreadCount);
  }, [unreadCount]);

  const getNavBarStyle = () => {
    switch (user?.role) {
      case "Vendor":
        return { bg: "primary", variant: "dark", name: "Vendor Dashboard" };
      case "CSR":
        return {
          bg: "",
          variant: "dark",
          customStyle: { backgroundColor: "#6a0dad" },
          name: "CSR Dashboard",
        };
      default:
        return { bg: "dark", variant: "dark", name: "Admin Dashboard" };
    }
  };

  const { bg, variant, customStyle, name } = getNavBarStyle();

  const openNotificationStack = () => {
    notifications.forEach((notificationItem) => {
      notification.open({
        message: notificationItem.message,
        description: (
          <div>
            {notificationItem.type}
            <Button
              size="small"
              onClick={() => handleDeleteNotification(notificationItem.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Close
            </Button>
          </div>
        ),
        placement: "bottomRight",
        duration: 3,
      });
    });
  };

  const handleDeleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`api/Notification/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      removeNotificationFromState(id);

      notification.success({
        message: "Notification Deleted",
        description: `Notification with ID: ${id} has been deleted.`,
        placement: "topRight",
        duration: 3,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      notification.success({
        message: "Notification Deleted",
        description: `Notification with ID: ${id} has been deleted.`,
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const handleNotificationClick = () => {
    if (notifications.length > 0) {
      openNotificationStack();
    }
  };

  const handleClearAllNotifications = () => {
    clearNotifications();
    notification.info({
      message: "Notifications Cleared",
      description: "All your notifications have been cleared.",
      placement: "topRight",
      duration: 3,
    });
  };

  return (
    <Navbar bg={bg} variant={variant} style={customStyle} className="mb-3">
      <Container fluid>
        <Navbar.Brand href="#home">{name}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link onClick={handleNotificationClick}>
              <Badge count={unreadCount} overflowCount={99}>
                <Bell size={20} color="white" />
              </Badge>
            </Nav.Link>
          </Nav>
          <NavDropdown
            title={
              <img
                src={
                  profileImage ||
                  "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                }
                alt="User"
                className="rounded-circle"
                width="50"
                height="50"
              />
            }
            id="basic-nav-dropdown"
            align="end"
            menuVariant={variant === "dark" ? "dark" : "light"}
            className="dropdown-menu-end"
          >
            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            <NavDropdown.Item onClick={handleClearAllNotifications}>
              Clear All
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
