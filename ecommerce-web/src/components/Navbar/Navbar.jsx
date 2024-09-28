import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/dashboard">E-commerce</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/users">User Management</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/products">Product Management</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/orders">Order Management</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
