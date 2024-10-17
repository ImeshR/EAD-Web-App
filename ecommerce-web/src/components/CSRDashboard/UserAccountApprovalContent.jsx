import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const UserAccountApprovalContent = () => {
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

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role";
  };

  // Approve user and set active to true with Swal confirmation
  const approveUser = async (userId) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to approve this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, approve!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const userToUpdate = users.find((user) => user.id === userId);
        if (!userToUpdate) return;

        // Create request body with active status set to true
        const updatedUser = {
          ...userToUpdate,
          active: true,
        };

        // Send PUT request to approve user
        await axios.put(`api/User/${userId}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // After approval, update users list and show success message
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, active: true } : user
          )
        );

        Swal.fire("Approved!", "The user has been successfully approved.", "success");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      Swal.fire("Error!", "Something went wrong while approving the user.", "error");
    }
  };

  const inactiveUsers = users.filter((user) => !user.active);

  const approvedUsersLast3Days = users.filter((user) => {
    return user.active;
  });

  return (
    <div>
      <h2 className="mt-4">Manage User Activation</h2>
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
          {/* Show only inactive users */}
          {inactiveUsers.map((user) => (
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
                  variant="success"
                  onClick={() => approveUser(user.id)}
                >
                  Approve
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-4">Approved Users (Updated in Last 3 Days)</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {approvedUsersLast3Days.map((user) => (
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
              <td>{new Date(user.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserAccountApprovalContent;
