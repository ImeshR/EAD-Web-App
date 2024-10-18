import React, { useEffect, useState , useContext  } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Image,
  Offcanvas,
  Row,
  Col,
  Spinner
} from "react-bootstrap";
import useCategories from "../../services/hooks/useCategories";
import useVendors from "../../services/hooks/useVendors";
import ProductCreateModal from "./ProductCreateModal";
import ProductEditOffcanvas from "./ProductEditOffcanvas";
import Swal from "sweetalert2";
import { UserContext } from '../../services/hooks/UserContext'; 

const ProductsContent = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [products, setProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showEditOffcanvas, setShowEditOffcanvas] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, logout } = useContext(UserContext);

  const handleCreateModalHide = () => setShowCreateModal(false);
  const handleOffcanvasClose = () => setShowOffcanvas(false);
  const handleEditOffcanvasClose = () => setShowEditOffcanvas(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`api/Product/vendor/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const sortedProducts = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handleRefreshProducts = () => {
    fetchProducts();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : "N/A";
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setShowOffcanvas(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditOffcanvas(true); // Open the edit offcanvas
  };

  // Delete product
  const handleDeleteClick = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productId); // Call delete function if confirmed
      }
    });
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`api/Product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      Swal.fire("Deleted!", "Product has been deleted.", "success");
      handleRefreshProducts(); // Refresh product list after deletion
    } catch (error) {
      Swal.fire("Error!", "There was an error deleting the product.", "error");
      console.error("Error deleting product:", error);
    }
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
          <div className="text-center mt-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
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
              <th>Vendor Name</th>
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
                <td className="align-middle">
                  {getVendorName(product.vendorId)}
                </td>
                <td className="align-middle">
                  {getCategoryName(product.categoryId)}
                </td>
                <td className="align-middle">{product.price}</td>
                <td className="align-middle">{product.stockCount}</td>
                <td className="align-middle">
                  {product.active ? "Yes" : "No"}
                </td>
                <td className="align-middle">
                  <Button onClick={() => handleEditClick(product)}>Edit</Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Delete
                  </Button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ProductCreateModal
        show={showCreateModal}
        onHide={handleCreateModalHide}
        onProductCreated={handleRefreshProducts} // Pass the callback to refresh products
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
                  style={{ width: "100%" }}
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

      {/* Product Edit Offcanvas */}
      {selectedProduct && (
        <ProductEditOffcanvas
          show={showEditOffcanvas}
          onHide={handleEditOffcanvasClose}
          product={selectedProduct}
          onUpdate={handleRefreshProducts} // Refresh products after updating
        />
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
              color: #007bff; 
              font-weight: bold;
              }

              img {
              border-radius: 10px; 
              }
          `}
      </style>
    </div>
  );
};

export default ProductsContent;
