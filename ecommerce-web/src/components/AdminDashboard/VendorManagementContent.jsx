import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Modal, Form } from "react-bootstrap";

const VendorManagementContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({
    id: "",
    name: "",
    averageRating: "",
    totalProducts: "",
    status: "Active",
  });

  const vendors = [
    {
      id: "12345-abcde",
      name: "Acme Inc.",
      averageRating: "4.5 / 5",
      totalProducts: 23,
      status: "Active",
    },
    {
      id: "67890-fghij",
      name: "XYZ Corp",
      averageRating: "3.8 / 5",
      totalProducts: 12,
      status: "Inactive",
    },
  ];

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
      name: "",
      averageRating: "",
      totalProducts: "",
      status: "Active",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add the new vendor to the vendors array
    vendors.push(newVendor);
    handleCloseCreateModal();
  };

  return (
    <div>
      <h2 className="mt-4">Manage Vendors</h2>
      <Button variant="primary" className="mb-3" onClick={handleCreateVendor}>
        Create Vendor Account
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>Vendor Name</th>
            <th>Average Rating</th>
            <th>Total Products</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td>{vendor.id}</td>
              <td>{vendor.name}</td>
              <td>{vendor.averageRating}</td>
              <td>{vendor.totalProducts}</td>
              <td>
                <Badge bg={vendor.status === "Active" ? "success" : "danger"}>
                  {vendor.status}
                </Badge>
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
                {vendor.status === "Active" ? (
                  <Button variant="outline-danger" size="sm">
                    Deactivate
                  </Button>
                ) : (
                  <Button variant="outline-success" size="sm">
                    Reactivate
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Vendor Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Vendor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <div>
              <p><strong>Vendor ID:</strong> {selectedVendor.id}</p>
              <p><strong>Vendor Name:</strong> {selectedVendor.name}</p>
              <p><strong>Average Rating:</strong> {selectedVendor.averageRating}</p>
              <p><strong>Total Products:</strong> {selectedVendor.totalProducts}</p>
              <p><strong>Status:</strong> {selectedVendor.status}</p>
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
              <Form.Label>Vendor ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={newVendor.id}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newVendor.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Average Rating</Form.Label>
              <Form.Control
                type="text"
                name="averageRating"
                value={newVendor.averageRating}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Products</Form.Label>
              <Form.Control
                type="number"
                name="totalProducts"
                value={newVendor.totalProducts}
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
