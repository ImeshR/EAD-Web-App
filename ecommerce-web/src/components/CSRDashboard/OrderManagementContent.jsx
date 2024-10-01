import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Row,
  Col,
  Form,
  Table,
  Button,
  Badge,
  Modal,
} from "react-bootstrap";

const OrderManagementContent = () => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Processing");

  // Handle opening the details modal with specific details
  const handleShowDetailsModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowDetailsModal(true);
  };

  // Handle closing the details modal
  const handleCloseDetailsModal = () => setShowDetailsModal(false);

  // Handle opening the status update modal
  const handleShowStatusModal = (orderId, currentStatus) => {
    setModalTitle(`Update Status for Order #${orderId}`);
    setSelectedStatus(currentStatus);
    setShowStatusModal(true);
  };

  // Handle closing the status update modal
  const handleCloseStatusModal = () => setShowStatusModal(false);

  // Handle status change in modal
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  return (
    <div>
      <h2 className="mt-4">Manage Orders</h2>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Order Status</Form.Label>
              <Form.Control as="select">
                <option>All</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
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
          <tr>
            <td>12345-abcde</td>
            <td>67890-fghij</td>
            <td>$129.99</td>
            <td>
              <Badge bg="info">Processing</Badge>
            </td>
            <td>2023-05-01</td>
            <td>
              <Button
                variant="primary"
                size="sm"
                className="me-2"
                onClick={() =>
                  handleShowDetailsModal(
                    "Order Details",
                    "Order details for #12345-abcde"
                  )
                }
              >
                View Details
              </Button>
              <Button
                variant="success"
                size="sm"
                className="me-2"
                onClick={() => handleShowStatusModal("12345-abcde", "Processing")}
              >
                Update Status
              </Button>
              <Button variant="danger" size="sm">
                Cancel Order
              </Button>
            </td>
          </tr>
          <tr>
            <td>67890-fghij</td>
            <td>12345-abcde</td>
            <td>$79.99</td>
            <td>
              <Badge bg="success">Delivered</Badge>
            </td>
            <td>2023-04-30</td>
            <td>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  handleShowDetailsModal(
                    "Order Details",
                    "Order details for #67890-fghij"
                  )
                }
              >
                View Details
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleShowStatusModal("67890-fghij", "Delivered")}
              >
                Update Status
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      {/* Modal for Viewing Order Details */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Updating Order Status */}
      <Modal show={showStatusModal} onHide={handleCloseStatusModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select New Status</Form.Label>
            <Form.Control
              as="select"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseStatusModal}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleCloseStatusModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagementContent;
