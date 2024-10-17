import React, { useState , useEffect } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import OrderDetailsOffcanvas from './OrderDetailsOffcanvas';

export default function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/Order/items/vendor/692280f2d7e619e901774f25', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token if needed
        },
      });

      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open the Offcanvas and set selected order ID
  const handleShowOffcanvas = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOffcanvas(true);
  };

  // Handle closing the Offcanvas
  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedOrderId(null);
  };

  return (
    <div>
      <h2 className="mt-4">Vendor Orders</h2>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Orders Table */}
      {!loading && !error && (
        <table className="table table-striped">
          <thead className="bg-warning text-dark">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.productId}>
                <td>{order.productId}</td>
                <td>{order.customer}</td>
                <td><span className={`badge bg-${order.statusColor}`}>{order.status}</span></td>
                <td>{order.total}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowOffcanvas(order.productId)}>
                    View Details
                  </Button>
                  {order.status === 'Ready' ? (
                    <Button variant="outline-info" size="sm">Mark as Delivered</Button>
                  ) : (
                    <Button variant="outline-success" size="sm">Mark as Ready</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Offcanvas for Viewing Order Details */}
      <OrderDetailsOffcanvas
        show={showOffcanvas}
        handleClose={handleCloseOffcanvas}
        orderId={selectedOrderId}
      />
    </div>
  );
}
