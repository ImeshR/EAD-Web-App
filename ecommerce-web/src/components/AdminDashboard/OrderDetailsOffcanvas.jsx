// OrderDetailsOffcanvas.js
import React from "react";
import { Offcanvas, Button, ListGroup, Badge } from "react-bootstrap";
import { format } from "date-fns";

const OrderDetailsOffcanvas = ({ show, onHide, order }) => {
  if (!order) return null; // Render nothing if there's no order data

  return (
    <>
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      scroll={true}
      className="custom-offcanvas"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Order Details</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ListGroup>
          <ListGroup.Item>
            <strong>Order ID:</strong> {order.id}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Customer ID:</strong> {order.customerId}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Status:</strong>{" "}
            {
              <Badge
                bg={
                  order.status === "Delivered"
                    ? "success"
                    : order.status === "Canceled"
                    ? "danger"
                    : "warning"
                }
              >
                {order.status}
              </Badge>
            }
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Total Amount:</strong> {order.totalAmount}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Created At:</strong>{" "}
            {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Order Items:</strong>
            <ListGroup>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  Product ID: {item.productId}, Quantity: {item.quantity},
                  Price: {item.priceAtPurchase}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>
        <Button
          variant="outline-primary"
          onClick={onHide}
        >
          Close
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
    <style>
        {`
            .custom-offcanvas {
                width: 800px !important;
            }
        `}
    </style>
    </>
  );
};

export default OrderDetailsOffcanvas;
