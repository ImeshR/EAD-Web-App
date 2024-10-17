import React, { useState, useEffect, useContext } from "react";
import { Card, Modal, Button, Form } from "react-bootstrap";
import ReactStars from "react-stars";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserContext } from "../../services/hooks/UserContext";

export default function FeedbackContent() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState("");
  const { user, logout } = useContext(UserContext);

  // Fetch feedback data from the API when the component loads
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`api/Review/vendor/${user.id}`);
        const feedbackData = response.data.data.map((feedback) => ({
          id: feedback.id,
          name: `Customer ${feedback.customerId.slice(-4)}`,
          rating: feedback.rating,
          text: feedback.comment || "No comment provided",
          createdAt: feedback.createdAt,
          borderColor:
            feedback.rating >= 4
              ? "success"
              : feedback.rating >= 2
              ? "warning"
              : "danger",
        }));
        setFeedbacks(feedbackData);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [user.id]);

  const handleShowModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setResponse("");
  };

  const handleSendResponse = async () => {
    // Prepare data for reply
    const replyData = {
      replyId: user.id,
      userId: user.id,
      content: response,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`api/Review/reply/${selectedFeedback.id}`, replyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        Swal.fire("Success!", "Your response has been sent.", "success");
        handleCloseModal();
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to send the response.", "error");
      console.error("Error sending reply:", error);
    }
  };

  const handleDeleteFeedback = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this feedback.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`api/Review/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.status === 200) {
            Swal.fire("Deleted!", "The feedback has been deleted.", "success");
            setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id)); // Remove feedback from UI
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to delete feedback.", "error");
          console.error("Error deleting feedback:", error);
        }
      }
    });
  };

  return (
    <div>
      <h2 className="mt-4">Vendor Feedback</h2>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <Card
            className={`mb-3 border-${feedback.borderColor}`}
            key={index}
            style={{ maxWidth: "800px", position: "relative" }} // Setting max-width and centering the card
          >
            <Card.Body>
              <Button
                variant="link"
                onClick={() => handleDeleteFeedback(feedback.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  padding: "0",
                  fontSize: "24px",
                  color: "#dc3545",
                }}
              >
                <i className="bi bi-trash"></i>
              </Button>
              <Card.Title>{feedback.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                <ReactStars
                  count={5}
                  value={feedback.rating}
                  size={24}
                  edit={false}
                  half={true}
                  color2={"#ffd700"}
                />
              </Card.Subtitle>
              <Card.Text>{feedback.text}</Card.Text>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleShowModal(feedback)}
              >
                Respond
              </button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No feedbacks available</p>
      )}

      {/* Modal for Responding to Feedback */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Respond to {selectedFeedback?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="responseForm">
              <Form.Label>Response</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response here"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendResponse}
          >
            Send Response
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
