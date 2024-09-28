import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form } from "react-bootstrap";

const VendorManagementContent = () => {
  return (
    <div>
      <h2 className="mt-4">Manage Inventory</h2>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Stock Level</Form.Label>
              <Form.Control as="select">
                <option>All</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Vendor</th>
            <th>Current Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Smartphone X</td>
            <td>Acme Inc.</td>
            <td>50</td>
            <td>
              <Badge bg="success">In Stock</Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
              >
                Update Stock
              </Button>
            </td>
          </tr>
          <tr>
            <td>T-Shirt</td>
            <td>XYZ Corp</td>
            <td>5</td>
            <td>
              <Badge
                bg="warning"
                text="dark"
              >
                Low Stock
              </Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
              >
                Update Stock
              </Button>
            </td>
          </tr>
          <tr>
            <td>Headphones</td>
            <td>Acme Inc.</td>
            <td>0</td>
            <td>
              <Badge bg="danger">Out of Stock</Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
              >
                Update Stock
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default VendorManagementContent;
