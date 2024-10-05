import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const UserManagementContent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    address: "",
    active: true,
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
      id: "",
      name: "",
      email: "",
      password: "",
      role: "",
      phoneNumber: "",
      address: "",
      active: true,
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

  const generateHexId = () => {
    return [...Array(24)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userPayload = {
      id: generateHexId(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      phoneNumber: newUser.phoneNumber || "",
      address: newUser.address || "",
      role: newUser.role,
      active: newUser.active,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("api/User/register", userPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) => [...prevUsers, userPayload]);
      handleCloseCreateModal();
      Swal.fire({
        title: "Success!",
        text: "User created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error creating the user.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const userPayload = {
      id: editUser.id, // Use the ID of the user to be updated
      name: editUser.name,
      email: editUser.email,
      // Leave password empty, as the password is not shown or updated
      role: editUser.role,
      active: editUser.active,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`api/User/${editUser.id}`, userPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUser.id ? { ...user, ...userPayload } : user
        )
      );
      handleCloseEditModal();
      Swal.fire({
        title: "Success!",
        text: "User updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the user.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  // Function to get the role name by ID
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role"; // Fallback if role not found
  };

  const handleToggleActiveStatus = async (user) => {
    const updatedActiveStatus = !user.active; // Toggle active status

    const userPayload = {
      ...user,
      active: updatedActiveStatus,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`api/User/${user.id}`, userPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, active: updatedActiveStatus } : u
        )
      );

      Swal.fire({
        title: "Success!",
        text: updatedActiveStatus
          ? "User activated successfully."
          : "User deactivated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the user status.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <h2 className="mt-4">Manage Users</h2>
      <Button
        variant="primary"
        className="mb-3"
        onClick={handleCreateUser}
      >
        Create New User
      </Button>
      <Table
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
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
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                {/* <Button
                  variant={user.active ? "outline-danger" : "outline-success"}
                  size="sm"
                  onClick={() => handleToggleActiveStatus(user)}
                >
                  {user.active ? "Deactivate" : "Approve"}
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Creating New User */}
      <Modal
        show={showCreateModal}
        onHide={handleCloseCreateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
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
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={newUser.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={newUser.active}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
            >
              Create User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Editing User */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editUser && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditInputChange}
                  required
                />
              </Form.Group>
              {/* Password field is hidden for editing */}
              {/* <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleEditInputChange}
                />
              </Form.Group> */}
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={editUser.role}
                  onChange={handleEditInputChange}
                  required
                >
                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={editUser.active}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
              >
                Update User
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagementContent;
