import React, { useState } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchFilters } from '../../context/PropertyContext';

interface PropertyFilterProps {
  onFilter: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilter, initialFilters = {} }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFilters(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };
  
  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                name="location"
                value={filters.location || ''}
                onChange={handleInputChange}
                placeholder="Search by location or district..."
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="btn btn-primary flex-shrink-0 min-w-24"
            >
              Search
            </button>
            
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="btn btn-outline flex items-center space-x-1"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {isAdvancedOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (MK)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice || ''}
                  onChange={handleInputChange}
                  placeholder="Min"
                  className="input"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice || ''}
                  onChange={handleInputChange}
                  placeholder="Max"
                  className="input"
                />
              </div>
            </div>
            
            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms || ''}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={filters.propertyType || ''}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Any</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            {/* Self Contained */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSelfContained"
                name="isSelfContained"
                checked={filters.isSelfContained || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="isSelfContained" className="ml-2 block text-sm text-gray-700">
                Self Contained Only
              </label>
            </div>
            
            {/* Clear Filters */}
            <div className="md:col-span-3 flex justify-end mt-2">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertyFilter;