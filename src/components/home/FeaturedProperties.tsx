import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Home } from 'lucide-react';
import PropertyCard from '../property/PropertyCard';
import { useProperties } from '../../context/PropertyContext';

const FeaturedProperties: React.FC = () => {
  const { featuredProperties } = useProperties();
  
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our handpicked premium listings that offer the best value and quality
          </p>
        </div>
        
        {/* Property Grid */}
        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Home className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No featured properties available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We currently don't have any featured properties. Please check back later or browse our full property listings.
            </p>
            <Link 
              to="/properties" 
              className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse All Properties
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            to="/properties" 
            className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Properties
            <ChevronRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;