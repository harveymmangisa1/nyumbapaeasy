import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import HowItWorks from '../components/home/HowItWorks';
import { Home, Loader2, TrendingUp, Shield, Star, ArrowRight, Plus } from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';

const HomePage: React.FC = () => {
  const { properties, isLoading } = useProperties();
  const recentProperties = !isLoading && properties.length > 0 ? properties.slice(0, 6) : [];

  useEffect(() => {
    document.title = 'NyumbaPaeasy - Find Your Perfect Home in Malawi';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      
    
      
      <FeaturedProperties />

      {/* Recently Added Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Fresh Listings
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Newly Added Properties
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover the latest homes and apartments just listed on our platform
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
              </div>
              <p className="text-slate-600 text-lg">Loading fresh properties...</p>
            </div>
          ) : recentProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {properties.length > 6 && (
                <div className="text-center">
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 group"
                  >
                    <span>Explore All Properties</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">No Properties Available</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-8">
                There are no properties listed at the moment. Check back soon for new listings.
              </p>
            </div>
          )}
        </div>
      </section>

      <HowItWorks />

      {/* Property Owner CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Content */}
              <div className="lg:w-7/12 text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                  For Property Owners
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Ready to List Your Property?
                </h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                  Join thousands of property owners in Malawi who trust NyumbaPaeasy to connect with qualified tenants and buyers. 
                  Our platform makes listing and managing your properties simple and efficient.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/add-property"
                    className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 group"
                  >
                    <Plus className="h-5 w-5" />
                    <span>List Your Property</span>
                  </Link>
                  <Link
                    to="/landlord-guide"
                    className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              {/* Visual */}
              <div className="lg:w-5/12 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <div className="text-center text-white p-8">
                      <Home className="h-16 w-16 mx-auto mb-6" />
                      <div className="text-2xl font-bold mb-2">Join Our Community</div>
                      <div className="text-white/80 text-sm">
                        Trusted by property owners across Malawi
                      </div>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Trusted By
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {/* Add your trust badge logos here */}
              <div className="text-slate-400 text-lg font-bold">Malawi Property Association</div>
              <div className="text-slate-400 text-lg font-bold">Real Estate Board</div>
              <div className="text-slate-400 text-lg font-bold">Verified Landlords</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;