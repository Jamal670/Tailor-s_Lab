import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from 'react-icons/fa';
import '../../assets/css/footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <Container fluid className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src="/images/brandlogo.png" alt="Tailor Lab Logo" />
            </div>
            <p className="footer-tagline">
              Tailors Lab is a designer brand with a conscience,<br />
              built for those who value design, responsibility,<br />
              and the courage to stand apart.
            </p>
          </div>
          
          <div className="footer-center">
            <div className="footer-links-column">
              <h4 className="footer-heading">MEN'S CLOTHING</h4>
              <ul className="footer-links">
                <li><a href="/suits">Suits</a></li>
                <li><a href="/shirts">Shirts</a></li>
                <li><a href="/trousers">Trousers</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4 className="footer-heading">COMPANY</h4>
              <ul className="footer-links">
                <li><a href="/about">About Us</a></li>
                <li><a href="#">Refund & Returns Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyrights">
            ©2025 TailorsLab. All Rights Reserved.
          </div>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="social-icon" aria-label="Pinterest"><FaPinterestP /></a>
            <a href="#" className="social-icon" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;