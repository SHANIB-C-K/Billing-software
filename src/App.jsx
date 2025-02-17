import { useState } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 1,
    price: 0
  })

  const addItem = (e) => {
    e.preventDefault()
    if (!formData.itemName || !formData.quantity || !formData.price) return
    
    setItems([...items, {
      id: Date.now(),
      ...formData,
      total: formData.quantity * formData.price
    }])
    
    setFormData({
      itemName: '',
      quantity: 1,
      price: 0
    })
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  return (
    <div className="billing-container">
      <header className="billing-header">
        <h1>🧾 Smart Bill</h1>
        <p className="subtitle">Simple & Beautiful Billing Software</p>
      </header>

      <div className="billing-content">
        <form onSubmit={addItem} className="item-form">
          <input
            type="text"
            placeholder="Item name"
            value={formData.itemName}
            onChange={(e) => setFormData({...formData, itemName: e.target.value})}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
            className="form-input"
            min="1"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            className="form-input"
            min="0"
            step="0.01"
          />
          <button type="submit" className="add-button">Add Item</button>
        </form>

        <div className="items-list">
          {items.length === 0 ? (
            <p className="empty-message">No items added yet</p>
          ) : (
            <>
              <div className="items-header">
                <span>Item</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Total</span>
                <span>Action</span>
              </div>
              {items.map(item => (
                <div key={item.id} className="item-row">
                  <span>{item.itemName}</span>
                  <span>{item.quantity}</span>
                  <span>${item.price.toFixed(2)}</span>
                  <span>${item.total.toFixed(2)}</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="bill-summary">
          <div className="total-amount">
            <h2>Total Amount:</h2>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <button className="generate-bill-button">
            Generate Bill
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
