import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';

const NotFound = () => {
  return (
    <div>
      <Header />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: '0 20px',
        textAlign: 'center',
        color: '#ffffff',
        marginTop: '120px'
      }}>
        <h1 style={{
          fontSize: '120px',
          fontWeight: '700',
          margin: '0',
          fontFamily: '"Bodoni Moda SC", serif',
          letterSpacing: '5px',
          color: '#a64d79'
        }}>404</h1>
        
        <h2 style={{
          fontSize: '32px',
          fontWeight: '600',
          margin: '20px 0',
          fontFamily: '"Inter", sans-serif'
        }}>Page Not Found</h2>
        
        <p style={{
          fontSize: '18px',
          maxWidth: '600px',
          lineHeight: '1.6',
          marginBottom: '30px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontFamily: '"Montserrat", sans-serif'
        }}>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <Link to="/" style={{
          display: 'inline-block',
          padding: '15px 30px',
          backgroundColor: '#000000',
          color: '#ffffff',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          border: '1px solid #000000',
          fontFamily: '"Montserrat", sans-serif'
        }}>
          Return to Homepage
        </Link>
        
        <div style={{
          marginTop: '50px',
          width: '100%',
          maxWidth: '700px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)'
        }}></div>
        
        <div style={{
          marginTop: '30px',
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: '"Montserrat", sans-serif'
        }}>
          <p>Need assistance? <Link to="/contact" style={{
            color: '#a64d79',
            textDecoration: 'none',
            fontWeight: '600'
          }}>Contact our support team</Link></p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
