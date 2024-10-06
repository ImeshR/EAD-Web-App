import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Nav,
  Card,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import DashboardContent from "../../components/VendorDashboard/DashboardContent";
import ProductsContent from "../../components/VendorDashboard/ProductsContent";
import InventoryContent from "../../components/VendorDashboard/InventoryContent";
import OrdersContent from "../../components/VendorDashboard/OrdersContent";
import FeedbackContent from "../../components/VendorDashboard/FeedbackContent";
import { UserContext } from "../../services/hooks/UserContext";
import NavBar from "../../components/Navbar/Navbar";

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useContext(UserContext);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "products":
        return <ProductsContent />;
      case "inventory":
        return <InventoryContent />;
      case "orders":
        return <OrdersContent />;
      case "feedback":
        return <FeedbackContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <NavBar userRole={'vendor'} />
      <Container fluid>
        <Row>
          <Col
            md={3}
            lg={2}
            className="d-md-block sidebar"
          >
            <Nav className="flex-column bg-secondary text-white p-3 rounded">
              <Nav.Link
                onClick={() => setActiveTab("dashboard")}
                active={activeTab === "dashboard"}
                className="text-white"
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("products")}
                active={activeTab === "products"}
                className="text-white"
              >
                My Products
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("inventory")}
                active={activeTab === "inventory"}
                className="text-white"
              >
                Manage Inventory
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("orders")}
                active={activeTab === "orders"}
                className="text-white"
              >
                Vendor Orders
              </Nav.Link>
              <Nav.Link
                onClick={() => setActiveTab("feedback")}
                active={activeTab === "feedback"}
                className="text-white"
              >
                Vendor Feedback
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
