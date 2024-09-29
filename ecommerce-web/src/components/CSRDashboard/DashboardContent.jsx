import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Row, Col, Nav, Card, Navbar, NavDropdown, Table, Button, Badge, Form, Modal } from 'react-bootstrap'
import { Bell, User, ShoppingCart, Headphones, CheckCircle, XCircle, MessageCircle, Package, DollarSign } from 'react-feather'

const DashboardContent = () => {
  return (
    <div>
      <h2 className="mt-4">CSR Dashboard</h2>
      <Row>
        {[
          {
            title: "Pending Approvals",
            value: "15",
            icon: <User size={24} />,
            color: "warning",
          },
          {
            title: "Open Orders",
            value: "28",
            icon: <ShoppingCart size={24} />,
            color: "info",
          },
          {
            title: "Customer Queries",
            value: "7",
            icon: <MessageCircle size={24} />,
            color: "danger",
          },
          {
            title: "Low Stock Items",
            value: "12",
            icon: <Package size={24} />,
            color: "warning",
          },
          {
            title: "Recent Comments",
            value: "23",
            icon: <MessageCircle size={24} />,
            color: "info",
          },
          {
            title: "Recent Payments",
            value: "45",
            icon: <DollarSign size={24} />,
            color: "success",
          },
        ].map((stat, index) => (
          <Col
            md={4}
            key={index}
          >
            <Card className={`mb-4 border-${stat.color}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{stat.title}</Card.Title>
                    <Card.Text className="h2">{stat.value}</Card.Text>
                  </div>
                  <div className={`text-${stat.color}`}>{stat.icon}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3>Recent Activities</h3>
      <Table
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2023-05-01</td>
            <td>Account Approved</td>
            <td>User: john@example.com</td>
          </tr>
          <tr>
            <td>2023-05-01</td>
            <td>Order Status Updated</td>
            <td>Order #1001 marked as shipped</td>
          </tr>
          <tr>
            <td>2023-04-30</td>
            <td>Customer Query Resolved</td>
            <td>Query #123 marked as resolved</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default DashboardContent;