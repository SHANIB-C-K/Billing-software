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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Billing History
            </h1>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={handleSearch}
                className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={filterDate}
                onChange={(e) => handleDateFilter(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date{" "}
                    {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("items")}
                  >
                    Items{" "}
                    {sortBy === "items" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    Total Amount{" "}
                    {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredBills().map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(bill.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{bill.billNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.customerName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${bill.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          onClick={() => regeneratePDF(bill)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {getFilteredBills().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bills found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
