import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form, Modal } from "react-bootstrap";

const OrderManagementContent = () => {
  const [orders, setOrders] = useState([
    {
      id: "12345-abcde",
      customerId: "67890-fghij",
      totalAmount: "$129.99",
      status: "Processing",
      createdAt: "2023-05-01",
      details: {
        items: [
          { name: "Smartphone X", quantity: 1, price: "$599.99" },
          { name: "Accessory Y", quantity: 2, price: "$19.99" },
        ],
        shippingAddress: "123 Main St, City, Country",
        paymentMethod: "Credit Card",
      },
    },
    {
      id: "67890-fghij",
      customerId: "12345-abcde",
      totalAmount: "$79.99",
      status: "Delivered",
      createdAt: "2023-04-30",
      details: {
        items: [
          { name: "T-Shirt", quantity: 1, price: "$19.99" },
        ],
        shippingAddress: "456 Another St, City, Country",
        paymentMethod: "PayPal",
      },
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleUpdateModalShow = (order) => {
    setCurrentOrder(order);
    setShowUpdateModal(true);
  };

  const handleDetailsModalShow = (order) => {
    setCurrentOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setCurrentOrder(null);
  };

  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setCurrentOrder(null);
  };

  const handleUpdateStatus = (newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === currentOrder.id ? { ...order, status: newStatus } : order
      )
    );
    handleUpdateModalClose();
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  return (
    <div>
      <h2 className="mt-4">Manage Orders</h2>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={filter} onChange={handleFilterChange}>
                <option>All</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Canceled</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerId}</td>
              <td>{order.totalAmount}</td>
              <td>
                <Badge bg={order.status === "Processing" ? "info" : order.status === "Delivered" ? "success" : "danger"}>
                  {order.status}
                </Badge>
              </td>
              <td>{order.createdAt}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleDetailsModalShow(order)}>
                  View Details
                </Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleUpdateModalShow(order)}>
                  Update Status
                </Button>
                <Button variant="outline-danger" size="sm">
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Order ID: {currentOrder?.id}</h5>
          <h6>Current Status: {currentOrder?.status}</h6>
          <Form>
            <Form.Group>
              <Form.Label>Select New Status</Form.Label>
              <Form.Control as="select" onChange={(e) => handleUpdateStatus(e.target.value)}>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Canceled</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order Details Modal */}
      <Modal show={showDetailsModal} onHide={handleDetailsModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Order ID: {currentOrder?.id}</h5>
          <h6>Status: {currentOrder?.status}</h6>
          <h6>Created At: {currentOrder?.createdAt}</h6>
          <h6>Total Amount: {currentOrder?.totalAmount}</h6>
          <h6>Customer ID: {currentOrder?.customerId}</h6>
          <h6>Shipping Address: {currentOrder?.details.shippingAddress}</h6>
          <h6>Payment Method: {currentOrder?.details.paymentMethod}</h6>
          <h6>Items:</h6>
          <ul>
            {currentOrder?.details.items.map((item, index) => (
              <li key={index}>
                {item.name} (Quantity: {item.quantity}, Price: {item.price})
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDetailsModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagementContent;
