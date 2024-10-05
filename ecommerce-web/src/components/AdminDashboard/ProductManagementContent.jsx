import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form, Modal, Spinner } from "react-bootstrap";
import axios from "axios"; // Importing axios

const VendorManagementContent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    vendorId: "",
    category: "",
    price: "",
    stockCount: "",
    Active: true,
  });
  const [editProduct, setEditProduct] = useState(null);
  
  // State for Filters
  const [vendorFilter, setVendorFilter] = useState("All Vendors");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stockLevelFilter, setStockLevelFilter] = useState("All");

  // Unique values for filters
  const [uniqueVendors, setUniqueVendors] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Number of products per page

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("api/Product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.message === "Successful") {
          setProducts(response.data.data); // Set products from the API

          // Set unique vendors and categories for filters
          const vendors = Array.from(new Set(response.data.data.map(product => product.vendorId)));
          const categories = Array.from(new Set(response.data.data.map(product => product.category)));

          setUniqueVendors(["All Vendors", ...vendors]); // Include "All Vendors"
          setUniqueCategories(["All Categories", ...categories]); // Include "All Categories"
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewProduct({
      id: "",
      name: "",
      vendorId: "",
      category: "",
      price: "",
      stockCount: "",
      Active: true,
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

  // Filter Products based on criteria
  const filteredProducts = products.filter((product) => {
    const matchesVendor = vendorFilter === "All Vendors" || product.vendorId === vendorFilter;
    const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && product.Active) ||
      (statusFilter === "Inactive" && !product.Active);
    const matchesStockLevel =
      stockLevelFilter === "All" ||
      (stockLevelFilter === "In Stock" && product.stockCount > 0) ||
      (stockLevelFilter === "Low Stock" && product.stockCount > 0 && product.stockCount <= 5) ||
      (stockLevelFilter === "Out of Stock" && product.stockCount === 0);

    return matchesVendor && matchesCategory && matchesStatus && matchesStockLevel;
  });

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage); // Total number of pages

  return (
    <div>
      <h2 className="mt-4">Manage Products</h2>
      <Button variant="primary" className="mb-3" onClick={handleCreateProduct}>
        Create New Product
      </Button>

      {loading ? ( 
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Form className="mb-3">
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Vendor</Form.Label>
                  <Form.Control as="select" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
                    {uniqueVendors.map((vendor, index) => (
                      <option key={index} value={vendor}>{vendor}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    {uniqueCategories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control as="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Stock Level</Form.Label>
                  <Form.Control as="select" value={stockLevelFilter} onChange={(e) => setStockLevelFilter(e.target.value)}>
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
                <th>Vendor ID</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.vendorId}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stockCount}</td>
                  <td>
                    <Badge bg={product.Active ? "success" : "warning"} text={product.Active ? "white" : "dark"}>
                      {product.Active ? "Active" : "Inactive"}
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
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <Button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Modal for Creating Product */}
          <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreateSubmit}>
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
                  <Form.Label>Vendor ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendorId"
                    value={newProduct.vendorId}
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
                  <Form.Label>Stock Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="stockCount"
                    value={newProduct.stockCount}
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
                    value={editProduct?.id}
                    onChange={handleEditInputChange}
                    required
                    disabled // Disable editing product ID
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editProduct?.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vendor ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendorId"
                    value={editProduct?.vendorId}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={editProduct?.category}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={editProduct?.price}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="stockCount"
                    value={editProduct?.stockCount}
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
        </>
      )}
    </div>
  );
};

export default VendorManagementContent;
