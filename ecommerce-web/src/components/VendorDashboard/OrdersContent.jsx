import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default function OrdersContent() {
  const [orders] = useState([
    { id: 1001, customer: 'John Doe', status: 'Processing', statusColor: 'info', total: '$59.99' },
    { id: 1002, customer: 'Jane Smith', status: 'Ready', statusColor: 'success', total: '$89.99' },
    { id: 1003, customer: 'Bob Johnson', status: 'Pending', statusColor: 'secondary', total: '$34.99' }
  ])

  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Open modal and set selected order
  const handleShowModal = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  return (
    <div>
      <h2 className="mt-4">Vendor Orders</h2>
      <table className="table table-striped">
        <thead className="bg-warning text-dark">
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td><span className={`badge bg-${order.statusColor}`}>{order.status}</span></td>
              <td>{order.total}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(order)}>
                  View Details
                </Button>
                {order.status === 'Ready' ? (
                  <Button variant="outline-info" size="sm">Mark as Delivered</Button>
                ) : (
                  <Button variant="outline-success" size="sm">Mark as Ready</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Viewing Order Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> {selectedOrder.total}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
