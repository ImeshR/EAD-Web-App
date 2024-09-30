import React from 'react'

export default function OrdersContent() {
  const orders = [
    { id: 1001, customer: 'John Doe', status: 'Processing', statusColor: 'info', total: '$59.99' },
    { id: 1002, customer: 'Jane Smith', status: 'Ready', statusColor: 'success', total: '$89.99' },
    { id: 1003, customer: 'Bob Johnson', status: 'Pending', statusColor: 'secondary', total: '$34.99' }
  ]

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
                <button className="btn btn-sm btn-outline-primary me-2">View Details</button>
                {order.status === 'Ready' ? (
                  <button className="btn btn-sm btn-outline-info">Mark as Delivered</button>
                ) : (
                  <button className="btn btn-sm btn-outline-success">Mark as Ready</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
