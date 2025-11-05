import React, { useState } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp, DollarSign, Home, Bed } from 'lucide-react';
import { SearchFilters } from '../../context/PropertyContext';

interface PropertyFilterProps {
  onFilter: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilter, initialFilters = {} }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  
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
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {/* Basic Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              name="location"
              value={filters.location || ''}
              onChange={handleInputChange}
              placeholder="Search by location or district..."
              className="input pl-10 py-3"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center text-emerald-600 font-medium mb-4 w-full justify-between"
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </span>
          {isAdvancedOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        
        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="space-y-4 animate-fade-in">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Price Range (MK)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice || ''}
                    onChange={handleInputChange}
                    placeholder="Min price"
                    className="input w-full"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice || ''}
                    onChange={handleInputChange}
                    placeholder="Max price"
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Bedrooms & Property Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="h-4 w-4 inline mr-1" />
                  Bedrooms
                </label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms || ''}
                  onChange={handleInputChange}
                  className="select w-full"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="h-4 w-4 inline mr-1" />
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={filters.propertyType || ''}
                  onChange={handleInputChange}
                  className="select w-full"
                >
                  <option value="">Any</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="room">Room</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            
            {/* Self Contained */}
            <div className="pt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isSelfContained"
                  checked={filters.isSelfContained || false}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-700">
                  Self Contained Only
                </span>
              </label>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6">
          <button
            type="submit"
            className="btn btn-primary flex-1 py-3 font-semibold"
          >
            Apply Filters
          </button>
          
          <button
            type="button"
            onClick={clearFilters}
            className="btn btn-outline py-3 px-4"
            title="Clear all filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilter;