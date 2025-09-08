import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import HowItWorks from '../components/home/HowItWorks';
import { Home, Loader2, TrendingUp, ShieldCheck, Users } from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';

const HomePage: React.FC = () => {
  const { properties, isLoading } = useProperties();
  const recentProperties = !isLoading && properties.length > 0 ? properties.slice(0, 3) : [];

  useEffect(() => {
    document.title = 'NyumbaPaeasy - Find Your Perfect Home in Malawi';
  }, []);

  return (
    <div>
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-emerald-50 rounded-lg p-6 text-center">
              <Home className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800">500+</h3>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800">2,000+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <TrendingUp className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800">98%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-6 text-center">
              <ShieldCheck className="h-10 w-10 text-amber-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800">100%</h3>
              <p className="text-gray-600">Verified Listings</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProperties />

      {/* Recently Added Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Recently Added Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out the latest homes and apartments listed on NyumbaPaeasy.
            </p>
          </div>

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

          {!isLoading && properties.length > 3 && (
            <div className="text-center mt-12">
              <Link
                to="/properties"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                View All Properties
              </Link>
            </div>
          )}
        </div>
      </section>

      <HowItWorks />

      {/* Landlord CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-teal-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Are You a Property Owner?</h2>
              <p className="text-emerald-100 text-lg mb-6 max-w-2xl">
                List your properties on NyumbaPaeasy and connect with thousands of potential tenants and buyers.
                Our platform makes it easy to manage your listings and communicate with interested parties.
              </p>
              <Link
                to="/add-property"
                className="inline-block bg-white text-emerald-800 font-bold py-3 px-8 rounded-lg transition-colors hover:bg-gray-100 shadow-lg"
              >
                List Your Property
              </Link>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white/20 p-6 rounded-full">
                <Home className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;