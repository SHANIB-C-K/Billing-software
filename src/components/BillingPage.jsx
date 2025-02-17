import { useState } from 'react'
import { jsPDF } from 'jspdf'

function BillingPage() {
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

  const handleItemNameChange = (e) => {
    setFormData({...formData, itemName: e.target.value})
  }

  const handleQuantityChange = (e) => {
    setFormData({...formData, quantity: parseInt(e.target.value)})
  }

  const handlePriceChange = (e) => {
    setFormData({...formData, price: parseFloat(e.target.value)})
  }

  const generatePDFContent = () => {
    const doc = new jsPDF()
    
    // Add company logo/header
    doc.setFillColor(52, 144, 220)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.text('Smart Bill', 105, 25, { align: 'center' })
    
    // Reset text color
    doc.setTextColor(0, 0, 0)
    
    // Add invoice details
    doc.setFontSize(12)
    doc.text('Invoice #: ' + Date.now(), 20, 50)
    doc.text('Date: ' + new Date().toLocaleDateString(), 20, 60)
    
    // Add decorative line
    doc.setDrawColor(52, 144, 220)
    doc.setLineWidth(0.5)
    doc.line(20, 70, 190, 70)
    
    // Add table header with background
    doc.setFillColor(240, 240, 240)
    doc.rect(20, 80, 170, 10, 'F')
    doc.setFontSize(12)
    doc.text('Item', 25, 87)
    doc.text('Qty', 85, 87)
    doc.text('Price', 125, 87)
    doc.text('Total', 165, 87)
    
    // Add items
    let yPos = 100
    items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252)
        doc.rect(20, yPos-5, 170, 10, 'F')
      }
      doc.text(item.itemName, 25, yPos)
      doc.text(item.quantity.toString(), 85, yPos)
      doc.text('$' + item.price.toFixed(2), 125, yPos)
      doc.text('$' + item.total.toFixed(2), 165, yPos)
      yPos += 10
    })
    
    // Add total section
    doc.setDrawColor(52, 144, 220)
    doc.setLineWidth(0.5)
    doc.line(20, yPos+10, 190, yPos+10)
    
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Total Amount:', 130, yPos+25)
    doc.text('$' + calculateTotal().toFixed(2), 165, yPos+25)
    
    // Add footer
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(128, 128, 128)
    doc.text('Thank you for your business!', 105, yPos+40, { align: 'center' })

    return doc
  }

  const handleGenerateBill = () => {
    if (items.length === 0) {
      alert('Please add some items first!')
      return
    }

    // Create bill object
    const newBill = {
      id: Date.now(),
      billNumber: Math.floor(100000 + Math.random() * 900000), // 6-digit number
      date: new Date().toISOString(),
      items: items,
      totalAmount: calculateTotal(),
      customerName: '', // You can add a customer name input if needed
    }

    // Save to localStorage
    const savedBills = JSON.parse(localStorage.getItem('bills') || '[]')
    localStorage.setItem('bills', JSON.stringify([...savedBills, newBill]))

    // Generate PDF
    const doc = generatePDFContent()
    doc.save(`bill-${newBill.billNumber}.pdf`)

    // Clear items after generating bill
    setItems([])
  }

  const handlePrint = () => {
    if (items.length === 0) {
      alert('Please add some items first!')
      return
    }

    const doc = generatePDFContent()
    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url)
    
    printWindow.onload = () => {
      printWindow.print()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12 bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🧾 Smart Bill</h1>
          <p className="text-gray-600">Simple & Beautiful Billing Software</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <input
              type="text"
              placeholder="Item name"
              value={formData.itemName}
              onChange={handleItemNameChange}
              className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleQuantityChange}
              className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handlePriceChange}
              className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.01"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
          </form>

          <div className="overflow-x-auto">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No items added yet</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${item.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t pt-8">
            <div className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Total Amount: ${calculateTotal().toFixed(2)}
            </div>
            <div className="flex gap-4">
              <button 
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                onClick={handleGenerateBill}
              >
                <span className="mr-2">Generate Bill</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                onClick={handlePrint}
              >
                <span className="mr-2">Print Bill</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage