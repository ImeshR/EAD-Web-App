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
                <option>Delivered</option>
                <option>Canceled</option>
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
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1001</td>
            <td>John Doe</td>
            <td>2023-05-01</td>
            <td>$129.99</td>
            <td>
              <Badge bg="info">Processing</Badge>
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
                className="me-2"
              >
                Mark Delivered
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
              >
                Cancel
              </Button>
            </td>
          </tr>
          <tr>
            <td>#1002</td>
            <td>Jane Smith</td>
            <td>2023-04-30</td>
            <td>$79.99</td>
            <td>
              <Badge bg="success">Delivered</Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
              >
                View Details
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default OrderManagementContent;
