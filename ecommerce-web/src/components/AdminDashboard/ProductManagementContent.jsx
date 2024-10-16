import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Image, Offcanvas, Row, Col } from "react-bootstrap";
import useCategories from "../../services/hooks/useCategories";
import ProductCreateModal from "./ProductCreateModal";

const VendorManagementContent = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [products, setProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCreateModalHide = () => setShowCreateModal(false);
  const handleOffcanvasClose = () => setShowOffcanvas(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("api/Product", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setShowOffcanvas(true);
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={() => setShowCreateModal(true)}
        className="mb-3"
      >
        Create New Product
      </Button>

      {categoriesLoading ? (
        <div>Loading categories...</div>
      ) : (
        <Table
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th>Image & Name</th>
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
                <td className="text-center align-middle">
                  {product.images.length > 0 && (
                    <Image
                      src={product.images[0]}
                      thumbnail
                      style={{ width: "80px", cursor: "pointer" }}
                      onClick={() => handleImageClick(product)}
                    />
                  )}
                  <div>{product.name}</div>
                </td>
                <td className="align-middle">{product.description}</td>
                <td className="align-middle">{product.vendorId}</td>
                <td className="align-middle">
                  {getCategoryName(product.categoryId)}
                </td>
                <td className="align-middle">{product.price}</td>
                <td className="align-middle">{product.stockCount}</td>
                <td className="align-middle">
                  {product.active ? "Yes" : "No"}
                </td>
                <td className="align-middle">
                  <Button>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ProductCreateModal
        show={showCreateModal}
        onHide={handleCreateModalHide}
      />

      {selectedProduct && (
        <Offcanvas
          show={showOffcanvas}
          onHide={handleOffcanvasClose}
          placement="end"
          className="custom-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{selectedProduct.name}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row>
              <Col xs={4}>
                <Image
                  src={selectedProduct.images[0]}
                  rounded
                  style={{ width: "100%" }} // Small image, fills its container
                />
              </Col>
              <Col xs={8}>
                <h5 className="mt-3">Product Details</h5>
                <div className="product-info">
                  <p>
                    <strong>Description:</strong> {selectedProduct.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ${selectedProduct.price}
                  </p>
                  <p>
                    <strong>Stock Count:</strong> {selectedProduct.stockCount}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {getCategoryName(selectedProduct.categoryId)}
                  </p>
                  <p>
                    <strong>Active:</strong>{" "}
                    {selectedProduct.active ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Average Rating:</strong>{" "}
                    {selectedProduct.averageRating}
                  </p>
                  <p>
                    <strong>Vendor ID:</strong> {selectedProduct.vendorId}
                  </p>
                  <p>
                    <strong>Product ID:</strong> {selectedProduct.id}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(selectedProduct.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(selectedProduct.updatedAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Ratings:</strong>{" "}
                    {selectedProduct.ratings.length > 0
                      ? selectedProduct.ratings.join(", ")
                      : "No Ratings"}
                  </p>
                </div>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      )}
      <style>
        {`
            .custom-offcanvas .offcanvas {
            width: 800px !important;
            }

            .product-info p {
            font-size: 16px;
            margin-bottom: 10px;
            }

            .product-info p strong {
            color: #007bff; /* Blue for emphasis */
            font-weight: bold;
            }

            img {
            border-radius: 10px; /* Rounded image edges */
            }
        `}
      </style>
    </div>
  );
};

export default VendorManagementContent;
