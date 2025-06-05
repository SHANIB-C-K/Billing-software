import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

function HistoryPage() {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, amount, items
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterDate, setFilterDate] = useState("all"); // all, today, week, month

  useEffect(() => {
    // Load bills from localStorage on component mount
    const savedBills = localStorage.getItem("bills");
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("desc");
    }
  };

  const handleDateFilter = (filter) => {
    setFilterDate(filter);
  };

  const getFilteredBills = () => {
    let filtered = [...bills];

    // Apply date filter
    const now = new Date();
    switch (filterDate) {
      case "today":
        filtered = filtered.filter((bill) => {
          const billDate = new Date(bill.date);
          return billDate.toDateString() === now.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter((bill) => new Date(bill.date) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filtered = filtered.filter((bill) => new Date(bill.date) >= monthAgo);
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (bill) =>
          bill.items.some((item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          bill.billNumber.toString().includes(searchTerm) ||
          bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case "amount":
          comparison = b.totalAmount - a.totalAmount;
          break;
        case "items":
          comparison = b.items.length - a.items.length;
          break;
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });

    return filtered;
  };

  const handleDeleteBill = (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      const updatedBills = bills.filter((bill) => bill.id !== billId);
      setBills(updatedBills);
      localStorage.setItem("bills", JSON.stringify(updatedBills));
    }
  };

  const regeneratePDF = (bill) => {
    const doc = new jsPDF();

    // Add header
    doc.setFillColor(52, 144, 220);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Smart Bill", 105, 25, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Add bill details
    doc.setFontSize(12);
    doc.text("Invoice #: " + bill.billNumber, 20, 50);
    doc.text("Date: " + new Date(bill.date).toLocaleDateString(), 20, 60);
    if (bill.customerName) {
      doc.text("Customer: " + bill.customerName, 20, 70);
    }

    // Add items table
    let yPos = 90;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 10, 170, 10, "F");

    // Set font before writing table headers to ensure they're visible
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Item", 25, yPos - 2);
    doc.text("Qty", 85, yPos - 2);
    doc.text("Price", 125, yPos - 2);
    doc.text("Total", 165, yPos - 2);

    // Reset font for table content
    doc.setFont(undefined, "normal");

    bill.items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(20, yPos, 170, 10, "F");
      }
      doc.text(item.itemName, 25, yPos + 5);
      doc.text(item.quantity.toString(), 85, yPos + 5);
      doc.text("$" + item.price.toFixed(2), 125, yPos + 5);
      doc.text("$" + item.total.toFixed(2), 165, yPos + 5);
      yPos += 10;
    });

    // Add total
    doc.setDrawColor(52, 144, 220);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 10, 190, yPos + 10);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Total Amount:", 130, yPos + 25);
    doc.text("$" + bill.totalAmount.toFixed(2), 165, yPos + 25);

    doc.save(
      `bill-${
        bill.billNumber
      }-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing History</h1>
              <p className="text-gray-500">View and manage your past invoices</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search bills..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </div>
              
              <select
                value={filterDate}
                onChange={(e) => handleDateFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            {getFilteredBills().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-xl mb-2">No bills found</p>
                <p className="text-gray-400 text-sm max-w-md">
                  {searchTerm ? "Try changing your search term or filter" : "Start creating bills to see them here"}
                </p>
                {!searchTerm && (
                  <Link to="/billing" className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Bill
                  </Link>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {sortBy === "date" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Bill Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("items")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Items</span>
                        {sortBy === "items" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Total Amount</span>
                        {sortBy === "amount" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getFilteredBills().map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-medium">
                          #{bill.billNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {bill.customerName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                          {bill.items.length} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        ${bill.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3">
                          <button
                            onClick={() => regeneratePDF(bill)}
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center space-x-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill.id)}
                            className="text-red-600 hover:text-red-900 transition-colors flex items-center space-x-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Invoices</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{bills.length}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${bills.reduce((sum, bill) => sum + bill.totalAmount, 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Avg. Invoice Value</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${bills.length > 0 
                ? (bills.reduce((sum, bill) => sum + bill.totalAmount, 0) / bills.length).toFixed(2) 
                : '0.00'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Per invoice</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
