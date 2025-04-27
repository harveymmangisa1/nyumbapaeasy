import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext'; // Import useProperties hook
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import HowItWorks from '../components/home/HowItWorks';
import { Home, Loader2 } from 'lucide-react'; // Import icons
import PropertyCard from '../components/property/PropertyCard'; // Ensure this component exists

const HomePage: React.FC = () => {
  // Get properties and loading state from context
  const { properties, isLoading } = useProperties();

  // Update the document title when the component mounts
  useEffect(() => {
    document.title = 'NyumbaPaeasy - Find Your Perfect Home in Malawi';
  }, []);

  // Determine the most recent properties (slice after checking loading state)
  const recentProperties = !isLoading && properties.length > 0 ? properties.slice(0, 3) : [];

  return (
    <div>
      <HeroSection />

      {/* --- Featured Properties Section --- */}
      <FeaturedProperties />

      {/* --- Recently Added Properties Section --- */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Recently Added Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out the latest homes and apartments listed on NyumbaPaeasy.
            </p>
          </div>

          {/* Conditional Rendering based on loading and data */}
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-3 text-gray-600">Loading recent properties...</span>
            </div>
          ) : recentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No recent properties found.
            </div>
          )}

          {/* Optional: Link to view all properties */}
          {!isLoading && properties.length > 3 && (
            <div className="text-center mt-12">
              <Link
                to="/properties"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                View All Properties
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <HowItWorks />

      {/* --- Landlord CTA Section --- */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Are You a Property Owner?</h2>
              <p className="text-emerald-100 text-lg mb-6 max-w-2xl">
                List your properties on NyumbaPaeasy and connect with thousands of potential tenants and buyers.
                Our platform makes it easy to manage your listings and communicate with interested parties.
              </p>
              <Link
                to="/add-property" // <-- CHANGE THIS PATH
                className="inline-block bg-white text-emerald-800 font-medium py-2 px-6 rounded-md transition-colors hover:bg-gray-100"
              >
                List Your Property
              </Link>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Home className="h-32 w-32 text-emerald-300" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
