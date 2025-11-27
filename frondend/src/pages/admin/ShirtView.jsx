import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/admin/ShirtView.css';
import api from '../../Api';

const ShirtView = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Suits');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');

  const endpointMap = {
    Suits: '/admin/get-all-suits',
    Shirts: '/admin/get-all-shirts',
    Trousers: '/admin/get-all-trousers'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      setDeleteStatus('');
      try {
        const response = await api.get(endpointMap[activeSection]);
        setProducts(response.data || []);
      } catch (err) {
        const message = err?.response?.data?.error || 'Failed to load products.';
        setError(message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeSection]);

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      setDeleteStatus('');
      await api.delete(`/admin/delete-product/${id}`);
      setDeleteStatus('Product deleted successfully.');

      // Remove from local state so UI updates without refetch
      setProducts((prev) => prev.filter((item) => item.product_id !== id));
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to delete product.';
      setDeleteStatus(message);
    }
  };

  const handleEdit = (id) => {
    if (!id) return;
    navigate(`/admin/add-product/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    window.history.replaceState(null, '', '/');
    navigate('/', { replace: true });
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
              onClick={() => setActiveSection('Suits')}
            >
              Suits
            </div>
            <div 
              className={`nav-item ${activeSection === 'Shirts' ? 'active' : ''}`}
              onClick={() => setActiveSection('Shirts')}
            >
              Shirts
            </div>
            <div 
              className={`nav-item ${activeSection === 'Trousers' ? 'active' : ''}`}
              onClick={() => setActiveSection('Trousers')}
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

          {deleteStatus && (
            <p className="status-text">{deleteStatus}</p>
          )}

          <div className="admin-table-container">
            {loading ? (
              <p className="status-text">Loading {activeSection.toLowerCase()}...</p>
            ) : error ? (
              <p className="status-text error-text">{error}</p>
            ) : products.length === 0 ? (
              <p className="status-text">No {activeSection.toLowerCase()} found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Code (SKU)</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr key={item.product_id || index}>
                      <td>{index + 1}</td>
                      <td>{item.pro_code || 'N/A'}</td>
                      <td>{item.name}</td>
                      <td>
                        {typeof item.price === 'number'
                          ? `$${Number(item.price).toFixed(2)}`
                          : item.price}
                      </td>
                      <td>{Number(item.total_quantity ?? 0)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(item.product_id)}
                            aria-label="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(item.product_id)}
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
            )}
          </div>
        </Container>
      </main>
    </div>
  );
};

export default ShirtView;

