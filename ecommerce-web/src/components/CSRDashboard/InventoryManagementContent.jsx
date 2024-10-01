import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Table, Button, Badge, Form, Modal } from 'react-bootstrap'

const InventoryManagementContent = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState(null)
  const [newStock, setNewStock] = useState('')

  const inventory = [
    { id: '12345-abcde', productId: '67890-fghij', vendorId: '11111-aaaaa', quantity: 50, lowStockAlert: 'No', lastUpdated: '2023-05-01', badgeColor: 'success' },
    { id: '67890-fghij', productId: '12345-abcde', vendorId: '22222-bbbbb', quantity: 5, lowStockAlert: 'Yes', lastUpdated: '2023-05-02', badgeColor: 'warning' }
  ]

  const handleUpdateStock = (inventoryItem) => {
    setSelectedInventory(inventoryItem)
    setNewStock(inventoryItem.quantity)
    setShowModal(true)
  }

  const handleSaveStock = () => {
    // Update stock logic can go here (e.g., API call to update inventory)
    console.log(`Updated stock for ${selectedInventory.id}: ${newStock}`)
    setShowModal(false)
  }

  return (
    <div>
      <h2 className="mt-4">Manage Inventory</h2>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Stock Level</Form.Label>
              <Form.Control as="select">
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
            <th>Inventory ID</th>
            <th>Product ID</th>
            <th>Vendor ID</th>
            <th>Quantity Available</th>
            <th>Low Stock Alert</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.productId}</td>
              <td>{item.vendorId}</td>
              <td>{item.quantity}</td>
              <td><Badge bg={item.badgeColor}>{item.lowStockAlert}</Badge></td>
              <td>{item.lastUpdated}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleUpdateStock(item)}>Update Stock</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Updating Stock */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock for {selectedInventory?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>New Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveStock}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default InventoryManagementContent
