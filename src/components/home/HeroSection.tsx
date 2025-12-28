import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Banknote, Calendar, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('rent');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const getPropertyTypes = () => {
    switch (mode) {
      case 'rent':
        return [
          { value: '', label: 'Any Type' },
          { value: 'house', label: 'House' },
          { value: 'apartment', label: 'Apartment' },
          { value: 'room', label: 'Room' },
          { value: 'office', label: 'Office Space' },
          { value: 'shop', label: 'Shop/Retail' },
        ];
      case 'buy':
        return [
          { value: '', label: 'Any Type' },
          { value: 'house', label: 'House' },
          { value: 'land', label: 'Land/Plot' },
          { value: 'commercial', label: 'Commercial Property' },
        ];
      case 'short-stay':
        return [
          { value: '', label: 'Any Type' },
          { value: 'bnb', label: 'BnB / Guest House' },
          { value: 'lodge', label: 'Lodge' },
          { value: 'hotel', label: 'Hotel Room' },
          { value: 'vacation_home', label: 'Vacation Home' },
        ];
      default:
        return [
          { value: '', label: 'Any Type' },
          { value: 'house', label: 'House' },
          { value: 'apartment', label: 'Apartment' },
        ];
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      const params = new URLSearchParams();
      if (mode) params.set('mode', mode);
      if (location) params.set('location', location);
      if (propertyType) params.set('type', propertyType);
      if (maxPrice) params.set('maxPrice', maxPrice);

      navigate(`/properties?${params.toString()}`);
      setIsSearching(false);
    }, 600);
  };

  const stats = [
    { icon: Home, label: '5,000+ Properties', color: 'text-blue-400' },
    { icon: Shield, label: 'Verified Listings', color: 'text-emerald-400' },
    { icon: Clock, label: '24/7 Support', color: 'text-purple-400' },
  ];

  return (
    <div className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-e32c8ecfe2ea?q=80&w=2070&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900 z-0" />

      {/* Content */}
      <div className="relative z-10 container px-4 py-16 md:px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Content */}
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 backdrop-blur-md px-5 py-2 border border-white/10 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-white">Malawi's #1 Property Marketplace</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl leading-tight">
              Find Your Dream Home
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 animate-gradient">
                Without the Hassle
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Browse thousands of verified rentals, short-stays, and properties for sale across
              <span className="font-semibold text-white"> Lilongwe, Blantyre, and Mzuzu</span>.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm font-semibold text-white">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Search Widget */}
          <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            {/* Search Mode Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {[
                { id: 'rent', label: 'Rent', icon: Home, desc: 'Long-term rentals' },
                { id: 'buy', label: 'Buy', icon: Banknote, desc: 'Properties for sale' },
                { id: 'short-stay', label: 'Short Stay', icon: Calendar, desc: 'Hotels & BnBs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMode(tab.id);
                    setPropertyType('');
                  }}
                  className={`group relative flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${mode === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-900/40 scale-105'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white hover:scale-105'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-bold">{tab.label}</div>
                    <div className={`text-xs ${mode === tab.id ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {tab.desc}
                    </div>
                  </div>
                  {mode === tab.id && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Input */}
                <div className="relative group">
                  <label className="block text-xs font-bold text-slate-300 mb-2 ml-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g., Area 10, City Centre"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:bg-white/15 focus:border-blue-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Property Type Select */}
                <div className="relative group">
                  <label className="block text-xs font-bold text-slate-300 mb-2 ml-1">
                    Property Type
                  </label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors pointer-events-none z-10" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white focus:bg-white/15 focus:border-blue-400 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      {getPropertyTypes().map((type) => (
                        <option key={type.value} value={type.value} className="bg-slate-800 text-white">
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Price Input */}
                <div className="relative group md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-2 ml-1">
                    Maximum Price (MK)
                  </label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <input
                      type="number"
                      placeholder="Enter your budget"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:bg-white/15 focus:border-blue-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full py-5 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-none shadow-2xl shadow-blue-900/40 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {isSearching ? (
                  <>
                    <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Search Properties</span>
                    <span className="ml-auto px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                      {location || propertyType || maxPrice ? 'Custom' : 'All'}
                    </span>
                  </>
                )}
              </button>

              {/* Quick Search Hints */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="text-xs text-slate-400">Popular:</span>
                {['Area 10', 'City Centre', 'Namiwawa'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-slate-300 hover:text-white transition-all"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center text-sm text-slate-400 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>All listings verified</span>
              <span className="text-slate-600">•</span>
              <span>No hidden fees</span>
              <span className="text-slate-600">•</span>
              <span>Direct owner contact</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}