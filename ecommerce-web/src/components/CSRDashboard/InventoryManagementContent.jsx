import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Image,
  Badge,
} from "react-bootstrap";
import useCategories from "../../services/hooks/useCategories";
import useVendors from "../../services/hooks/useVendors";
import ProductInventoryOffcanvas from "./ProductInventoryOffcanvas";

const InventoryManagementContent = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For product details
  const [showOffcanvas, setShowOffcanvas] = useState(false); // Control offcanvas visibility

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("api/Product", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
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
    const productWithDetails = {
      ...product,
      vendorName: getVendorName(product.vendorId),
      categoryName: getCategoryName(product.categoryId),
    };
    setSelectedProduct(productWithDetails); // Set the selected product details
    setShowOffcanvas(true); // Show the offcanvas
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false); // Hide the offcanvas

  return (
    <div>
      <h2 className="mt-4">Manage Inventory</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image & Name</th>
            <th>Vendor Name</th>
            <th>Category</th>
            <th>Stock Count</th>
            <th>Active</th>
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
                    onClick={() => handleImageClick(product)} // Show product details on click
                  />
                )}
                <div>{product.name}</div>
              </td>
              <td className="align-middle">
                {getVendorName(product.vendorId)}
              </td>
              <td className="align-middle">
                {getCategoryName(product.categoryId)}
              </td>
              <td className="align-middle">{product.stockCount}</td>
              <td className="align-middle">
                <Badge bg={product.active ? "success" : "warning"} text={product.active ? "white" : "dark"}>
                  {product.active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="align-middle">
                {/* You can add action buttons like Edit or Delete here */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Offcanvas for product details */}
      <ProductInventoryOffcanvas 
        show={showOffcanvas} 
        handleClose={handleCloseOffcanvas} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default InventoryManagementContent;
