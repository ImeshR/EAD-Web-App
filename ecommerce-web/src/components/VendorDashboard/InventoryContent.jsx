import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function InventoryContent() {
  const [inventory, setInventory] = useState([
    { product: 'Product 1', stock: 50, status: 'In Stock', badgeColor: 'success' },
    { product: 'Product 2', stock: 5, status: 'Low Stock', badgeColor: 'warning' },
    { product: 'Product 3', stock: 0, status: 'Out of Stock', badgeColor: 'danger' }
  ])

  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newStock, setNewStock] = useState('')

  // Open the modal and set the selected product
  const handleShowModal = (product) => {
    setSelectedProduct(product)
    setNewStock(product.stock)
    setShowModal(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
  }

  // Handle stock update
  const handleUpdateStock = () => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.product === selectedProduct.product
          ? { ...item, stock: newStock, status: newStock === 0 ? 'Out of Stock' : (newStock <= 10 ? 'Low Stock' : 'In Stock'), badgeColor: newStock === 0 ? 'danger' : (newStock <= 10 ? 'warning' : 'success') }
          : item
      )
    )
    handleCloseModal()
  }

  return (
    <div>
      <h2 className="mt-4">Manage Inventory</h2>
      <table className="table table-striped">
        <thead className="bg-success text-white">
          <tr>
            <th>Product</th>
            <th>Current Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.product}</td>
              <td>{item.stock}</td>
              <td><span className={`badge bg-${item.badgeColor}`}>{item.status}</span></td>
              <td>
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleShowModal(item)}>
                  Update Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Updating Stock */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock for {selectedProduct?.product}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStock">
              <Form.Label>Current Stock</Form.Label>
              <Form.Control
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStock}>
            Update Stock
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
