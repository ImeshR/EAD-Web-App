import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const CreateUserModal = ({ show, handleClose, onUserCreated, roles }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
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

      onUserCreated(); // Call the parent function to refresh the user list
      handleClose(); // Close modal
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

  return (
    <Modal show={show} onHide={handleClose}>
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
                <option key={role.id} value={role.id}>
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
          <Button variant="primary" type="submit">
            Create User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateUserModal;
