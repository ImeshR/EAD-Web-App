import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Modal,
} from "react-bootstrap";

const CommentsManagementContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const comments = [
    {
      commentId: "12345-abcde",
      vendorId: "67890-fghij",
      customerId: "11111-aaaaa",
      orderId: "22222-bbbbb",
      text: "Great product and fast shipping!",
      createdAt: "2023-05-01",
    },
    {
      commentId: "67890-fghij",
      vendorId: "12345-abcde",
      customerId: "33333-ccccc",
      orderId: "44444-ddddd",
      text: "The product was damaged upon arrival.",
      createdAt: "2023-05-02",
    },
  ];

  const handleShowModal = (comment) => {
    setSelectedComment(comment);
    setShowModal(true);
  };

  const handleDeleteComment = (commentId) => {
    // Logic to delete the comment
    console.log(`Comment ${commentId} deleted.`);
    // Optionally, remove the comment from the comments array
  };

  return (
    <div>
      <h2 className="mt-4">Manage Comments</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Comment ID</th>
            <th>Vendor ID</th>
            <th>Customer ID</th>
            <th>Order ID</th>
            <th>Comment</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.commentId}>
              <td>{comment.commentId}</td>
              <td>{comment.vendorId}</td>
              <td>{comment.customerId}</td>
              <td>{comment.orderId}</td>
              <td>{comment.text}</td>
              <td>{comment.createdAt}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(comment)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  // Logic to flag the comment can be implemented here
                >
                  Flag
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.commentId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Viewing Comment */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComment && (
            <>
              <p><strong>Comment ID:</strong> {selectedComment.commentId}</p>
              <p><strong>Vendor ID:</strong> {selectedComment.vendorId}</p>
              <p><strong>Customer ID:</strong> {selectedComment.customerId}</p>
              <p><strong>Order ID:</strong> {selectedComment.orderId}</p>
              <p><strong>Comment:</strong> {selectedComment.text}</p>
              <p><strong>Created At:</strong> {selectedComment.createdAt}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommentsManagementContent;
