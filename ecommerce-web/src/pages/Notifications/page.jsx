import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Low Stock Alert', description: 'Product XYZ is running low on stock', type: 'warning', read: false, timestamp: '2023-05-01 10:30 AM' },
    { id: 2, title: 'Order Status Change', description: 'Order #1234 has been shipped', type: 'info', read: false, timestamp: '2023-05-01 11:45 AM' },
    { id: 3, title: 'Account Approved', description: 'Your account has been approved by the administrator', type: 'success', read: true, timestamp: '2023-04-30 09:15 AM' },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'info':
        return 'primary';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Notifications</h2>
                <Button variant="outline-primary" onClick={markAllAsRead}>Mark All as Read</Button>
              </div>
              <ListGroup>
                {notifications.map((notification) => (
                  <ListGroup.Item key={notification.id} className={notification.read ? 'bg-light' : ''}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{notification.title}</h5>
                        <p className="mb-1">{notification.description}</p>
                        <small className="text-muted">{notification.timestamp}</small>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <Badge bg={getBadgeVariant(notification.type)} className="mb-2">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Button variant="link" size="sm" onClick={() => markAsRead(notification.id)}>
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}