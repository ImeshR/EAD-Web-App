import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge } from "react-bootstrap";
import axios from "axios";
import CreateUserModal from "./CreateUserModal"; 
import EditUserOffcanvas from "./EditUserOffcanvas";

const UserManagementContent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showEditOffcanvas, setShowEditOffcanvas] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

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
  };

  const refreshUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("api/User", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data.data);
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role"; // Fallback if role not found
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowEditOffcanvas(true);
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const handleCloseEditOffcanvas = () => setShowEditOffcanvas(false);

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
                <Badge bg={user.active ? "success" : "warning"} text={user.active ? "white" : "dark"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreateUserModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        onUserCreated={refreshUsers} // Pass callback to refresh the table
        roles={roles}
      />
      <EditUserOffcanvas
        show={showEditOffcanvas}
        handleClose={handleCloseEditOffcanvas}
        userToEdit={userToEdit}
        roles={roles}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  );
};

export default UserManagementContent;
