import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Spinner, Alert } from 'react-bootstrap';
import useProductData from '../../services/hooks/useProductData';
import axios from 'axios';

const OrderDetailsOffcanvas = ({ show, handleClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order data
  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`/api/Order/items/vendor/692280f2d7e619e901774f25`);
      const order = response.data.data.find(order => order.productId === orderId);
      setOrderDetails(order);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch order details.');
      setLoading(false);
    }
  };

  // Fetch product data using custom hook
  const { product, loading: productLoading, error: productError } = useProductData(orderDetails?.productId);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      fetchOrderDetails();
    }
  }, [orderId]);

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" scroll={true}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Order Details</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {orderDetails && !loading && !error && (
          <>
            <h5>Order Information</h5>
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{orderDetails.productId}</td>
                  <td>{orderDetails.customer}</td>
                  <td>{orderDetails.status}</td>
                  <td>{orderDetails.total}</td>
                </tr>
              </tbody>
            </table>

            {productLoading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading Product Data...</span>
                </Spinner>
              </div>
            ) : productError ? (
              <Alert variant="danger">{productError}</Alert>
            ) : product ? (
              <>
                <h5>Product Details</h5>
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Stock Count</th>
                      <th>Average Rating</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>${product.price}</td>
                      <td>{product.stockCount}</td>
                      <td>{product.averageRating}</td>
                      <td><img src={product.images[0]} alt={product.name} className="img-fluid" /></td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : null}
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OrderDetailsOffcanvas;
