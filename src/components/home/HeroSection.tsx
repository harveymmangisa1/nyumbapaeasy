import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Home, Bed, Building, Users, ChevronDown } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';

const HeroSection: React.FC = () => {
  const { properties } = useProperties();
  const [districtQuery, setDistrictQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [listingType, setListingType] = useState<'rent' | 'sale' | ''>('rent');
  const [propertyType, setPropertyType] = useState<'house' | 'apartment' | 'room' | 'commercial' | ''>('');
  const [minRooms, setMinRooms] = useState<number | ''>('');
  const [counts, setCounts] = useState({
    lilongwe: 0,
    blantyre: 0,
    apartments: 0,
    houses: 0,
    rooms: 0,
  });

  const navigate = useNavigate();

  // Calculate counts for each category
  useEffect(() => {
    const lilongweCount = properties.filter((property) => property.district === 'Lilongwe').length;
    const blantyreCount = properties.filter((property) => property.district === 'Blantyre').length;
    const apartmentsCount = properties.filter((property) => property.type === 'apartment').length;
    const housesCount = properties.filter((property) => property.type === 'house').length;
    const roomsCount = properties.filter((property) => property.type === 'room').length;

    setCounts({
      lilongwe: lilongweCount,
      blantyre: blantyreCount,
      apartments: apartmentsCount,
      houses: housesCount,
      rooms: roomsCount,
    });
  }, [properties]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (districtQuery.trim()) params.set('district', districtQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (listingType) params.set('listingType', listingType);
    if (propertyType) params.set('propertyType', propertyType);
    if (minRooms) params.set('minRooms', minRooms.toString());

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-emerald-800 to-teal-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-blue-500/20 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-teal-500/30 blur-xl animate-pulse delay-500"></div>
      
      <div className="relative container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect Home in <span className="text-emerald-300">Malawi</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Discover the best properties for rent and sale across Lilongwe and Blantyre
          </p>
        </div>
        
        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-10 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Listing Type */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">I'm looking to</label>
              <div className="flex rounded-lg shadow-sm overflow-hidden">
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                    listingType === 'rent' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setListingType('rent')}
                >
                  Rent
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                    listingType === 'sale' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setListingType('sale')}
                >
                  Buy
                </button>
              </div>
            </div>
            
            {/* Property Type */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
                >
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="room">Room</option>
                  <option value="commercial">Commercial</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* District */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={districtQuery}
                  onChange={(e) => setDistrictQuery(e.target.value)}
                  placeholder="Lilongwe"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            {/* Location */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Area 47"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            {/* Min Bedrooms */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Beds</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Bed className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={minRooms}
                  onChange={(e) => setMinRooms(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Any"
                  min="0"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            {/* Max Price */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (MK)</label>
              <div className="relative">
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  min="0"
                  className="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Properties
            </button>
          </div>
        </form>
        
        {/* Quick Links */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Popular Searches</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/properties?district=Lilongwe"
              className="flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-md"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Lilongwe ({counts.lilongwe})
            </Link>
            <Link
              to="/properties?district=Blantyre"
              className="flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-md"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Blantyre ({counts.blantyre})
            </Link>
            <Link
              to="/properties?type=apartment"
              className="flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-md"
            >
              <Building className="h-4 w-4 mr-1" />
              Apartments ({counts.apartments})
            </Link>
            <Link
              to="/properties?type=house"
              className="flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-md"
            >
              <Home className="h-4 w-4 mr-1" />
              Houses ({counts.houses})
            </Link>
            <Link
              to="/properties?type=room"
              className="flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-md"
            >
              <Users className="h-4 w-4 mr-1" />
              Rooms ({counts.rooms})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;