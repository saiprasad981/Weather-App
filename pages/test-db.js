import { useState } from 'react';
import connectDB from '../lib/database';
import User from '../models/User';

export default function TestDB() {
  const [message, setMessage] = useState('');

  const addSampleData = async () => {
    try {
      const response = await fetch('/api/test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMessage('✅ Sample data added! Check MongoDB Atlas Collections tab.');
      console.log('Data:', data);
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  const viewData = async () => {
    try {
      const response = await fetch('/api/test-data');
      const data = await response.json();
      setMessage('📊 Users: ' + JSON.stringify(data.users));
      console.log('Users:', data.users);
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <div className="space-x-4 mb-4">
        <button 
          onClick={addSampleData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Sample Data
        </button>
        <button 
          onClick={viewData}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          View Data
        </button>
      </div>
      {message && <p className="mt-4 p-4 bg-white rounded">{message}</p>}
    </div>
  );
}