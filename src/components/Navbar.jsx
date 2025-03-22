import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <span className="nav-logo">🧾</span>
          <span className="nav-title">Smart Bill</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/billing" className="nav-link">Create Bill</Link>
        <Link to="/history" className="nav-link">History</Link>
        {/* <Link to="/settings" className="nav-link">Settings</Link> */}
      </div>
    </nav>
  )
}

export default Navbar 