import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Nav, Card, Navbar, NavDropdown, Table, Button, Badge, Form, Modal } from 'react-bootstrap'
import { Bell, User, ShoppingCart, Headphones, CheckCircle, XCircle, MessageCircle, Package, DollarSign } from 'react-feather'
import DashboardContent from '../../components/CSRDashboard/DashboardContent'
import UserAccountApprovalContent from '../../components/CSRDashboard/UserAccountApprovalContent'
import OrderManagementContent from '../../components/CSRDashboard/OrderManagementContent'
import CustomerSupportContent from '../../components/CSRDashboard/CustomerSupportContent'
import InventoryManagementContent from '../../components/CSRDashboard/InventoryManagementContent'
import CommentsManagementContent from '../../components/CSRDashboard/CommentsManagementContent'
import NavBar from '../../components/Navbar/Navbar'

export default function CSRDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', body: '' })

  const handleShowModal = (title, body) => {
    setModalContent({ title, body })
    setShowModal(true)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />
      case 'approve-accounts':
        return <UserAccountApprovalContent />
      case 'manage-orders':
        return <OrderManagementContent handleShowModal={handleShowModal} />
      case 'customer-support':
        return <CustomerSupportContent handleShowModal={handleShowModal} />
      case 'manage-inventory':
        return <InventoryManagementContent />
      case 'manage-comments':
        return <CommentsManagementContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="bg-light min-vh-100">
      <NavBar userRole={'csr'} />
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="d-md-block sidebar p-0">
          <Nav className="flex-column p-3 rounded" style={{ backgroundColor: '#e6e6fa' }}>
              <Nav.Link onClick={() => setActiveTab('dashboard')} active={activeTab === 'dashboard'} className="text-dark py-3 px-4">
                <User size={18} className="me-2" />Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('approve-accounts')} active={activeTab === 'approve-accounts'} className="text-dark py-3 px-4">
                <CheckCircle size={18} className="me-2" />Approve User Accounts
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('manage-orders')} active={activeTab === 'manage-orders'} className="text-dark py-3 px-4">
                <ShoppingCart size={18} className="me-2" />Manage Orders
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('customer-support')} active={activeTab === 'customer-support'} className="text-dark py-3 px-4">
                <Headphones size={18} className="me-2" />Customer Support
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('manage-inventory')} active={activeTab === 'manage-inventory'} className="text-dark py-3 px-4">
                <Package size={18} className="me-2" />Manage Inventory
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('manage-comments')} active={activeTab === 'manage-comments'} className="text-dark py-3 px-4">
                <MessageCircle size={18} className="me-2" />Manage Comments
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={9} lg={10} className="ms-sm-auto px-md-4">
            {renderContent()}
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}