import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Search, Bell } from "react-feather";

const NavBar = ({ userRole, profileImage }) => {
  // Determine navbar theme and style based on the user role
  const getNavBarStyle = () => {
    switch (userRole) {
      case "vendor":
        return { bg: "primary", variant: "light" };
      case "csr":
        return { bg: "", variant: "light", customStyle: { backgroundColor: "#6a0dad" } };
      default:
        return { bg: "dark", variant: "dark" };
    }
  };

  const { bg, variant, customStyle } = getNavBarStyle();

  return (
    <Navbar
      bg={bg}
      variant={variant}
      style={customStyle}
      className="mb-3"
    >
      <Container fluid>
        <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link href="#search">
              <Search size={18} />
            </Nav.Link>
            <Nav.Link href="#notifications">
              <Bell size={18} />
            </Nav.Link>
          </Nav>
          <NavDropdown
            title={
              <img
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
            <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
