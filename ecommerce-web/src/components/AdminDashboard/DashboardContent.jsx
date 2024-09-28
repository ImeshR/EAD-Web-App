import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Bell, Package, ShoppingCart, Users } from "react-feather";

const DashboardContent = () => {
  return (
    <div>
      <h2 className="mt-4">Dashboard</h2>
      <Row>
        {[
          {
            title: "Total Users",
            value: "1,234",
            icon: <Users size={24} />,
            color: "primary",
          },
          {
            title: "Total Products",
            value: "5,678",
            icon: <Package size={24} />,
            color: "success",
          },
          {
            title: "Total Orders",
            value: "9,101",
            icon: <ShoppingCart size={24} />,
            color: "info",
          },
          {
            title: "System Alerts",
            value: "3",
            icon: <Bell size={24} />,
            color: "warning",
          },
        ].map((stat, index) => (
          <Col
            md={3}
            key={index}
          >
            <Card className={`mb-4 bg-${stat.color} text-white`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{stat.title}</Card.Title>
                    <Card.Text className="h2">{stat.value}</Card.Text>
                  </div>
                  <div>{stat.icon}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3>Quick Links</h3>
      <Row>
        {[
          "Manage Users",
          "Manage Vendors",
          "Manage Products",
          "Manage Orders",
        ].map((link, index) => (
          <Col
            md={3}
            key={index}
          >
            <Button
              variant="outline-primary"
              className="w-100 mb-3"
            >
              {link}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardContent;
