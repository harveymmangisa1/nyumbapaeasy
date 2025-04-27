import React from 'react';
import { Search, Home, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom'; // Add this import

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">How NyumbaPaeasy Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your dream property in Malawi with our simple three-step process
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Search Properties</h3>
            <p className="text-gray-600">
              Browse our extensive listing of properties across Malawi. 
              Use filters to narrow down your search by location, price, 
              and amenities to find the perfect match.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center animate-fade-in animation-delay-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Home className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">View Details</h3>
            <p className="text-gray-600">
              Explore detailed property information including high-quality photos, 
              amenities, location details, and pricing. Get all the information 
              you need to make an informed decision.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center animate-fade-in animation-delay-400">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Owner</h3>
            <p className="text-gray-600">
              Easily connect with property owners or managers directly through 
              our platform. Schedule viewings and get answers to all your 
              questions about the property.
            </p>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="text-center mt-10">
          <Link 
            to="/properties" 
            className="btn btn-primary px-8 py-3 text-base"
          >
            Start Searching
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;