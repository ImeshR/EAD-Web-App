import React, { useContext } from 'react';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Bell } from "react-feather";
import { Badge, notification, Button } from 'antd';  // Import AntD components
import { UserContext } from '../../services/hooks/UserContext'; 
import useNotifications from '../../services/hooks/useNotifications';  // Import the custom hook

const NavBar = ({ profileImage }) => {
  const { user, logout } = useContext(UserContext);
  const { notifications, unreadCount, clearNotifications } = useNotifications(user?.id);  // Get notifications, unread count, and clear function

  const getNavBarStyle = () => {
    switch (user?.role) {
      case "Vendor":
        return { bg: "primary", variant: "dark", name: "Vendor Dashboard" };
      case "CSR":
        return { bg: "", variant: "dark", customStyle: { backgroundColor: "#6a0dad" }, name: "CSR Dashboard" };
      default:
        return { bg: "dark", variant: "dark", name: "Admin Dashboard" };
    }
  };

  const { bg, variant, customStyle, name } = getNavBarStyle();

  // Function to open a notification stack
  const openNotificationStack = () => {
    notifications.forEach(notificationItem => {
      notification.open({
        message: notificationItem.message,
        description: notificationItem.type,
        placement: 'bottomRight',
        duration: 3,
      });
    });
  };

  // Handle clicking on notification icon to show the stack
  const handleNotificationClick = () => {
    if (notifications.length > 0) {
      openNotificationStack();
    }
  };

  // Clear all notifications function
  const handleClearAllNotifications = () => {
    clearNotifications();  // Assuming clearNotifications will reset the notification state or make an API call
    notification.info({
      message: 'Notifications Cleared',
      description: 'All your notifications have been cleared.',
      placement: 'topRight',
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
                <Bell size={20} color='white'/>
              </Badge>
            </Nav.Link>
          </Nav>
          <NavDropdown
            title={
              <img
                src={profileImage || "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
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
            <NavDropdown.Item onClick={handleClearAllNotifications}>Clear All</NavDropdown.Item> {/* Clear All option */}
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
