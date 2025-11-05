import React, { useState } from 'react';
import { Search, Bed, Building, DollarSign, Filter, X } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [listingType, setListingType] = useState('rent');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const popularSearches = [
    "Apartments in Lilongwe",
    "Houses for rent in Blantyre",
    "Commercial properties",
    "Student accommodation",
    "Luxury villas"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search logic here
    console.log({
      searchQuery,
      maxPrice,
      listingType,
      propertyType,
      bedrooms
    });
  };

  const quickSearch = (query) => {
    setSearchQuery(query);
    // Trigger search immediately
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-slate-900">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')`
          }}
        />
        
        <div className="relative container mx-auto px-4 py-20 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              Find Your 
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Perfect Home
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover quality properties across Malawi with our intelligent search
            </p>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => quickSearch(search)}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-slate-200 rounded-full text-sm hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40"
              >
                {search}
              </button>
            ))}
          </div>
          
          {/* Main Search Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 md:p-8 mb-8">
            {/* Listing Type Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-white/10 rounded-2xl w-fit mx-auto backdrop-blur-sm">
              {['rent', 'sale'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setListingType(type)}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    listingType === type
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {type === 'rent' ? 'Rent' : 'Buy'}
                </button>
              ))}
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Main Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by district, area, or property name..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/20 bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg backdrop-blur-sm"
                />
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                >
                  <Filter className="h-4 w-4" />
                  {showAdvanced ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              {/* Advanced Filters */}
              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm animate-in fade-in duration-300">
                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer"
                    >
                      <option value="" className="text-slate-900">Any Type</option>
                      <option value="house" className="text-slate-900">House</option>
                      <option value="apartment" className="text-slate-900">Apartment</option>
                      <option value="room" className="text-slate-900">Room</option>
                      <option value="commercial" className="text-slate-900">Commercial</option>
                    </select>
                  </div>
                  
                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Bed className="h-3 w-3" />
                      Bedrooms
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer"
                    >
                      <option value="" className="text-slate-900">Any</option>
                      <option value="1" className="text-slate-900">1+</option>
                      <option value="2" className="text-slate-900">2+</option>
                      <option value="3" className="text-slate-900">3+</option>
                      <option value="4" className="text-slate-900">4+</option>
                    </select>
                  </div>
                  
                  {/* Max Price */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Max Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">MK</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Any amount"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setPropertyType('');
                        setBedrooms('');
                        setMaxPrice('');
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
              
              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 text-lg transform hover:scale-[1.02]"
              >
                <Search className="h-5 w-5" />
                Search Properties
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;