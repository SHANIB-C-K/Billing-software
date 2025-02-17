import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to Smart Bill</h1>
        <p className="hero-subtitle">The Modern Solution for Your Billing Needs</p>
        <div className="hero-buttons">
          <Link to="/billing" className="primary-button">Create New Bill</Link>
          <Link to="/history" className="secondary-button">View History</Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Smart Bill?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Fast & Easy</h3>
            <p>Create professional bills in seconds</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3>Responsive Design</h3>
            <p>Works perfectly on all devices</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💾</span>
            <h3>Auto-Save</h3>
            <p>Never lose your work again</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Analytics</h3>
            <p>Track your business growth</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of businesses using Smart Bill</p>
        <Link to="/billing" className="cta-button">Start Creating Bills Now</Link>
      </section>
    </div>
  )
}

export default Home 