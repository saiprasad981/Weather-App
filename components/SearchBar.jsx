import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const SearchBar = ({ onSearch, loading = false }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        placeholder="🔍 Enter city name (e.g., London, Tokyo)..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg text-lg py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      />
      <Button 
        type="submit" 
        disabled={loading || !city.trim()}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Searching...
          </span>
        ) : (
          'Get Weather'
        )}
      </Button>
    </form>
  );
};