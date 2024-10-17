import React, { useContext } from 'react';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Search, Bell } from "react-feather";
import { Badge } from 'antd';  // Import Badge from antd
import { UserContext } from '../../services/hooks/UserContext'; 

const NavBar = ({ profileImage }) => {  // notificationCount as prop
  const { user, logout } = useContext(UserContext);

  const getNavBarStyle = () => {
    switch (user?.role) {
      case "vendor":
        return { bg: "primary", variant: "dark", name: "Vendor Dashboard" };
      case "csr":
        return { bg: "", variant: "dark", customStyle: { backgroundColor: "#6a0dad" }, name: "CSR Dashboard" };
      default:
        return { bg: "dark", variant: "dark", name: "Admin Dashboard" };
    }
  };

  const notificationCount = 5;

  const { bg, variant, customStyle, name } = getNavBarStyle();

  return (
    <Navbar bg={bg} variant={variant} style={customStyle} className="mb-3">
      <Container fluid>
        <Navbar.Brand href="#home">{name}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link>
              <Badge count={notificationCount} overflowCount={99}>
                <Bell size={18} color="white"/>
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
            menuVariant={variant === "dark" ? "dark" : "light"} // Match the dropdown theme to the navbar variant
            className="dropdown-menu-end"
          >
            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item> {/* Call logout on click */}
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
