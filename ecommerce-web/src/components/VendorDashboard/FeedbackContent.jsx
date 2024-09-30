import React from 'react'
import { Card } from 'react-bootstrap'

export default function FeedbackContent() {
  const feedbacks = [
    { name: 'John D.', rating: '4/5', text: 'Great product, fast shipping! Would buy again.', borderColor: 'primary' },
    { name: 'Sarah M.', rating: '5/5', text: 'Excellent quality and customer service. Highly recommended!', borderColor: 'success' },
    { name: 'Mike R.', rating: '3/5', text: 'Product was okay, but shipping took longer than expected.', borderColor: 'warning' }
  ]

  return (
    <div>
      <h2 className="mt-4">Vendor Feedback</h2>
      {feedbacks.map((feedback, index) => (
        <Card className={`mb-3 border-${feedback.borderColor}`} key={index}>
          <Card.Body>
            <Card.Title>{feedback.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Rating: {feedback.rating}</Card.Subtitle>
            <Card.Text>{feedback.text}</Card.Text>
            <button className="btn btn-sm btn-outline-primary">Respond</button>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}
