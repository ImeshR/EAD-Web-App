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

const CommentsManagementContent = () => {
  return (
    <div>
      <h2 className="mt-4">Manage Comments</h2>
      <Table
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Comment ID</th>
            <th>Vendor ID</th>
            <th>Customer ID</th>
            <th>Order ID</th>
            <th>Comment</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12345-abcde</td>
            <td>67890-fghij</td>
            <td>11111-aaaaa</td>
            <td>22222-bbbbb</td>
            <td>Great product and fast shipping!</td>
            <td>2023-05-01</td>
            <td>
              <Button
                variant="primary"
                size="sm"
                className="me-2"
              >
                View
              </Button>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
              >
                Flag
              </Button>
              <Button
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </td>
          </tr>
          <tr>
            <td>67890-fghij</td>
            <td>12345-abcde</td>
            <td>33333-ccccc</td>
            <td>44444-ddddd</td>
            <td>The product was damaged upon arrival.</td>
            <td>2023-05-02</td>
            <td>
              <Button
                variant="primary"
                size="sm"
                className="me-2"
              >
                View
              </Button>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
              >
                Flag
              </Button>
              <Button
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default CommentsManagementContent;