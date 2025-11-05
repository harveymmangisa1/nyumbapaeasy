import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const popularSearches = [
    "Apartments in Lilongwe",
    "Houses for rent in Blantyre",
    "Commercial properties",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
  };

  const quickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(new Event('submit', { cancelable: true }));
  };

  return (
    <div className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center bg-primary">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2073&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
      
      <div className="relative container text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-surface tracking-tight mb-4">
          Find Your <span className="text-accent">Perfect Home</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Discover quality properties across Malawi with our intelligent search.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="bg-surface/10 backdrop-blur-md rounded-2xl border border-surface/20 p-4 md:p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by district, area, or property..."
                    className="input w-full pl-12 pr-4 py-3 rounded-lg bg-surface/10 text-surface placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button type="submit" className="btn btn-primary px-8 py-3 text-base">
                  Search
                </button>
              </div>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 animate-in fade-in duration-300">
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input bg-surface/10 text-surface border-0 focus:ring-2 focus:ring-accent">
                    <option value="">Any Type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                  </select>
                  <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="input bg-surface/10 text-surface border-0 focus:ring-2 focus:ring-accent">
                    <option value="">Any Beds</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                  </select>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max Price (MK)"
                    className="input bg-surface/10 text-surface border-0 focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  {showAdvanced ? 'Hide Filters' : 'More Filters'}
                </button>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-300">
                  <span>Popular:</span>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => quickSearch(search)}
                      className="hover:text-accent transition-colors underline-offset-2 hover:underline">
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
