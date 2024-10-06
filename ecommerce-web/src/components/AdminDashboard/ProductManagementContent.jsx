import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

const VendorManagementContent = () => {
    const [categories, setCategories] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        vendorId: '',
        categoryId: '', // This will hold the selected category ID
        price: 0,
        stockCount: 0,
        active: true,
    });
    const [editProduct, setEditProduct] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('api/Category',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setCategories(response.data.data); // Adjust based on your response structure
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('api/Product',
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            ); // Adjust the endpoint accordingly
            setProducts(response.data.data); // Adjust based on your response structure
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('api/Product/create', newProduct ,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            ); // Adjust the endpoint accordingly
            Swal.fire('Success', 'Product created successfully!', 'success');
            setShowCreateModal(false);
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error creating product:', error);
            Swal.fire('Error', 'There was an error creating the product.', 'error');
        }
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewProduct({
            name: '',
            description: '',
            vendorId: '',
            categoryId: '',
            price: 0,
            stockCount: 0,
            active: true,
        });
    };

    // Handle edit functionality
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`api/Product/update/${editProduct.id}`, editProduct ,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            ); // Adjust the endpoint accordingly
            Swal.fire('Success', 'Product updated successfully!', 'success');
            setShowEditModal(false);
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire('Error', 'There was an error updating the product.', 'error');
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditProduct(null);
    };

    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditProduct((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditToggleActive = () => {
        setEditProduct((prev) => ({
            ...prev,
            active: !prev.active,
        }));
    };

    const handleToggleActive = () => {
        setNewProduct((prev) => ({
            ...prev,
            active: !prev.active,
        }));
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`api/Product/delete/${id}`); // Adjust the endpoint accordingly
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
                fetchProducts(); // Refresh product list
            } catch (error) {
                console.error('Error deleting product:', error);
                Swal.fire('Error', 'There was an error deleting the product.', 'error');
            }
        }
    };
    return (
        <div>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create New Product
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Vendor ID</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock Count</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.vendorId}</td>
                            <td>{categories.find(cat => cat.categoryId === product.categoryId)?.name || 'N/A'}</td>
                            <td>{product.price}</td>
                            <td>{product.stockCount}</td>
                            <td>{product.active ? 'Yes' : 'No'}</td>
                            <td>
                                <Button onClick={() => {
                                    setEditProduct(product);
                                    setShowEditModal(true);
                                }}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
                            <Form.Select
                                name="categoryId"
                                value={newProduct.categoryId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
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
                            <Form.Select
                                name="categoryId"
                                value={editProduct?.categoryId}
                                onChange={handleEditInputChange}
                                required
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
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
