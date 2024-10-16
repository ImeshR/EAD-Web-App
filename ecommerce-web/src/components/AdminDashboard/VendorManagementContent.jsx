import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Offcanvas, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import ReactStars from "react-stars";  // Importing ReactStars for star rating

const VendorManagementContent = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("api/Vendor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setVendors(response.data.data);
      } catch (error) {
        console.error("Error fetching vendors", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("api/User", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data.data); // User data structure from the API
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchVendors();
    fetchUsers();
  }, []);

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);

    // Map users to comments based on customerId
    const commentsWithUserData = vendor.comments.map((comment) => {
      // Find the user corresponding to the comment's customerId
      const user = users.find((user) => user.id === comment.customerId);
      return {
        ...comment,
        userName: user ? user.name : "Unknown", // Assign user name or "Unknown" if not found
      };
    });

    setSelectedVendor((prev) => ({
      ...prev,
      comments: commentsWithUserData,
    }));

    setShowOffcanvas(true);
  };

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedVendor(null);
  };

  const handleDeleteVendor = async (vendorId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`api/Vendor/delete/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
        Swal.fire('Deleted!', 'Vendor has been deleted.', 'success');
      } catch (error) {
        console.error("Error deleting vendor", error);
        Swal.fire('Error', 'Failed to delete vendor.', 'error');
      }
    }
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
                <td>{vendor.vendorName}</td>
                <td>
                  <ReactStars
                    count={5}
                    value={vendor.averageRanking}
                    size={24}
                    edit={false}
                    color2={"#ffd700"}
                  />
                </td>
                <td>{vendor.comments.length} Comments</td>
                <td>
                  <Badge bg="success">Active</Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewDetails(vendor)}
                  >
                    View Comments
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteVendor(vendor.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Offcanvas for Vendor Comments */}
      <Offcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement="end"
        scroll={true}
        backdrop={true}
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Vendor Comments</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedVendor && (
            <div>
              <p><strong>Vendor Name:</strong> {selectedVendor.vendorName}</p>
              <p><strong>Average Rating:</strong>
                <ReactStars
                  count={5}
                  value={selectedVendor.averageRanking} 
                  size={24}
                  edit={false}
                  color2={"#ffd700"}
                />
              </p>
              <h5>Comments:</h5>
              <ul>
                {selectedVendor.comments.map((comment) => (
                  <li key={comment.id}>
                    <strong>{comment.userName}:</strong> {comment.text}
                    <br />
                    <small>{new Date(comment.date).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <style>
        {`
          .custom-offcanvas {
            width: 800px !important;
          }
        `}
      </style>
    </div>
  );
};

export default VendorManagementContent;
