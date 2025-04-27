import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Home, Bed } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext'; // Ensure this hook provides the properties data

const HeroSection: React.FC = () => {
  const { properties } = useProperties(); // Get all properties from context
  const [districtQuery, setDistrictQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [listingType, setListingType] = useState<'rent' | 'sale' | ''>('');
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
    <div className="relative h-auto min-h-[550px] md:min-h-[600px] py-16 bg-gradient-to-r from-blue-900 to-emerald-900 flex items-center justify-center">
      <div className="relative container mx-auto px-4 flex flex-col items-center justify-center text-center z-10">
        {/* Updated Search Form */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-6xl bg-white bg-opacity-20 backdrop-blur-sm p-6 rounded-lg shadow-xl animate-fade-in animation-delay-400"
        >
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Listing Type Filter */}
            <div className="relative">
              <label htmlFor="listingType" className="block text-sm font-medium text-white mb-1 text-left">Listing Type</label>
              <select
                id="listingType"
                value={listingType}
                onChange={(e) => setListingType(e.target.value as any)}
                className="w-full pl-3 pr-8 py-2 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All</option>
                <option value="rent">Rent</option>
                <option value="sale">Buy</option>
              </select>
            </div>

            {/* Property Type Filter */}
            <div className="relative">
              <label htmlFor="propertyType" className="block text-sm font-medium text-white mb-1 text-left">Property Type</label>
              <select
                id="propertyType"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full pl-3 pr-8 py-2 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* District Input */}
            <div className="relative">
              <label htmlFor="district" className="block text-sm font-medium text-white mb-1 text-left">District</label>
              <input
                id="district"
                type="text"
                value={districtQuery}
                onChange={(e) => setDistrictQuery(e.target.value)}
                placeholder="e.g., Lilongwe, Blantyre..."
                className="w-full pl-3 pr-3 py-2 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Location Input */}
            <div className="relative">
              <label htmlFor="location" className="block text-sm font-medium text-white mb-1 text-left">Location / Area</label>
              <input
                id="location"
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Area 47, Namiwawa..."
                className="w-full pl-3 pr-3 py-2 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Min Bedrooms */}
            <div className="relative">
              <label htmlFor="minRooms" className="block text-sm font-medium text-white mb-1 text-left">Min Beds</label>
              <input
                id="minRooms"
                type="number"
                value={minRooms}
                onChange={(e) => setMinRooms(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Any"
                min="0"
                className="w-full pl-3 pr-3 py-2 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Max Price */}
            <div className="relative">
              <label htmlFor="maxPrice" className="block text-sm font-medium text-white mb-1 text-left">Max Price</label>
              <input
                id="maxPrice"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                min="0"
                className="w-full pl-3 pr-3 py-2 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="col-span-full md:col-span-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow-lg transition-colors flex items-center justify-center space-x-2 h-[42px]"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* --- Quick Links with Counts --- */}
        <div className="flex flex-wrap justify-center mt-8 gap-3 animate-fade-in animation-delay-600">
          <Link
            to="/properties?district=Lilongwe"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white text-sm transition-colors"
          >
            Lilongwe ({counts.lilongwe})
          </Link>
          <Link
            to="/properties?district=Blantyre"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white text-sm transition-colors"
          >
            Blantyre ({counts.blantyre})
          </Link>
          <Link
            to="/properties?type=apartment"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white text-sm transition-colors"
          >
            Apartments ({counts.apartments})
          </Link>
          <Link
            to="/properties?type=house"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white text-sm transition-colors"
          >
            Houses ({counts.houses})
          </Link>
          <Link
            to="/properties?type=room"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white text-sm transition-colors"
          >
            Rooms ({counts.rooms})
          </Link>
        </div>
        {/* --- End Quick Links with Counts --- */}
      </div>
    </div>
  );
};

export default HeroSection;