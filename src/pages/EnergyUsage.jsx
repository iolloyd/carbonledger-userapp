import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EnergyUsage = () => {
  const [timeframe, setTimeframe] = useState('daily');
  
  // Example data - this would come from your API
  const data = {
    daily: [
      { time: '00:00', usage: 120 },
      { time: '04:00', usage: 80 },
      { time: '08:00', usage: 200 },
      { time: '12:00', usage: 280 },
      { time: '16:00', usage: 240 },
      { time: '20:00', usage: 180 },
    ],
    weekly: [
      { time: 'Mon', usage: 1200 },
      { time: 'Tue', usage: 1400 },
      { time: 'Wed', usage: 1100 },
      { time: 'Thu', usage: 1300 },
      { time: 'Fri', usage: 1500 },
      { time: 'Sat', usage: 900 },
      { time: 'Sun', usage: 800 },
    ],
    monthly: [
      { time: 'Jan', usage: 32000 },
      { time: 'Feb', usage: 28000 },
      { time: 'Mar', usage: 30000 },
      { time: 'Apr', usage: 34000 },
      { time: 'May', usage: 36000 },
      { time: 'Jun', usage: 40000 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'daily'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'weekly'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'monthly'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Energy Consumption</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data[timeframe]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Peak Usage Times</h4>
            <div className="space-y-2">
              {data[timeframe]
                .sort((a, b) => b.usage - a.usage)
                .slice(0, 3)
                .map((period, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{period.time}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {period.usage} kWh
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Efficiency Opportunities</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                • Reduce peak consumption during 12:00-16:00
              </li>
              <li className="text-sm text-gray-600">
                • Consider time-of-use pricing for better rates
              </li>
              <li className="text-sm text-gray-600">
                • Optimize nighttime base load
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyUsage;