import React from 'react';
import { useState } from 'react';
import { AlertCircle, Home, BarChart2, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-xl font-bold text-green-700">CarbonLedger</h1>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center p-2 text-gray-700 hover:bg-green-50 rounded-lg ${
                    location.pathname === '/' ? 'bg-green-50' : ''
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/energy-usage" 
                  className={`flex items-center p-2 text-gray-700 hover:bg-green-50 rounded-lg ${
                    location.pathname === '/energy-usage' ? 'bg-green-50' : ''
                  }`}
                >
                  <BarChart2 className="w-5 h-5 mr-3" />
                  <span>Energy Usage</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className={`flex items-center p-2 text-gray-700 hover:bg-green-50 rounded-lg ${
                    location.pathname === '/settings' ? 'bg-green-50' : ''
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <button className="flex items-center w-full p-2 text-gray-700 hover:bg-red-50 rounded-lg">
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/energy-usage' && 'Energy Usage'}
              {location.pathname === '/settings' && 'Settings'}
            </h2>
          </div>
        </header>
        
        <main className="p-6">
          {!isAuthenticated ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-medium">Welcome to CarbonLedger</h3>
                  <p className="text-gray-600">Please sign in to view your energy usage data</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Sign in with Google
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Sign in with Facebook
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Sign in with Microsoft
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;