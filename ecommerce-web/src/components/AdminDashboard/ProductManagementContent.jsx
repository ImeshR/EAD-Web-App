import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Button, Badge, Form, Modal, Spinner } from "react-bootstrap";
import axios from "axios"; // Importing axios
import Swal from 'sweetalert2'; // Import SweetAlert2 for notifications

const generateHexId = () => {
    return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

const VendorManagementContent = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        id: "",
        name: "",
        description: "", // Added description
        vendorId: "",
        category: "",
        price: "",
        stockCount: 0, // Changed to 0 as per your model
        active: true, // Ensure the key matches your API
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
            description: "", // Reset description
            vendorId: "",
            category: "",
            price: "",
            stockCount: 0, // Reset stockCount to 0
            active: true,
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

    // Handle toggle for active status
    const handleToggleActive = () => {
        setNewProduct((prev) => ({
            ...prev,
            active: !prev.active,
        }));
    };

    const handleEditToggleActive = () => {
        setEditProduct((prev) => ({
            ...prev,
            active: !prev.active,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const productWithId = {
            ...newProduct,
            id: generateHexId(), // Generate ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            const response = await axios.post("api/Product/create", productWithId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === "Create successful") {
                Swal.fire({
                    icon: 'success',
                    title: 'Product Created',
                    text: 'The product has been created successfully!',
                });
                setProducts((prevProducts) => [...prevProducts, response.data.data]);
                handleCloseCreateModal();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error creating product:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error creating the product.',
            });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const updatedProduct = {
            name: editProduct.name,
            description: editProduct.description,
            category: editProduct.category,
            price: editProduct.price,
            images: [], // Assuming you want to send an array of images; fill this as needed
            active: editProduct.active,
            stockCount: editProduct.stockCount,
        };

        try {
            const response = await axios.put(`api/Product/update/${editProduct.id}`, updatedProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === "Update successful") {
                Swal.fire({
                    icon: 'success',
                    title: 'Product Updated',
                    text: 'The product has been updated successfully!',
                });
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === editProduct.id ? { ...product, ...updatedProduct } : product
                    )
                );
                handleCloseEditModal();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error updating the product.',
            });
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setShowEditModal(true);
    };

    // Handle Delete Product
    const handleDeleteProduct = (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("token");
                try {
                    const response = await axios.delete(`api/Product/delete/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data.message === "Delete successful") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'The product has been deleted.',
                        });
                        setProducts((prevProducts) =>
                            prevProducts.filter((product) => product.id !== productId)
                        );
                    } else {
                        throw new Error(response.data.message);
                    }
                } catch (error) {
                    console.error("Error deleting product:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'There was an error deleting the product.',
                    });
                }
            }
        });
    };

    // Filter Products based on criteria
    const filteredProducts = products.filter((product) => {
        const matchesVendor = vendorFilter === "All Vendors" || product.vendorId === vendorFilter;
        const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
        const matchesStatus =
            statusFilter === "All" ||
            (statusFilter === "Active" && product.active) ||
            (statusFilter === "Inactive" && !product.active);
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
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <Button variant="primary" onClick={handleCreateProduct}>
                        Create Product
                    </Button>
                    <Form>
                        <Row className="mb-3">
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
                                        <option value="All">All</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Stock Level</Form.Label>
                                    <Form.Control as="select" value={stockLevelFilter} onChange={(e) => setStockLevelFilter(e.target.value)}>
                                        <option value="All">All</option>
                                        <option value="In Stock">In Stock</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
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
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.vendorId}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stockCount}</td>
                                    <td>
                                        <Badge pill bg={product.active ? "success" : "danger"}>
                                            {product.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button variant="info" onClick={() => handleEditProduct(product)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDeleteProduct(product.id)} className="ms-2">
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
                            {[...Array(totalPages)].map((_, index) => (
                                <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
                                    <Button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            )}

            {/* Create Product Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Product</Modal.Title>
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
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={newProduct.description}
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
                                type="number"
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
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                checked={newProduct.active}
                                onChange={handleToggleActive}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create Product
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
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
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={editProduct?.description}
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
                                type="number"
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
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                checked={editProduct?.active}
                                onChange={handleEditToggleActive}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Product
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default VendorManagementContent;
