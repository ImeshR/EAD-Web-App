import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import generateHexId from "../../services/randomId";

const VendorManagementContent = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({
    id: "",
    vendorId: "",
    userId: "",
    vendorName: "",
    averageRanking: 0,
    comments: [],
  });
  const [users, setUsers] = useState([]);

  // Fetch vendors and users from the API
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
        const vendorRoleId = "66e9782f59553323609b4f1b";
        const vendorUsers = response.data.data.filter(
          (user) => user.role === vendorRoleId
        );
        setUsers(vendorUsers);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchVendors();
    fetchUsers();
  }, []);

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVendor(null);
  };

  const handleCreateVendor = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewVendor({
      id: "",
      vendorId: "",
      userId: "",
      vendorName: "",
      averageRanking: 0,
      comments: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSelect = (e) => {
    const selectedUser = users.find((user) => user.id === e.target.value);
    if (selectedUser) {
      setNewVendor((prev) => ({
        ...prev,
        userId: selectedUser.id,
        vendorName: selectedUser.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vendorId = generateHexId();

    const vendorData = {
      ...newVendor,
      vendorId,
      comments: [],
    };

    try {
      await axios.post("api/Vendor/create", vendorData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Success", "Vendor created successfully!", "success");
      setVendors((prev) => [...prev, vendorData]);
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating vendor", error);
      Swal.fire("Error", "Failed to create vendor.", "error");
    }
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
      <Button variant="primary" className="mb-3" onClick={handleCreateVendor}>
        Create Vendor Account
      </Button>

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
                <td>{vendor.averageRanking} / 5</td>
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
                    View Details
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

      {/* Modal for Vendor Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Vendor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <div>
              <p>
                <strong>Vendor ID:</strong> {selectedVendor.id}
              </p>
              <p>
                <strong>Vendor Name:</strong> {selectedVendor.vendorName}
              </p>
              <p>
                <strong>Average Rating:</strong> {selectedVendor.averageRanking}
              </p>
              <p>
                <strong>Comments:</strong> {selectedVendor.comments.length}{" "}
                Comments
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Creating New Vendor */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Vendor Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User (Select Vendor)</Form.Label>
              <Form.Select
                name="userId"
                onChange={handleUserSelect}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                name="vendorName"
                value={newVendor.vendorName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Average Rating</Form.Label>
              <Form.Control
                type="number"
                name="averageRanking"
                value={newVendor.averageRanking}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Vendor
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorManagementContent;
