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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Inventory ID</th>
            <th>Product ID</th>
            <th>Vendor ID</th>
            <th>Quantity Available</th>
            <th>Low Stock Alert</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12345-abcde</td>
            <td>67890-fghij</td>
            <td>11111-aaaaa</td>
            <td>50</td>
            <td><Badge bg="success">No</Badge></td>
            <td>2023-05-01</td>
            <td>
              <Button variant="outline-primary" size="sm">Update Stock</Button>
            </td>
          </tr>
          <tr>
            <td>67890-fghij</td>
            <td>12345-abcde</td>
            <td>22222-bbbbb</td>
            <td>5</td>
            <td><Badge bg="warning" text="dark">Yes</Badge></td>
            <td>2023-05-02</td>
            <td>
              <Button variant="outline-primary" size="sm">Update Stock</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default VendorManagementContent;
