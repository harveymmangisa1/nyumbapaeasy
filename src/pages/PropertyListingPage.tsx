import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilter from '../components/property/PropertyFilter';
import { useProperties, SearchFilters, Property } from '../context/PropertyContext';
import { GridIcon, List, SlidersHorizontal } from 'lucide-react';

const PropertyListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchProperties } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  
  // Get initial filters from URL params
  const initialFilters: SearchFilters = {
    location: searchParams.get('location') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    propertyType: searchParams.get('type') || undefined,
    isSelfContained: searchParams.get('isSelfContained') === 'true' ? true : undefined,
  };
  
  // Update document title
  useEffect(() => {
    document.title = 'Property Listings | NyumbaPaeasy';
  }, []);
  
  // Apply filters and update URL
  const handleFilter = (filters: SearchFilters) => {
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
  };
  
  // Initialize search based on URL params
  useEffect(() => {
    handleFilter(initialFilters);
  }, []);
  
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Property Listings</h1>
        
        {/* Filters */}
        <PropertyFilter onFilter={handleFilter} initialFilters={initialFilters} />
        
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <p className="text-gray-600 mb-4 md:mb-0">
            Showing <span className="font-semibold">{filteredProperties.length}</span> properties
          </p>
          
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-md shadow-sm">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded-l-md ${isGridView ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}`}
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded-r-md ${!isGridView ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}`}
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
        
        {/* Property Grid/List */}
        {filteredProperties.length > 0 ? (
          <div className={`${isGridView ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}`}>
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListingPage;