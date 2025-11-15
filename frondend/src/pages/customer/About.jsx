import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/about.css';

const About = () => {
  return (
    <div className="about-wrapper">
      {/* Header Component */}
      <Header />

      {/* Hero Section - First Row */}
      <section className="about-hero-section">
        <div className="hero-content">
          <div className="hero-image-container">
            <img src="/images/about.png" alt="Tailored Suit" className="hero-image" />
          </div>
          <div className="hero-overlay">
            <div className="brand-story-hero">
              <h2>Brand Story</h2>
              <p>
                At Tailor's Lab, our journey began with a vision to create suits that are a perfect blend of expression of oneself, while respecting the exquisite tradition of tailor-made clothing. Discovering your uniqueness and modern tailoring can be.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Cards Section - Second Row */}
      <section className="about-cards-section">
        <div className="cards-row">
          <div className="card-col">
            <div className="about-card">
              <div className="card-image">
                <img src="/images/whyus.png" alt="Brand Story" />
              </div>
            </div>
          </div>
          <div className="card-col">
            <div className="about-card text-card">
              <h3>Our Values</h3>
              <p>
                Tailor's Lab was born from a vision to blend premium tailoring with sustainable practices. We fuse traditional craftsmanship and contemporary technology to create garments for quality-conscious, ethically-minded individuals.
              </p>
              <p>
                Our journey is about more than fashion—it's about empowering personal expression while driving change in the industry, with items that are as durable as they are elegant.
              </p>
            </div>
          </div>
          <div className="card-col">
            <div className="about-card text-card">
              <h3>Tailoring Heritage</h3>
              <p>
                We at Tailor's Lab, a design house established in 2015, bring a fresh perspective to the craft of bespoke suits. With a team of visionary tailors who blend style with a customer's story for that perfect fit—like you've always owned it.
              </p>
              <p>
                Our commitment goes beyond ordinary tailoring—from precision measurements to the finest fabrics, we create pieces that are truly yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default About;
