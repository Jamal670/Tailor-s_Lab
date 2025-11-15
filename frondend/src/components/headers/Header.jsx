import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoBag } from "react-icons/io5";
import '../../assets/css/header.css';
import Cart from '../cart/Cart';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sample cart items for demonstration
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Active-T-Shirt - Black, M",
      image: "/images/Trouser.png",
      price: 18.00,
      quantity: 1
    }
  ]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCollectionClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If already on home page, just scroll to collection
      const collectionSection = document.getElementById('collection');
      if (collectionSection) {
        collectionSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home with state to indicate we should scroll to collection
      navigate('/', { state: { scrollToCollection: true } });
    }
  };

  return (
    <header className="header">
      <Container fluid className="px-4">
        <div className="header-container">
          <div className="logo-container">
            <Link to="/">
            <img src="/images/brandlogo.png" alt="Tailor Lab Logo" className="logo-img" />
            </Link>
          </div>
          <div className="nav-container">
            <nav className="main-nav">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="/" onClick={handleCollectionClick}>Collection</a></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </nav>
            <div className="cart-icon">
              <button onClick={toggleCart} className="cart-button">
                <IoBag size={24} />
              </button>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Cart sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} />
      
      {/* Overlay when cart is open */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      ></div>
    </header>
  );
};

export default Header;
