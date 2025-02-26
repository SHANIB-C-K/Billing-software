import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../styles/Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    taxRate: 10,
    currency: "USD",
    emailNotifications: true,
    autoSave: true,
    darkMode: false,
    language: "en",
    invoicePrefix: "INV-",
    paymentTerms: 30,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("smartBillSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply dark mode when it changes
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-save if enabled
    if (settings.autoSave) {
      const newSettings = {
        ...settings,
        [name]: type === "checkbox" ? checked : value,
      };
      localStorage.setItem("smartBillSettings", JSON.stringify(newSettings));
      toast.success("Settings auto-saved");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("smartBillSettings", JSON.stringify(settings));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error("Settings save error:", error);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      companyName: "",
      companyAddress: "",
      companyEmail: "",
      companyPhone: "",
      taxRate: 10,
      currency: "USD",
      emailNotifications: true,
      autoSave: true,
      darkMode: false,
      language: "en",
      invoicePrefix: "INV-",
      paymentTerms: 30,
    };
    setSettings(defaultSettings);
    localStorage.setItem("smartBillSettings", JSON.stringify(defaultSettings));
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Company Information Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={settings.companyEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Company Phone
                </label>
                <input
                  type="tel"
                  name="companyPhone"
                  value={settings.companyPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Company Address
                </label>
                <textarea
                  name="companyAddress"
                  value={settings.companyAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                />
              </div>
            </div>
          </section>

          {/* Billing Settings Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Billing Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Invoice Prefix
                </label>
                <input
                  type="text"
                  name="invoicePrefix"
                  value={settings.invoicePrefix}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Payment Terms (days)
                </label>
                <input
                  type="number"
                  name="paymentTerms"
                  value={settings.paymentTerms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                />
              </div>
            </div>
          </section>

          {/* Application Settings Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Application Settings
            </h2>

            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-200"
                />
                <label className="ml-3 text-sm text-gray-600">
                  Enable Email Notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="autoSave"
                  checked={settings.autoSave}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-200"
                />
                <label className="ml-3 text-sm text-gray-600">
                  Enable Auto-Save
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-200"
                />
                <label className="ml-3 text-sm text-gray-600">Dark Mode</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition duration-200"
            >
              Reset to Defaults
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
