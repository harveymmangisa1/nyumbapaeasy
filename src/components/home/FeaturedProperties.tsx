import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Home } from 'lucide-react';
import PropertyCard from '../property/PropertyCard';
import { useProperties } from '../../context/PropertyContext';

const FeaturedProperties: React.FC = () => {
  const { featuredProperties, isLoading } = useProperties();

  if (isLoading || featuredProperties.length === 0) {
    return null; // Don't render the section if there are no featured properties or it's loading
  }
  
  return (
    <section className="py-20 bg-surface">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-accent/10 p-3 rounded-full mb-4">
            <Star className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Featured Properties</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Discover our handpicked listings that offer the best value and quality.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        {featuredProperties.length > 3 && (
          <div className="text-center mt-16">
            <Link to="/properties" className="btn btn-secondary text-base group">
              View All Properties
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
