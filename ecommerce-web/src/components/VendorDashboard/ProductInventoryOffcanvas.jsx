import React, { useEffect, useState } from "react";
import { Offcanvas, Button, Row, Col, Table, Badge, Form } from "react-bootstrap";
import axios from "axios";

const ProductInventoryOffcanvas = ({ show, handleClose, product }) => {
  const [inventory, setInventory] = useState([]);
  const [newInventory, setNewInventory] = useState({
    quantityAvailable: 0,
    lowStockAlert: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && show) {
      fetchInventoryData(product.id);
    }
  }, [product, show]);

  const fetchInventoryData = async (productId) => {
    try {
      const response = await axios.get(`api/Inventory/product/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setInventory(response.data.data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setInventory([]);
    }
  };

  const handleInventoryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewInventory({
      ...newInventory,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddInventory = async () => {
    setLoading(true);
    const inventoryData = {
      productId: product.id,
      vendorId: product.vendorId, // Assuming you want to use the same vendor as the product
      quantityAvailable: newInventory.quantityAvailable,
      lowStockAlert: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.post("/api/Inventory/create", inventoryData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchInventoryData(product.id); // Refresh table after adding inventory
    } catch (error) {
      console.error("Error adding inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <strong>{product.name}</strong>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row className="mt-3">
            <Col>
              <strong>Vendor:</strong> {product.vendorName}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <strong>Category:</strong> {product.categoryName}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <strong>Stock Count:</strong> {product.stockCount}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Badge
                bg={product.active ? "success" : "warning"}
                text={product.active ? "white" : "dark"}
              >
                {product.active ? "Active" : "Inactive"}
              </Badge>
            </Col>
          </Row>

          {/* Inventory data in a small table */}
          <Row className="mt-4">
            <Col>
              <h5>Inventory Information</h5>
              <Table striped bordered hover size="sm" className="text-center">
                <thead>
                  <tr>
                    <th>Inventory ID</th>
                    <th>Quantity Available</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.quantityAvailable}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>{new Date(item.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Add New Inventory Section */}
          <Row className="mt-4">
            <Col>
              <h5>Add New Inventory</h5>
              <Form>
                <Form.Group controlId="quantityAvailable">
                  <Form.Label>Quantity Available</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantityAvailable"
                    value={newInventory.quantityAvailable}
                    onChange={handleInventoryChange}
                    placeholder="Enter quantity"
                  />
                </Form.Group>

                <Button
                  variant="success"
                  className="mt-3"
                  onClick={handleAddInventory}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Inventory"}
                </Button>
              </Form>
            </Col>
          </Row>

          <Button variant="primary" onClick={handleClose} className="mt-3">
            Close
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      <style>
        {`
            .offcanvas {
              width: 1000px !important;
            }
        `}
      </style>
    </>
  );
};

export default ProductInventoryOffcanvas;
