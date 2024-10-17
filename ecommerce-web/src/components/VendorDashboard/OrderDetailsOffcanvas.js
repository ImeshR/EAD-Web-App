import React, { useState } from "react";
import {
  Offcanvas,
  Button,
  Badge,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import useProductData from "../../services/hooks/useProductData";
import axios from "axios";
import Swal from "sweetalert2";

const OrderDetailsOffcanvas = ({ show, handleClose, order, refreshOrders }) => {
  const [newStatus, setNewStatus] = useState(order ? order.orderStatus : "");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch product data using custom hook (pass the productId from the order object)
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProductData(order?.item?.productId);

  const handleUpdateStatus = async () => {
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

          // API request to update the order status
          const response = await axios.put(
            `api/Order/update-status/${order.orderId}?newStatus=${newStatus}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            Swal.fire(
              "Success!",
              "Order status updated successfully.",
              "success"
            );
            refreshOrders(); // Refresh order list after update
            setShowModal(false);
            handleClose();
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to update order status.", "error");
          console.error("Error updating status:", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        scroll={true}
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Order Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {order ? (
            <>
              <h5>Order Information</h5>
              <p>
                <strong>Order ID:</strong> {order.orderId}
              </p>
              <p>
                <strong>Customer ID:</strong> {order.customerId}
              </p>
              <p>
                <strong>Quantity:</strong> {order.item?.quantity}
              </p>
              <p>
                <strong>Price at Purchase:</strong> $
                {order.item?.priceAtPurchase}
              </p>
              <p>
                <strong>Order Status:</strong>{" "}
                <Badge
                  bg={
                    order.orderStatus === "Delivered"
                      ? "success"
                      : order.orderStatus === "Canceled"
                      ? "danger"
                      : "warning"
                  }
                >
                  {order.orderStatus}
                </Badge>
              </p>

              {/* Button to open modal for updating status */}
              <Button
                variant="warning"
                onClick={() => setShowModal(true)}
              >
                Update Status
              </Button>

              {/* Product Details */}
              {productLoading ? (
                <div className="text-center">
                  <Spinner
                    animation="border"
                    role="status"
                  >
                    <span className="visually-hidden">
                      Loading Product Data...
                    </span>
                  </Spinner>
                </div>
              ) : productError ? (
                <Alert variant="danger">{productError}</Alert>
              ) : product ? (
                <>
                  <h5 className="mt-4">Product Details</h5>
                  {/* Display Product Image */}
                  {product.images?.length > 0 && (
                    <div className="product-image">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="img-fluid"
                        style={{ maxWidth: "80px", height: "auto" }}
                      />
                    </div>
                  )}
                  <p>
                    <strong>Product Name:</strong> {product.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {product.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p>
                    <strong>Stock Count:</strong> {product.stockCount}
                  </p>
                  <p>
                    <strong>Average Rating:</strong> {product.averageRating}
                  </p>
                </>
              ) : null}
            </>
          ) : (
            <Alert variant="danger">No order details to display</Alert>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modal for selecting new status */}
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
              onChange={(e) => setNewStatus(e.target.value)} // Update newStatus
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
