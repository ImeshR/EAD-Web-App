// OrderDetailsOffcanvas.js
import React, { useState } from "react";
import {
  Offcanvas,
  Button,
  ListGroup,
  Badge,
  Form,
  Modal,
} from "react-bootstrap";
import { format } from "date-fns";
import axios from "axios";
import Swal from "sweetalert2";

const OrderDetailsOffcanvas = ({ show, onHide, order, refreshOrders }) => {
  const [newStatus, setNewStatus] = useState(order ? order.status : "");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleUpdateStatus = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to update the order status to "${newStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          // Ensure the correct status is passed to the API
          const response = await axios.put(
            `api/Order/update-status/${order.id}?newStatus=${newStatus}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status !== 200) {
            Swal.fire(
              "Success!",
              "Order status updated successfully.",
              "success"
            );
            refreshOrders();
            setShowModal(false);
            onHide();
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to update order status.", "error");
          console.error("Error updating status:", error);
        } finally {
          setLoading(false);
          refreshOrders();
          setShowModal(false);
          onHide();
        }
      }
    });
  };

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
              <strong>Order ID:</strong> {order ? order.id : "Loading..."}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Customer ID:</strong>{" "}
              {order ? order.customerId : "Loading..."}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Status:</strong>{" "}
              {order ? (
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
              ) : (
                "Loading..."
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Total Amount:</strong>{" "}
              {order ? order.totalAmount : "Loading..."}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Created At:</strong>{" "}
              {order
                ? format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")
                : "Loading..."}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Order Items:</strong>
              <ListGroup>
                {order ? (
                  order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      Product ID: {item.productId}, Quantity: {item.quantity},
                      Price: {item.priceAtPurchase}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>Loading items...</ListGroup.Item>
                )}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>

          {/* Button to open modal for updating status */}
          <Button
            variant="warning"
            onClick={() => setShowModal(true)}
          >
            Update Status
          </Button>
        </Offcanvas.Body>

        {/* Modal for selecting status */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Order Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Select New Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)} // Ensure this updates newStatus properly
              >
                <option value="" disabled>Select Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </Modal.Footer>
        </Modal>
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
