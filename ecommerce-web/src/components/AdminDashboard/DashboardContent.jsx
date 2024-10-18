import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Package, ShoppingCart, Users, Briefcase } from "react-feather";
import useVendors from "../../services/hooks/useVendors";

const DashboardContent = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const { count: vendorCount } = useVendors();

  useEffect(() => {
    // Fetch users
    axios
      .get("api/User", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const users = response.data.data;
        setUserCount(users.length);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // Fetch products
    axios
      .get("api/Product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const products = response.data.data;
        setProductCount(products.length);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });

    // Fetch orders
    axios
      .get("api/Order", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const orders = response.data.data;
        setOrderCount(orders.length);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });
  }, []);

  return (
    <div>
      <h2 className="mt-4">Dashboard</h2>
      <Row>
        {[{
            title: "Total Users",
            value: userCount,
            icon: <Users size={24} />,
            color: "primary",
          }, // Use dynamic user count here
          {
            title: "Total Products",
            value: productCount,
            icon: <Package size={24} />,
            color: "success",
          }, // Use dynamic product count
          {
            title: "Total Orders",
            value: orderCount,
            icon: <ShoppingCart size={24} />,
            color: "info",
          }, // Use dynamic order count
          {
            title: "Total Vendors",
            value: vendorCount, // Use vendor count from useVendors hook
            icon: <Briefcase size={24} />,
            color: "warning",
          },
        ].map((stat, index) => (
          <Col
            md={4}
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
          "View Payments",
          "View Comments",
        ].map((link, index) => (
          <Col
            md={4}
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
