import React, { useState, useEffect , useContext } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../../services/hooks/UserContext';

export default function DashboardContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0); 
  const { user, logout } = useContext(UserContext);

  const metrics = [
    { title: 'Total Sales', value: '$10,245', color: 'primary' },
    { title: 'Number of Orders', value: '85', color: 'info' },
    { title: 'Vendor Rating', value: `${rating}/5 ⭐`, color: 'danger' }
  ];

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`/api/Product/vendor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      const fetchedProducts = response.data.data;
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`api/Review/vendor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      const fetchedReviews = response.data.data;
      setReviews(fetchedReviews);

      const totalRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / fetchedReviews.length;

      setRating(averageRating || 0);

    } catch (error) {
      console.error("Error fetching reviews data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, []);

  const lowStockCount = products.filter(product => product.stockCount <= 100).length;
  const activeProductCount = products.filter(product => product.active).length;

  return (
    <div>
      <h2 className="mt-4">Vendor Dashboard</h2>
      <Row>
        {metrics.map(metric => (
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
              <Card.Text className="h2">{activeProductCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 bg-warning text-white">
            <Card.Body>
              <Card.Title>Low-Stock Alerts</Card.Title>
              <Card.Text className="h2">{lowStockCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Loading Spinner while fetching data */}
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
