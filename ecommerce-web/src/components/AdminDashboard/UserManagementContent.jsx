import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Modal, Form } from "react-bootstrap";

const UserManagementContent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    email: "",
    role: "",
    status: "Active",
    createdAt: new Date().toISOString().split("T")[0],
  });
  const [editUser, setEditUser] = useState(null); // State for editing a user

  const [users, setUsers] = useState([
    {
      id: "12345-abcde",
      email: "john@example.com",
      role: "Administrator",
      status: "Active",
      createdAt: "2023-05-01",
    },
    {
      id: "67890-fghij",
      email: "jane@example.com",
      role: "Vendor",
      status: "Pending",
      createdAt: "2023-05-02",
    },
  ]);

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewUser({
      id: "",
      email: "",
      role: "",
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add the new user to the users array
    setUsers((prevUsers) => [...prevUsers, newUser]);
    handleCloseCreateModal();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editUser.id ? editUser : user
      )
    );
    handleCloseEditModal();
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  return (
    <div>
      <h2 className="mt-4">Manage Users</h2>
      <Button variant="primary" className="mb-3" onClick={handleCreateUser}>
        Create New User
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Badge bg={user.status === "Active" ? "success" : "warning"} text={user.status === "Pending" ? "dark" : "white"}>
                  {user.status}
                </Badge>
              </td>
              <td>{user.createdAt}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                {user.status === "Active" ? (
                  <Button variant="outline-danger" size="sm">
                    Deactivate
                  </Button>
                ) : (
                  <Button variant="outline-success" size="sm">
                    Approve
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Creating New User */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={newUser.id}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create User
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Editing User */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={editUser?.id || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editUser?.email || ""}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={editUser?.role || ""}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update User
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagementContent;
