import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge } from "react-bootstrap";

const VendorManagementContent = () => {
  return (
    <div>
      <h2 className="mt-4">Manage Vendors</h2>
      <Button
        variant="primary"
        className="mb-3"
      >
        Create Vendor Account
      </Button>
      <Table
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Rating</th>
            <th>Total Sales</th>
            <th>Products</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Acme Inc.</td>
            <td>4.5 / 5</td>
            <td>$10,234</td>
            <td>23</td>
            <td>
              <Badge bg="success">Active</Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
              >
                View Details
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
              >
                Deactivate
              </Button>
            </td>
          </tr>
          <tr>
            <td>XYZ Corp</td>
            <td>3.8 / 5</td>
            <td>$5,678</td>
            <td>12</td>
            <td>
              <Badge bg="danger">Inactive</Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
              >
                View Details
              </Button>
              <Button
                variant="outline-success"
                size="sm"
              >
                Reactivate
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default VendorManagementContent;
