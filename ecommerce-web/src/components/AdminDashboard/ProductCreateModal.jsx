import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Offcanvas, Spinner } from "react-bootstrap";
import useCategories from "../../services/hooks/useCategories";
import useVendors from "../../services/hooks/useVendors";
import Swal from "sweetalert2";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../services/firebase-config";

const ProductCreateModal = ({ show, onHide , onProductCreated }) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    stockCount: 0,
    images: [],
    active: true,
    vendorId: "",
  });

  const handleCategorySelect = (e) => {
    const selectedCategoryId = e.target.value;
    setProduct((prevProduct) => ({
      ...prevProduct,
      categoryId: selectedCategoryId,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(
        storage,
        `product_images/${file.name + Date.now()}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Image upload failed:", error);
          Swal.fire("Error", "Image upload failed", "error");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          uploadedImages.push(downloadURL);

          setProduct((prevProduct) => ({
            ...prevProduct,
            images: [...prevProduct.images, ...uploadedImages],
          }));
        }
      );
    }
  };

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString(); 
    const newProduct = {
      ...product,
      createdAt: currentDate,
      updatedAt: currentDate,
      ratings: [0],
      averageRating: 0,
    };

    console.log("new product", newProduct);

    try {
      await axios.post("api/Product/create", newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire("Success!", "Product created successfully.", "success");
      
      if (onProductCreated) onProductCreated();

      onHide();
    } catch (error) {
      console.error("Error creating product:", error);
      Swal.fire("Error", "Failed to create product.", "error");
    }
  };


  return (
    <>
      <Offcanvas
        show={show}
        onHide={onHide}
        placement="end"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Create New Product</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {categoriesLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner
                animation="border"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Form>
              <Form.Group controlId="formProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </Form.Group>

              <Form.Group controlId="formProductDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </Form.Group>

              <Form.Group controlId="formVendorSelect">
                <Form.Label>Vendor</Form.Label>
                {vendorsLoading ? (
                  <Spinner
                    animation="border"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <Form.Control
                    as="select"
                    name="vendorId"
                    onChange={handleInputChange}
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
                      <option
                        key={vendor.id}
                        value={vendor.id}
                      >
                        {vendor.name}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>

              <Form.Group controlId="formCategorySelect">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleCategorySelect}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formProductPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                />
              </Form.Group>

              <Form.Group controlId="formProductStockCount">
                <Form.Label>Stock Count</Form.Label>
                <Form.Control
                  type="number"
                  name="stockCount"
                  value={product.stockCount}
                  onChange={handleInputChange}
                  placeholder="Enter stock count"
                />
              </Form.Group>

              <Form.Group controlId="formProductImages">
                <Form.Label>Product Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={handleSubmit}
                className="mt-3"
              >
                Create Product
              </Button>
            </Form>
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <style>
        {`
            .custom-offcanvas {
              width: 800px !important;
            }
          `}
      </style>
    </>
  );
};

export default ProductCreateModal;
