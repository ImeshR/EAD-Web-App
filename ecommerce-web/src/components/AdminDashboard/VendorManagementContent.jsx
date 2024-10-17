import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Spinner, Offcanvas } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import ReactStars from "react-stars"; // Importing ReactStars for star rating

const VendorManagementContent = () => {
  const [vendors, setVendors] = useState([]);
  const [reviews, setReviews] = useState({}); // To store reviews by vendor ID
  const [loading, setLoading] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch vendors from the API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("api/User/vendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendors(response.data.data); // Assuming "data" contains vendor info

        // Fetch reviews for each vendor
        response.data.data.forEach(async (vendor) => {
          const reviewResponse = await axios.get(`api/Review/vendor/${vendor.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setReviews((prevReviews) => ({
            ...prevReviews,
            [vendor.id]: reviewResponse.data.data, // Store reviews by vendor ID
          }));
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an issue fetching vendor data.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Handle the opening of the offcanvas to view the vendor's reviews
  const handleViewComments = (vendor) => {
    setSelectedVendor(vendor);
    setShowOffcanvas(true);
  };

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedVendor(null);
  };

  return (
    <div>
      <h2 className="mt-4">Manage Vendors</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Vendor Name</th>
              <th>Average Rating</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
                <td>{vendor.name}</td>
                <td>
                  <ReactStars
                    count={5}
                    value={vendor.averageRanking || 0}
                    size={24}
                    edit={false}
                    color2={"#ffd700"}
                  />
                </td>
                <td>{reviews[vendor.id]?.length || 0} Comments</td> 
                <td>
                  <Badge bg={vendor.active ? "success" : "warning"}>
                    {vendor.active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewComments(vendor)} 
                  >
                    View Comments
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Offcanvas to show reviews */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Reviews for {selectedVendor?.name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {reviews[selectedVendor?.id]?.length > 0 ? (
            <div>
              {reviews[selectedVendor?.id].map((review) => (
                <div key={review.id} className="mb-3">
                  <h6>Rating:</h6>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={24}
                    edit={false}
                    color2={"#ffd700"}
                  />
                  <p><strong>Comment:</strong> {review.comment}</p>
                  <p><small>Posted on: {new Date(review.createdAt).toLocaleString()}</small></p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews available.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default VendorManagementContent;
