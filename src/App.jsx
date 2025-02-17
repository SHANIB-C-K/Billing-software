import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import BillingPage from './components/BillingPage'
import HistoryPage from './components/HistoryPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
