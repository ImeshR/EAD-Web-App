import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge } from "react-bootstrap";

const UserManagementContent = () => {
  return (
    <div>
      <h2 className="mt-4">Manage Users</h2>
      <Button variant="primary" className="mb-3">Create New User</Button>
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
          <tr>
            <td>12345-abcde</td>
            <td>john@example.com</td>
            <td>Administrator</td>
            <td><Badge bg="success">Active</Badge></td>
            <td>2023-05-01</td>
            <td>
              <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
              <Button variant="outline-danger" size="sm">Deactivate</Button>
            </td>
          </tr>
          <tr>
            <td>67890-fghij</td>
            <td>jane@example.com</td>
            <td>Vendor</td>
            <td><Badge bg="warning" text="dark">Pending</Badge></td>
            <td>2023-05-02</td>
            <td>
              <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
              <Button variant="outline-success" size="sm">Approve</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagementContent;
