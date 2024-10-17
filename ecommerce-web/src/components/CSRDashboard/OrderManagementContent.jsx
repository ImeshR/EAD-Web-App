import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form, Spinner, Pagination } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import OrderDetailsOffcanvas from "./OrderDetailsOffcanvas"; // Import the new Offcanvas component

const OrderManagementContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Number of orders per page
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order for offcanvas
  const [showOffcanvas, setShowOffcanvas] = useState(false); // Control the visibility of the Offcanvas

  // Fetch orders data from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("api/Order", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const allOrders = response.data.data;
      setTotalOrders(allOrders.length); // Total orders for pagination
      setOrders(allOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  // Fetch orders initially
  useEffect(() => {
    fetchOrders();
  }, [currentPage, ordersPerPage]);

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = statusFilter === "All"
    ? orders
    : orders.filter((order) =>
        order.status === "Pending" || order.status === "Delivered" || order.status === "Canceled"
          ? order.status === statusFilter
          : false
      );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination controls
  const pageCount = Math.ceil(totalOrders / ordersPerPage);

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    // Show confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        // Make the API call to delete the order
        await axios.delete(`api/Order/delete/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Re-fetch the orders after deletion
        fetchOrders();

        Swal.fire("Deleted!", "The order has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire("Error!", "There was an issue deleting the order.", "error");
      }
    }
  };

  // Open the offcanvas with the selected order
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOffcanvas(true);
  };

  // Close the offcanvas
  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedOrder(null);
  };

  return (
    <div>
      <h2 className="mt-4">Manage Orders</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Form className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control as="select" value={statusFilter} onChange={handleStatusChange}>
                    <option>All</option>
                    <option>Pending</option>
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerId}</td>
                    <td>{order.totalAmount}</td>
                    <td>
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
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleViewOrderDetails(order)} // Open offcanvas with order details
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)} // Call the delete function
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(pageCount)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
              />
            </Pagination>
          </div>
        </>
      )}

      {/* Order Details Offcanvas */}
      <OrderDetailsOffcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        order={selectedOrder}
        refreshOrders={fetchOrders}
      />
    </div>
  );
};

export default OrderManagementContent;
