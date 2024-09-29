import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Nav,
  Card,
  Navbar,
  NavDropdown,
  Table,
  Button,
  Badge,
  Form,
  Modal,
} from "react-bootstrap";
import {
  Bell,
  User,
  ShoppingCart,
  Headphones,
  CheckCircle,
  XCircle,
  MessageCircle,
  Package,
  DollarSign,
} from "react-feather";

const UserAccountApprovalContent = () => {
  return (
    <div>
      <h2 className="mt-4">Approve User Accounts</h2>
      <Table
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12345-abcde</td>
            <td>john@example.com</td>
            <td>Customer</td>
            <td>2023-05-01</td>
            <td>
              <Button
                variant="success"
                size="sm"
                className="me-2"
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
              >
                Reject
              </Button>
            </td>
          </tr>
          <tr>
            <td>67890-fghij</td>
            <td>jane@example.com</td>
            <td>Vendor</td>
            <td>2023-05-01</td>
            <td>
              <Button
                variant="success"
                size="sm"
                className="me-2"
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
              >
                Reject
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default UserAccountApprovalContent;