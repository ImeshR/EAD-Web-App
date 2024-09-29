import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const data = [
  { name: 'Jan', sales: 4000, orders: 240, stock: 2400 },
  { name: 'Feb', sales: 3000, orders: 198, stock: 2210 },
  { name: 'Mar', sales: 5000, orders: 300, stock: 2290 },
  { name: 'Apr', sales: 2780, orders: 180, stock: 2000 },
  { name: 'May', sales: 1890, orders: 120, stock: 2181 },
  { name: 'Jun', sales: 2390, orders: 150, stock: 2500 },
];

export default function Reports() {
  const [reportType, setReportType] = useState('sales');

  const downloadReport = () => {
    console.log('Downloading report:', reportType);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Reports</h2>
                <div className="d-flex align-items-center">
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="me-2"
                  >
                    <option value="sales">Sales Report</option>
                    <option value="orders">Order Status Report</option>
                    <option value="stock">Stock Level Report</option>
                  </Form.Select>
                  <Button variant="primary" onClick={downloadReport}>Download</Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={reportType} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <Table striped bordered hover className="mt-4">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Sales ($)</th>
                    <th>Orders</th>
                    <th>Stock Level</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>${row.sales.toLocaleString()}</td>
                      <td>{row.orders}</td>
                      <td>{row.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}