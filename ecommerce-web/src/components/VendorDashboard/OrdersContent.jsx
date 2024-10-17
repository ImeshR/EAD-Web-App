import React, { useState, useEffect, useContext } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import OrderDetailsOffcanvas from './OrderDetailsOffcanvas';
import { UserContext } from '../../services/hooks/UserContext';

export default function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/Order/items/vendor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token if needed
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

  // Open the Offcanvas and set selected order
  const handleShowOffcanvas = (order) => {
    setSelectedOrder(order);
    setShowOffcanvas(true);
  };

  // Handle closing the Offcanvas
  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedOrder(null);
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
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Price at Purchase</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.item?.productId || 'N/A'}</td>
                <td>{order.item?.quantity || '0'}</td>
                <td>{order.item?.priceAtPurchase || '0'}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowOffcanvas(order)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <OrderDetailsOffcanvas
        show={showOffcanvas}
        handleClose={handleCloseOffcanvas}
        order={selectedOrder} 
        refreshOrders={fetchOrders}
      />
    </div>
  );
}
