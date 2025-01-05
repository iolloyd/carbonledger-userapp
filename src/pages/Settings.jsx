import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAuthStore } from '../stores/auth';

const UK_REGIONS = [
  'London',
  'South East',
  'South West',
  'East of England',
  'West Midlands',
  'East Midlands',
  'Yorkshire',
  'North West',
  'North East',
  'Wales',
  'Scotland',
  'Northern Ireland'
];

const Settings = () => {
  const authStore = useAuthStore();
  const [formData, setFormData] = useState({
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    region: authStore.user?.region || '',
    address: authStore.user?.address || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authStore.updateProfile(formData);
      // TODO: Add success toast notification
      console.log('Profile updated successfully');
    } catch (error) {
      // TODO: Add error toast notification
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Select a region</option>
              {UK_REGIONS.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Building Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Enter your building address"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Device Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Energy Monitor Device</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="device-id" className="block text-sm font-medium text-gray-700">
              Device ID
            </label>
            <input
              type="text"
              id="device-id"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Enter device ID"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Installation Location
            </label>
            <input
              type="text"
              id="location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g., Main Building"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Settings;
