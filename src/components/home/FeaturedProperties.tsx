import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PropertyCard from '../property/PropertyCard';
import { useProperties } from '../../context/PropertyContext';

const FeaturedProperties: React.FC = () => {
  const { featuredProperties } = useProperties();
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Properties</h2>
            <p className="text-gray-600 mt-1">Discover our handpicked premium listings</p>
          </div>
          <Link 
            to="/properties" 
            className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            View All
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;