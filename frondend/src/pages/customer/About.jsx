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
                We are Tailors Lab. A design house where suits are redefined, created with a spirit of originality and purpose.
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
                Our mission extends beyond clothing. By working with skilled artisans in communities where employment creates lasting impact, we help sustain livelihoods and preserve craftsmanship. Each suit carries not only the mark of design innovation, but also the story of giving back.
              </p>
              <p>
                Tailors Lab is a designer brand with a conscience , built for those who value design, responsibility, and the courage to stand apart.
              </p>
            </div>
          </div>
          <div className="card-col">
            <div className="about-card text-card">
              <h3>Tailoring Heritage</h3>
              <p>
                We are Tailors Lab. A design house where suits are redefined, created with a spirit of originality and purpose. Tailors Lab is a designer brand with a conscience , built for those who value design, responsibility, and the courage to stand apart.
              </p>
              <p>
                At Tailors Lab, we redefine the suit. We are not bound by tradition, nor do we follow the path of imitation.
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
