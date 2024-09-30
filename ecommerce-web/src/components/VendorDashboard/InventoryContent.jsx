import React from 'react'

export default function InventoryContent() {
  const inventory = [
    { product: 'Product 1', stock: 50, status: 'In Stock', badgeColor: 'success' },
    { product: 'Product 2', stock: 5, status: 'Low Stock', badgeColor: 'warning' },
    { product: 'Product 3', stock: 0, status: 'Out of Stock', badgeColor: 'danger' }
  ]

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
                <button className="btn btn-sm btn-outline-primary">Update Stock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
