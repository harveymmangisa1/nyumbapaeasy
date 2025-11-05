import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilter from '../components/property/PropertyFilter';
import { useProperties, SearchFilters, Property } from '../context/PropertyContext';
import { GridIcon, List, SlidersHorizontal, MapPin, Home } from 'lucide-react';

const PropertyListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchProperties } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  
  // Get initial filters from URL params
  const initialFilters: SearchFilters = useMemo(() => ({
    location: searchParams.get('location') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    propertyType: searchParams.get('type') || undefined,
    isSelfContained: searchParams.get('isSelfContained') === 'true' ? true : undefined,
  }), [searchParams]);
  
  // Update document title
  useEffect(() => {
    document.title = 'Property Listings | NyumbaPaeasy';
  }, []);
  
  // Apply filters and update URL
  const handleFilter = useCallback((filters: SearchFilters) => {
    // Update URL with filters
    const newSearchParams = new URLSearchParams();
    
    if (filters.location) newSearchParams.set('location', filters.location);
    if (filters.minPrice) newSearchParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) newSearchParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) newSearchParams.set('bedrooms', filters.bedrooms.toString());
    if (filters.propertyType) newSearchParams.set('type', filters.propertyType);
    if (filters.isSelfContained) newSearchParams.set('isSelfContained', filters.isSelfContained.toString());
    
    setSearchParams(newSearchParams);
    
    // Search properties
    const results = searchProperties(filters);
    setFilteredProperties(results);
  }, [searchProperties, setSearchParams]);
  
  // Initialize search based on URL params
  useEffect(() => {
    handleFilter(initialFilters);
  }, [handleFilter, initialFilters]);
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Home className="h-6 w-6 text-emerald-600 mr-2" />
            <nav className="text-sm text-gray-600">
              <span>Home</span> / <span className="text-gray-800 font-medium">Properties</span>
            </nav>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Property Listings</h1>
          <p className="text-gray-600 mt-2">
            Discover the perfect property that matches your needs
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex items-center mb-4">
                <SlidersHorizontal className="h-5 w-5 text-emerald-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              </div>
              <PropertyFilter onFilter={handleFilter} initialFilters={initialFilters} />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-gray-800">
                    Available Properties
                  </h2>
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{filteredProperties.length}</span> properties
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setIsGridView(true)}
                      className={`p-2 rounded-md transition-colors ${
                        isGridView 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      aria-label="Grid view"
                    >
                      <GridIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsGridView(false)}
                      className={`p-2 rounded-md transition-colors ${
                        !isGridView 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown - could be expanded in the future */}
                  <div className="relative">
                    <button className="btn btn-outline flex items-center space-x-1">
                      <span>Sort By</span>
                      <SlidersHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Property Grid/List */}
            {filteredProperties.length > 0 ? (
              <div className={`${isGridView ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search filters to see more results. We have properties in various locations across Malawi.
                </p>
                <button 
                  onClick={() => handleFilter({})}
                  className="btn btn-primary px-6 py-3"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingPage;