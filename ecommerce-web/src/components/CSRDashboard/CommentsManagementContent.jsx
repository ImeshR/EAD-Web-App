import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Spinner, Pagination, Modal } from "react-bootstrap";
import axios from "axios"; // Import axios for making API calls
import ReactStars from "react-stars"; // Import ReactStars
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

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Get current reviews to display based on pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const getVendorName = (vendorId) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : "N/A";
  };

  return (
    <div>
      <h2 className="mt-4">Customer Support</h2>
      <h3>Customer Reviews</h3>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Customer ID</th>
                <th>Vendor ID</th>
                <th>Rating</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length > 0 ? (
                currentReviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.id}</td>
                    <td>{review.customerId}</td>
                    <td>{getVendorName(review.vendorId)}</td>
                    <td>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        edit={false}
                        size={24}
                        color2={"#ffd700"}
                      />
                    </td>
                    <td>{new Date(review.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

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
