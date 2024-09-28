import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form } from "react-bootstrap";

const VendorManagementContent = () => {
  return (
    <div>
      <h2 className="mt-4">Manage Products</h2>
      <Form className="mb-3">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Vendor</Form.Label>
              <Form.Control as="select">
                <option>All Vendors</option>
                <option>Acme Inc.</option>
                <option>XYZ Corp</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control as="select">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Clothing</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select">
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
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
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Smartphone X</td>
            <td>Acme Inc.</td>
            <td>Electronics</td>
            <td>$599.99</td>
            <td>50</td>
            <td>
              <Badge bg="success">Active</Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
              >
                Edit
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
            <td>T-Shirt</td>
            <td>XYZ Corp</td>
            <td>Clothing</td>
            <td>$19.99</td>
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
                className="me-2"
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
              >
                Deactivate
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default VendorManagementContent;
