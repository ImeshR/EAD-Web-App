import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form, Modal } from "react-bootstrap";

const VendorManagementContent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [products, setProducts] = useState([
    {
      id: "12345-abcde",
      name: "Smartphone X",
      vendor: "Acme Inc.",
      category: "Electronics",
      price: "$599.99",
      stockLevel: 50,
      status: "Active",
    },
    {
      id: "67890-fghij",
      name: "T-Shirt",
      vendor: "XYZ Corp",
      category: "Clothing",
      price: "$19.99",
      stockLevel: 5,
      status: "Low Stock",
    },
  ]);
  
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    vendor: "",
    category: "",
    price: "",
    stockLevel: "",
    status: "Active",
  });
  
  const [editProduct, setEditProduct] = useState(null);

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewProduct({
      id: "",
      name: "",
      vendor: "",
      category: "",
      price: "",
      stockLevel: "",
      status: "Active",
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    handleCloseCreateModal();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editProduct.id ? editProduct : product
      )
    );
    handleCloseEditModal();
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  return (
    <div>
      <h2 className="mt-4">Manage Products</h2>
      <Button variant="primary" className="mb-3" onClick={handleCreateProduct}>
        Create New Product
      </Button>
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Vendor</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.vendor}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.stockLevel}</td>
              <td>
                <Badge bg={product.status === "Active" ? "success" : "warning"} text={product.status === "Low Stock" ? "dark" : "white"}>
                  {product.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm">
                  Deactivate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Creating New Product */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={newProduct.id}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vendor</Form.Label>
              <Form.Control
                type="text"
                name="vendor"
                value={newProduct.vendor}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Level</Form.Label>
              <Form.Control
                type="number"
                name="stockLevel"
                value={newProduct.stockLevel}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Product
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Editing Product */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={editProduct?.id || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editProduct?.name || ""}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vendor</Form.Label>
              <Form.Control
                type="text"
                name="vendor"
                value={editProduct?.vendor || ""}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={editProduct?.category || ""}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={editProduct?.price || ""}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Level</Form.Label>
              <Form.Control
                type="number"
                name="stockLevel"
                value={editProduct?.stockLevel || ""}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Product
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorManagementContent;
