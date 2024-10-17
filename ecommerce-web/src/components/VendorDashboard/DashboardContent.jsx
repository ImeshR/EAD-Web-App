import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../services/hooks/UserContext";

export default function DashboardContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const { user, logout } = useContext(UserContext);

  const metrics = [
    { title: "Total Sales", value: `$${totalEarnings.toFixed(2)} 💵`, color: "warning" },
    { title: "Number of Orders", value: `${numberOfOrders} 📦`, color: "info" },
    { title: "Vendor Rating", value: `${rating}/5 ⭐`, color: "danger" },
  ];

  // Fetch product data
  const fetchProductData = async () => {
    try {
      const response = await axios.get(`/api/Product/vendor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const fetchedProducts = response.data.data;
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setLoading(false);
    }
  };

  // Fetch reviews data
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`api/Review/vendor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const fetchedReviews = response.data.data;
      setReviews(fetchedReviews);

      const totalRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / fetchedReviews.length;
      setRating(Math.min(averageRating, 5) || 0);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    }
  };

  // Fetch order items and calculate total earnings and number of orders
  const fetchOrderItems = async () => {
    try {
      const response = await axios.get(`/api/Order/items/vendor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const orderItems = response.data.data;
      
      // Calculate earnings
      const earnings = orderItems.reduce(
        (acc, item) => acc + item.item.priceAtPurchase * item.item.quantity,
        0
      );
      setTotalEarnings(earnings);

      // Count number of orders
      setNumberOfOrders(orderItems.length); // Set the number of orders
    } catch (error) {
      console.error("Error fetching order items data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
    fetchOrderItems();
  }, []);

  const lowStockCount = products.filter((product) => product.stockCount <= 100).length;
  const activeProductCount = products.filter((product) => product.active).length;

  return (
    <div>
      <h2 className="mt-4">Vendor Dashboard</h2>
      <Row>
        {metrics.map((metric) => (
          <Col md={4} key={metric.title}>
            <Card className={`mb-4 bg-${metric.color} text-white`}>
              <Card.Body>
                <Card.Title>{metric.title}</Card.Title>
                <Card.Text className="h2">{metric.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Dynamic Metrics */}
        <Col md={4}>
          <Card className="mb-4 bg-success text-white">
            <Card.Body>
              <Card.Title>Active Products</Card.Title>
              <Card.Text className="h2">{activeProductCount} ⚡</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 bg-primary text-white">
            <Card.Body>
              <Card.Title>Low-Stock Alerts</Card.Title>
              <Card.Text className="h2">{lowStockCount} ⚠️</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
}
