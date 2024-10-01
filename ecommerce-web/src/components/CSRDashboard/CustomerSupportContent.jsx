import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Badge,
  Form,
  Modal
} from "react-bootstrap";

const CustomerSupportContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  const [orderId, setOrderId] = useState("");
  const [note, setNote] = useState("");

  const handleShowModal = (title, body) => {
    setModalTitle(title);
    setModalBody(body);
    setShowModal(true);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    // Here you can add logic to save the note for the specified order
    console.log(`Note for Order ${orderId}: ${note}`);
    setOrderId("");
    setNote("");
  };

  return (
    <div>
      <h2 className="mt-4">Customer Support</h2>
      <h3>Open Queries</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Query ID</th>
            <th>Customer ID</th>
            <th>Subject</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12345-abcde</td>
            <td>67890-fghij</td>
            <td>Order Delay</td>
            <td>2023-05-01</td>
            <td>
              <Badge bg="warning">Open</Badge>
            </td>
            <td>
              <Button
                variant="primary"
                size="sm"
                className="me-2"
                onClick={() =>
                  handleShowModal(
                    "Query Details",
                    "Query details for #12345-abcde"
                  )
                }
              >
                View Details
              </Button>
              <Button variant="success" size="sm" className="me-2">
                Resolve
              </Button>
              <Button variant="info" size="sm">
                Escalate
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      <h3 className="mt-4">Add Note to Order</h3>
      <Form onSubmit={handleAddNote}>
        <Form.Group className="mb-3">
          <Form.Label>Order ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Note</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Note
        </Button>
      </Form>

      {/* Modal for Query Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerSupportContent;
