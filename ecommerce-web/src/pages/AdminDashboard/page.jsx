import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  Search,
  Bell,
  Package,
  ShoppingCart,
  BarChart2,
  Users,
  Briefcase,
} from "react-feather";
import DashboardContent from "../../components/AdminDashboard/DashboardContent";
import UserManagementContent from "../../components/AdminDashboard/UserManagementContent";
import VendorManagementContent from "../../components/AdminDashboard/VendorManagementContent";
import ProductManagementContent from "../../components/AdminDashboard/ProductManagementContent";
import OrderManagementContent from "../../components/AdminDashboard/OrderManagementContent";
import InventoryManagementContent from "../../components/AdminDashboard/InventoryManagementContent";
import NavBar from "../../components/Navbar/Navbar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UserManagementContent />;
      case "vendors":
        return <VendorManagementContent />;
      case "products":
        return <ProductManagementContent />;
      case "orders":
        return <OrderManagementContent />;
      case "inventory":
        return <InventoryManagementContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <NavBar />
      <Container fluid>
        <Row>
          <Col
            md={3}
            lg={2}
            className="d-md-block sidebar"
          >
            <Nav className="flex-column bg-dark text-white p-3 rounded">
              <Nav.Link
                onClick={() => setActiveTab("dashboard")}
                active={activeTab === "dashboard"}
                className="text-white"
              >
                <BarChart2
                  size={18}
                  className="me-2"
                />
                Dashboard
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("users")}
                active={activeTab === "users"}
                className="text-white"
              >
                <Users
                  size={18}
                  className="me-2"
                />
                Manage Users
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("vendors")}
                active={activeTab === "vendors"}
                className="text-white"
              >
                <Briefcase
                  size={18}
                  className="me-2"
                />
                Manage Vendors
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("products")}
                active={activeTab === "products"}
                className="text-white"
              >
                <Package
                  size={18}
                  className="me-2"
                />
                Manage Products
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("orders")}
                active={activeTab === "orders"}
                className="text-white"
              >
                <ShoppingCart
                  size={18}
                  className="me-2"
                />
                Manage Orders
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("inventory")}
                active={activeTab === "inventory"}
                className="text-white"
              >
                <Package
                  size={18}
                  className="me-2"
                />
                Manage Inventory
              </Nav.Link>
            </Nav>
          </Col>
          <Col
            md={9}
            lg={10}
            className="ms-sm-auto px-md-4"
          >
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
