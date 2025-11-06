import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilter from '../components/property/PropertyFilter';
import { useProperties, SearchFilters, Property } from '../context/PropertyContext';
import { GridIcon, List, SlidersHorizontal, MapPin, Home, Map as MapIcon, ArrowUpDown } from 'lucide-react';

import Chip from '../components/ui/Chip';

const PropertyListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchProperties } = useProperties();
  const [loading, setLoading] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'newest'>('relevance');
  const [quick, setQuick] = useState<{ verified?: boolean; newOnly?: boolean; under500k?: boolean }>({});
  
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
    setLoading(true);
    let results = searchProperties(filters);

    // Quick filters (client-side)
    if (quick.verified) results = results.filter((p) => (p as any).is_verified);
    if (quick.newOnly) {
      results = results.filter((p) => {
        const created = (p as any).created_at ? new Date((p as any).created_at) : null;
        if (!created) return false;
        return Date.now() - created.getTime() < 1000 * 60 * 60 * 24 * 7;
      });
    }
    if (quick.under500k) results = results.filter((p) => p.price <= 500000);

    // Sorting
    results = [...results].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') {
        const ad = (a as any).created_at ? new Date((a as any).created_at).getTime() : 0;
        const bd = (b as any).created_at ? new Date((b as any).created_at).getTime() : 0;
        return bd - ad;
      }
      return 0; // relevance (no-op for now)
    });
    setFilteredProperties(results);
    setLoading(false);
  }, [searchProperties, setSearchParams, quick, sortBy]);
  
  // Initialize search based on URL params
  useEffect(() => {
    handleFilter(initialFilters);
  }, [handleFilter, initialFilters]);
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8">
      <div className="container">
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
          <div className="w-full lg:w-1/4 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-md p-6 lg:sticky lg:top-24">
              <div className="flex items-center mb-4">
                <SlidersHorizontal className="h-5 w-5 text-emerald-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              </div>
              <PropertyFilter onFilter={handleFilter} initialFilters={initialFilters} />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 order-1 lg:order-2">
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
                  {/* Clear All */}
                  <button
                    className="text-sm text-slate-600 hover:text-slate-900 underline"
                    onClick={() => { setQuick({}); handleFilter({}); }}
                  >
                    Clear all
                  </button>

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
            {loading ? (
              <div className={`${isGridView ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
                {Array.from({ length: isGridView ? 6 : 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4">
                    <div className="h-48 bg-slate-200 rounded-xl mb-4 animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded w-2/3 mb-4 animate-pulse" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-3 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
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