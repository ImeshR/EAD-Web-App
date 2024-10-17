import React, { useState, useEffect } from "react";
import { Offcanvas, Button, Form, Row, Col, Image, Spinner } from "react-bootstrap";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../services/firebase-config";
import Swal from "sweetalert2";

const ProductEditOffcanvas = ({ show, onHide, product, onUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId , setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [active, setActive] = useState(false);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]); // Store newly uploaded images
  const [uploading, setUploading] = useState(false); // To show spinner during image upload

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.categoryId);
      setPrice(product.price);
      setStockCount(product.stockCount);
      setActive(product.active);
      setImages(product.images);
    }
  }, [product]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedImages = [];

    setUploading(true); // Show loading spinner during upload

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `product_images/${file.name + Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error("Image upload failed:", error);
              Swal.fire("Error", "Image upload failed", "error");
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedImages.push(downloadURL);
              resolve();
            }
          );
        });
      } catch (error) {
        console.error("Image upload error:", error);
      }
    }

    setImages((prevImages) => [...prevImages, ...uploadedImages]);
    setNewImages(uploadedImages);
    setUploading(false);
  };

  const handleSave = async () => {
    try {
      const updatedProduct = {
        name,
        description,
        categoryId,
        price,
        images: [...images, ...newImages],
        active,
        stockCount,
      };

      await axios.put(`/api/Product/update/${product.id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      Swal.fire("Success!", "Product updated successfully.", "success");

      onUpdate();
      onHide();
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error", "Failed to update product.", "error");
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
          <Offcanvas.Title>Edit Product</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group
              as={Row}
              controlId="formProductName"
            >
              <Form.Label column sm={3}>Name</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId="formProductDescription"
              className="mt-3"
            >
              <Form.Label column sm={3}>Description</Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId="formProductCategory"
              className="mt-3"
            >
              <Form.Label column sm={3}>Category</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={categoryId}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId="formProductPrice"
              className="mt-3"
            >
              <Form.Label column sm={3}>Price</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId="formProductStockCount"
              className="mt-3"
            >
              <Form.Label column sm={3}>Stock Count</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(parseInt(e.target.value))}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId="formProductActive"
              className="mt-3"
            >
              <Form.Label column sm={3}>Active</Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="switch"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId="formProductImages"
              className="mt-3"
            >
              <Form.Label column sm={3}>Images</Form.Label>
              <Col sm={9}>
                {images.map((image, index) => (
                  <div key={index} className="mb-2">
                    <Image src={image} thumbnail style={{ width: "100px" }} />
                  </div>
                ))}
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="mt-2"
                />
                {uploading && (
                  <div className="mt-3">
                    <Spinner animation="border" />
                  </div>
                )}
              </Col>
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSave}
              className="mt-3"
            >
              Save Changes
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <style>
        {`
            .custom-offcanvas .offcanvas {
            width: 800px !important;
            }
        `}
      </style>
    </>
  );
};

export default ProductEditOffcanvas;
