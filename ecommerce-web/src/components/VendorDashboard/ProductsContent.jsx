import React from 'react'

export default function ProductsContent() {
  const products = [
    { name: 'Product 1', category: 'Category A', price: '$19.99' },
    { name: 'Product 2', category: 'Category B', price: '$24.99' },
    { name: 'Product 3', category: 'Category A', price: '$14.99' }
  ]

  return (
    <div>
      <h2 className="mt-4">My Products</h2>
      <button className="btn btn-primary mb-3">Create New Product</button>
      <table className="table table-striped">
        <thead className="bg-info text-white">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                <button className="btn btn-sm btn-outline-danger">Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
