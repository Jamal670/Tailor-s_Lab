import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/contactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your message. We will get back to you soon!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    });
  };

  return (
    <div className="contact-us-wrapper">
      {/* Header Component */}
      <Header />

      {/* Page Title */}
      <section className="page-title-section">
        <Container>
          <h1 className="page-title">Contact Us</h1>
        </Container>
      </section>

      {/* Breadcrumb Navigation */}
      <section className="breadcrumb-section">
        <Container>
          <div className="breadcrumb-nav">
            <div className="breadcrumb-links">
              <a href="/">Home</a> <span className="separator">→</span> <span className="current-page">Contact Us</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="contact-content-section">
        <Container>
          <Row>
            <Col lg={5} md={6} className="contact-text-col">
              <div className="contact-text">
                <h2 className="contact-heading">Let us know how can we help?</h2>
              </div>
            </Col>
            <Col lg={7} md={6} className="contact-form-col">
              <div className="contact-form-container">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="formName">
                        <Form.Label className="form-labels" style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '0.9rem'  }}>Your Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          required 
                          style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="formEmail">
                        <Form.Label className="form-labels" style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '0.9rem' }}>Your Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          required 
                          style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="formPhone">
                        <Form.Label className="form-labels" style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '0.9rem' }}>Phone Number</Form.Label>
                        <Form.Control 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="formCompany">
                        <Form.Label className="form-labels" style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '0.9rem' }}>Company</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="company" 
                          value={formData.company} 
                          onChange={handleChange} 
                          style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-4" controlId="formMessage">
                    <Form.Label className="form-labels" style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '0.9rem' }}>Your Message</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                      style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                    />
                  </Form.Group>
                  <div className="text-start">
                    <Button type="submit" className="submit-button">
                      ASK A QUESTION
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ContactUs;
