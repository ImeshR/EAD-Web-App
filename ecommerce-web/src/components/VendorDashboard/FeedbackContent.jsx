import React, { useState } from 'react'
import { Card, Modal, Button, Form } from 'react-bootstrap'

export default function FeedbackContent() {
  const feedbacks = [
    { name: 'John D.', rating: '4/5', text: 'Great product, fast shipping! Would buy again.', borderColor: 'primary' },
    { name: 'Sarah M.', rating: '5/5', text: 'Excellent quality and customer service. Highly recommended!', borderColor: 'success' },
    { name: 'Mike R.', rating: '3/5', text: 'Product was okay, but shipping took longer than expected.', borderColor: 'warning' }
  ]

  const [showModal, setShowModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [response, setResponse] = useState('')

  // Open the modal and set the selected feedback
  const handleShowModal = (feedback) => {
    setSelectedFeedback(feedback)
    setShowModal(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedFeedback(null)
    setResponse('')
  }

  // Handle sending the response
  const handleSendResponse = () => {
    console.log(`Response to ${selectedFeedback.name}: ${response}`)
    handleCloseModal()
  }

  return (
    <div>
      <h2 className="mt-4">Vendor Feedback</h2>
      {feedbacks.map((feedback, index) => (
        <Card className={`mb-3 border-${feedback.borderColor}`} key={index}>
          <Card.Body>
            <Card.Title>{feedback.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Rating: {feedback.rating}</Card.Subtitle>
            <Card.Text>{feedback.text}</Card.Text>
            <button className="btn btn-sm btn-outline-primary" onClick={() => handleShowModal(feedback)}>Respond</button>
          </Card.Body>
        </Card>
      ))}

      {/* Modal for Responding to Feedback */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Respond to {selectedFeedback?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="responseForm">
              <Form.Label>Response</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response here"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSendResponse}>
            Send Response
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
