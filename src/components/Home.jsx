import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl shadow-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>
          <div className="absolute inset-0 bg-[url('/assets/billing-illustration.svg')] opacity-10 bg-no-repeat bg-right-bottom"></div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-16">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                <span className="block">Simplify Your</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">Billing Process</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-lg">
                Create professional invoices, track payments, and manage clients all in one powerful solution.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/billing" className="group flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span>Create New Bill</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link to="/history" className="flex items-center justify-center px-8 py-4 bg-transparent text-white border border-white/30 backdrop-blur-sm font-medium rounded-xl hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  View History
                </Link>
              </div>
              
              <div className="mt-10 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-${300 + i*100} flex items-center justify-center text-white font-bold text-xs`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-blue-100">
                  <span className="font-bold text-white">500+</span> businesses trust us
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-2xl transform rotate-3 scale-105 opacity-30 animate-pulse"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/50 transform transition-all duration-500 hover:-rotate-1 hover:scale-[1.01]">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Smart Bill</h3>
                      <p className="text-gray-500">Invoice #SB-2023-0567</p>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Paid
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-gray-700">Service Item {item}</span>
                        </div>
                        <span className="font-medium">${(item * 49.99).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-gray-500 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-800">$149.97</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 px-8 py-6 bg-white/10 backdrop-blur-sm border-t border-white/20">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-white/80">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lightning Fast Setup</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Beautiful Templates</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secure Storage</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>PDF Export</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose Smart Bill?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mb-4 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Create professional bills in seconds with our intuitive interface</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mb-4 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Storage</h3>
              <p className="text-gray-600">Your data is automatically saved and securely stored locally</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mb-4 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Time-Saving</h3>
              <p className="text-gray-600">Reduce billing time by up to 80% with templates and automation</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mb-4 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Beautiful PDFs</h3>
              <p className="text-gray-600">Generate professional, branded invoices with just one click</p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mt-12 -mr-12 opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -mb-8 -ml-8 opacity-10"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Billing?</h2>
            <p className="text-blue-100 text-lg mb-8">Join thousands of businesses that trust Smart Bill for their invoicing needs</p>
            
            <Link to="/billing" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Get Started Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home 