import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form } from "react-bootstrap";

const OrderManagementContent = () => {
  return (
    <div>
      <h2 className="mt-4">Manage Orders</h2>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select">
                <option>All</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Canceled</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12345-abcde</td>
            <td>67890-fghij</td>
            <td>$129.99</td>
            <td><Badge bg="info">Processing</Badge></td>
            <td>2023-05-01</td>
            <td>
              <Button variant="outline-primary" size="sm" className="me-2">View Details</Button>
              <Button variant="outline-success" size="sm" className="me-2">Update Status</Button>
              <Button variant="outline-danger" size="sm">Cancel</Button>
            </td>
          </tr>
          <tr>
            <td>67890-fghij</td>
            <td>12345-abcde</td>
            <td>$79.99</td>
            <td><Badge bg="success">Delivered</Badge></td>
            <td>2023-04-30</td>
            <td>
              <Button variant="outline-primary" size="sm">View Details</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default OrderManagementContent;
