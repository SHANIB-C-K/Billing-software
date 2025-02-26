import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './components/Home'
import BillingPage from './components/BillingPage'
import HistoryPage from './components/HistoryPage'
import './App.css'
import Settings from './components/Settings'

function App() {
  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
