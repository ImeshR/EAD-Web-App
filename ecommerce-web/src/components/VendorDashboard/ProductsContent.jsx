import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { UserContext } from "../../services/hooks/UserContext";

export default function ProductsContent( ) {
  const [products, setProducts] = useState([
    { name: "Product 1", category: "Category A", price: "$19.99" },
    { name: "Product 2", category: "Category B", price: "$24.99" },
    { name: "Product 3", category: "Category A", price: "$14.99" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Create Product");
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Handle modal open for create or edit
  const handleShowModal = (product = null) => {
    if (product) {
      setModalTitle("Edit Product");
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setModalTitle("Create Product");
      setCurrentProduct({ name: "", category: "", price: "" });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  // Handle modal form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update product
      setProducts(
        products.map((p) =>
          p.name === currentProduct.name ? currentProduct : p
        )
      );
    } else {
      // Create new product
      setProducts([...products, currentProduct]);
    }

    setShowModal(false);
  };

  return (
    <div>
      <h2 className="mt-4">My Products</h2>
      <Button
        className="mb-3"
        onClick={() => handleShowModal()}
      >
        Create New Product
      </Button>

      <table className="table table-striped">
        <thead className="bg-info text-white">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                >
                  Deactivate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create/Edit */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.category}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    category: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.price}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    price: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
            >
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
