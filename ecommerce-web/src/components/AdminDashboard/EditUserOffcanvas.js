import React, { useState, useEffect } from "react";
import { Offcanvas, Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const EditUserOffcanvas = ({ show, handleClose, userToEdit, roles, onUserUpdate }) => {
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    role: "",
    active: true,
  });

  useEffect(() => {
    if (userToEdit) {
      setEditUser({
        id: userToEdit.id,
        name: userToEdit.name,
        role: userToEdit.role,
        active: userToEdit.active,
      });
    }
  }, [userToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(`api/User/${editUser.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onUserUpdate(editUser); // Update the user list in parent
      handleClose(); // Close the Offcanvas

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

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit User</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editUser.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              name="role"
              value={editUser.role}
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
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default EditUserOffcanvas;
