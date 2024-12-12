import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Example data - this would come from your API
  const data = [
    { date: '2023-12-01', usage: 240, cost: 48 },
    { date: '2023-12-02', usage: 300, cost: 60 },
    { date: '2023-12-03', usage: 280, cost: 56 },
    { date: '2023-12-04', usage: 260, cost: 52 },
    { date: '2023-12-05', usage: 320, cost: 64 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Today's Usage</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">320 kWh</p>
          <p className="mt-1 text-sm text-green-600">↓ 12% from yesterday</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Current Cost</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$64.00</p>
          <p className="mt-1 text-sm text-red-600">↑ 8% from market average</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Carbon Footprint</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">156 kg</p>
          <p className="mt-1 text-sm text-gray-600">CO₂ equivalent</p>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Energy Usage Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="usage" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Comparison */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Market Rate Comparison</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 text-sm text-gray-500">Your Rate:</span>
            <span className="text-sm font-medium text-gray-900">$0.20/kWh</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm text-gray-500">Market Average:</span>
            <span className="text-sm font-medium text-gray-900">$0.185/kWh</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm text-gray-500">Lowest Available:</span>
            <span className="text-sm font-medium text-green-600">$0.175/kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;