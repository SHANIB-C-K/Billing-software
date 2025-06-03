import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Smart</span> Bill
          </h1>
          <p className="hero-subtitle">Streamline Your Billing Process with Intelligence</p>
          <div className="hero-buttons">
            <Link to="/billing" className="primary-button">
              <span className="button-icon">+</span>
              Create New Bill
            </Link>
            <Link to="/history" className="secondary-button">
              <span className="button-icon">📋</span>
              View History
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="blob-shape"></div>
          <img src="/assets/billing-illustration.svg" alt="Billing Illustration" />
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose Smart Bill?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">⚡</span>
            </div>
            <h3>Lightning Fast</h3>
            <p>Create professional bills in seconds with our intuitive interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🎯</span>
            </div>
            <h3>Smart Templates</h3>
            <p>Choose from professionally designed templates for every need</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🔒</span>
            </div>
            <h3>Secure Storage</h3>
            <p>Your data is automatically saved and securely stored</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📊</span>
            </div>
            <h3>Rich Analytics</h3>
            <p>Gain valuable insights with detailed business analytics</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="section-title">Ready to Transform Your Billing?</h2>
          <p className="cta-description">Join thousands of businesses that trust Smart Bill for their invoicing needs</p>
          <Link to="/billing" className="cta-button">
            Get Started Now
            <span className="button-arrow">→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 