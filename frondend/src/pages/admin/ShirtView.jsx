import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/admin/ShirtView.css';

const ShirtView = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Suits');
  
  // Sample data for suits
  const suitsData = [
    { id: 1, name: 'Chocolate Brown Cotton Suit', price: '$340.00', quantity: 10 },
    { id: 2, name: 'Classic Black Wool Suit', price: '$420.00', quantity: 15 },
    { id: 3, name: 'Navy Blue Pinstripe Suit', price: '$380.00', quantity: 8 },
    { id: 4, name: 'Gray Herringbone Suit', price: '$390.00', quantity: 12 },
  ];

  const handleDelete = (id) => {
    console.log('Delete item:', id);
    // Add delete logic here
  };

  const handleEdit = (id) => {
    console.log('Edit item:', id);
    // Add edit logic here
  };

  const handleLogout = () => {
    console.log('Logout');
    // Add logout logic here
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <img src="/images/brandlogo.png" alt="Tailor Lab Logo" />
          </div>
          
          <nav className="sidebar-nav">
            <div 
              className={`nav-item ${activeSection === 'Suits' ? 'active' : ''}`}
              onClick={() => navigate('/admin/shirt-view')}
            >
              Suits
            </div>
            <div 
              className={`nav-item ${activeSection === 'Shirts' ? 'active' : ''}`}
              onClick={() => navigate('/admin/shirt-view')}
            >
              Shirts
            </div>
            <div 
              className={`nav-item ${activeSection === 'Trousers' ? 'active' : ''}`}
              onClick={() => navigate('/admin/shirt-view')}
            >
              Trousers
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="logout-item" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <Container fluid className="admin-container">
          <div className="admin-header">
            <h1 className="section-heading">{activeSection}</h1>
            <button className="add-items-btn" onClick={() => navigate('/admin/add-product')}>
              Add product +
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {suitsData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(item.id)}
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default ShirtView;

