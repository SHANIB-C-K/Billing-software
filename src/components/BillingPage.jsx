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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-12 bg-white rounded-2xl shadow-lg p-10 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-blue-600 mb-3">Smart Bill</h1>
          <p className="text-gray-600 text-lg">Professional Billing Made Simple</p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                placeholder="Enter item name"
                value={formData.itemName}
                onChange={handleItemNameChange}
                className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 hover:border-blue-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleQuantityChange}
                className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 hover:border-blue-300"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handlePriceChange}
                className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 hover:border-blue-300"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>Add Item</span>
              </button>
            </div>
          </form>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg">No items added yet</p>
                <p className="text-gray-400 text-sm mt-2">Add your first item using the form above</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{item.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${item.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-8">
            <div className="bg-blue-50 px-6 py-4 rounded-xl mb-6 md:mb-0">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-blue-900">${calculateTotal().toFixed(2)}</p>
            </div>
            <div className="flex gap-4">
              <button 
                className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
                onClick={handleGenerateBill}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                <span>Generate Bill</span>
              </button>
              <button 
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
                onClick={handlePrint}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage