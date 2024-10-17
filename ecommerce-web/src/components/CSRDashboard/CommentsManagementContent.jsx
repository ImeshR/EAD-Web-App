import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Spinner, Pagination, Modal } from "react-bootstrap";
import axios from "axios";
import ReactStars from "react-stars";
import useVendors from "../../services/hooks/useVendors";

const CustomerSupportContent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const { vendors, loading: vendorsLoading } = useVendors();

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const response = await axios.get("api/Review", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div>
      <h2 className="mt-4">Customer Reviews</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {currentReviews.length > 0 ? (
            currentReviews.map((review) => (
              <Card key={review.id} className="mb-3 p-3" style={{ maxWidth: "800px" }}>
                <Card.Body>
                  <Card.Title>Review ID: {review.id}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Customer ID: {review.customerId}
                  </Card.Subtitle>
                  <Card.Text>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      edit={false}
                      size={24}
                      color2={"#ffd700"}
                    />
                    <br />
                    <strong>Comment: </strong>{review.comment}
                  </Card.Text>

                  {/* Display replies if any */}
                  {review.replies && review.replies.length > 0 ? (
                    <Card.Text className="text-success">
                      <strong>Response:</strong> {review.replies[0].content}
                    </Card.Text>
                  ) : (
                    <Card.Text className="text-muted">No response yet.</Card.Text>
                  )}

                  <Card.Footer className="text-muted">
                    <small>
                      Created At: {new Date(review.createdAt).toLocaleString()}
                    </small>
                  </Card.Footer>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No reviews found.</p>
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.Prev
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
              />
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSupportContent;
