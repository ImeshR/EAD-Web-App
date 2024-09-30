import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function DashboardContent() {
  const metrics = [
    { title: 'Total Sales', value: '$10,245', color: 'primary' },
    { title: 'Active Products', value: '24', color: 'success' },
    { title: 'Number of Orders', value: '85', color: 'info' },
    { title: 'Low-Stock Alerts', value: '3', color: 'warning' },
    { title: 'Vendor Rating', value: '4.7/5', color: 'danger' }
  ]

  return (
    <div>
      <h2 className="mt-4">Vendor Dashboard</h2>
      <Row>
        {metrics.map(metric => (
          <Col md={4} key={metric.title}>
            <Card className={`mb-4 bg-${metric.color} text-white`}>
              <Card.Body>
                <Card.Title>{metric.title}</Card.Title>
                <Card.Text className="h2">{metric.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
