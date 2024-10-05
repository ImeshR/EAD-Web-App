import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ObjectId } from "bson";  // Import ObjectId from bson

const UserManagementContent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [editUser, setEditUser] = useState(null); 
  const [users, setUsers] = useState([]); 
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("api/User", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUsers(response.data.data); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("api/MasterData/GetRoles", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setRoles(response.data); 
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewUser({
      name: "",
      email: "",
      role: "",
      password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate a random 24-character hex string (ObjectId)
    const id = new ObjectId().toHexString();

    const userPayload = {
      id: id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      phoneNumber: "", // Empty string
      address: "",     // Empty string
      role: newUser.role,
      active: true,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("api/User/register", userPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) => [...prevUsers, userPayload]); // Add new user to the list
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === editUser.id ? editUser : user))
    );
    handleCloseEditModal();
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role";
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
              <td>{getRoleName(user.role)}</td> 
              <td>
                <Badge
                  bg={user.active ? "success" : "warning"}
                  text={user.active ? "white" : "dark"}
                >
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td>{user.createdAt || "N/A"}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                {user.active ? (
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
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
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
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Form.Control>
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
    </div>
  );
};

export default UserManagementContent;
