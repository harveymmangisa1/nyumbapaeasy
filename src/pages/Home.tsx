
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import HowItWorks from '../components/home/HowItWorks';
import { Home, Loader2, TrendingUp, Shield, ArrowRight, Plus } from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';

const HomePage: React.FC = () => {
  const { properties, isLoading } = useProperties();
  const recentProperties = !isLoading && properties.length > 0 ? properties.slice(0, 6) : [];
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'NyumbaPaeasy - Find Your Perfect Home in Malawi';
  }, []);

  // Handle auth callback
  useEffect(() => {
    // Check if there is a hash in the URL, which indicates an auth callback
    if (location.hash.includes('access_token') || location.hash.includes('error')) {
      // The AuthProvider will handle the session from the URL hash.
      // Once the user object is available, we can redirect.
      if (user) {
        navigate('/post-auth');
      }
    }
  }, [location.hash, user, navigate]);

  // If it's an auth callback, show a loading indicator instead of the full page.
  if (location.hash.includes('access_token') || location.hash.includes('error')) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
          <h1 className="text-2xl font-semibold">Authenticating...</h1>
          <p className="text-slate-600">Please wait while we log you in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Hero Search */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold text-primary mb-2">Find your next home</h2>
              <p className="text-text-secondary">Search by location, district, or property type</p>
            </div>
            {/* Reuseable search bar */}
            {/* Simple client-side nav to listings with query */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.querySelector('input[name="q"]') as HTMLInputElement | null;
                const q = input?.value?.trim();
                if (q) {
                  navigate(`/properties?location=${encodeURIComponent(q)}`);
                } else {
                  navigate('/properties');
                }
              }}
              className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <input name="q" placeholder="Where do you want to live?" className="flex-1 px-4 py-3 outline-none" />
              <button type="submit" className="bg-slate-900 text-white px-5 py-3 hover:bg-slate-800 transition-colors">Search</button>
            </form>

            {/* Featured areas */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={() => navigate('/properties?location=Lilongwe')} className="px-3 py-1.5 rounded-full border border-slate-200 text-sm hover:bg-slate-50">Lilongwe</button>
              <button onClick={() => navigate('/properties?location=Blantyre')} className="px-3 py-1.5 rounded-full border border-slate-200 text-sm hover:bg-slate-50">Blantyre</button>
              <button onClick={() => navigate('/properties?location=Mzuzu')} className="px-3 py-1.5 rounded-full border border-slate-200 text-sm hover:bg-slate-50">Mzuzu</button>
              <button onClick={() => navigate('/properties?location=Zomba')} className="px-3 py-1.5 rounded-full border border-slate-200 text-sm hover:bg-slate-50">Zomba</button>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProperties />

      {/* Recently Added Properties */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Fresh Listings
            </div>
            <h2 className="text-4xl font-bold text-primary mb-4">
              Newly Added Properties
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Discover the latest homes and apartments just listed on our platform
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
              <p className="text-text-secondary text-lg">Loading fresh properties...</p>
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
                    className="btn btn-primary py-4 px-8 rounded-lg text-base group">
                    <span>Explore All Properties</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">No Properties Available</h3>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                There are no properties listed at the moment. Check back soon for new listings.
              </p>
            </div>
          )}
        </div>
      </section>

      <HowItWorks />

      {/* Property Owner CTA */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Content */}
              <div className="lg:w-7/12 text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  For Property Owners
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface mb-6 leading-tight">
                  Ready to List Your Property?
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
                  Join thousands of property owners in Malawi who trust NyumbaPaeasy to connect with qualified tenants. 
                  Our platform makes listing and managing your properties simple and efficient.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/add-property" className="btn btn-accent py-4 px-8 rounded-lg text-base group">
                    <Plus className="h-5 w-5 mr-2" />
                    <span>List Your Property</span>
                  </Link>
                  <Link to="/landlord-guide" className="btn btn-outline-white py-4 px-8 rounded-lg text-base group">
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </div>
              </div>
              
              {/* Visual */}
              <div className="lg:w-5/12 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-accent to-teal-400 rounded-3xl flex items-center justify-center shadow-2xl">
                    <div className="text-center text-white p-8">
                      <Home className="h-16 w-16 mx-auto mb-6" />
                      <div className="text-2xl font-bold mb-2">Join Our Community</div>
                      <div className="text-white/80 text-sm">
                        Trusted by property owners across Malawi
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-surface/10 backdrop-blur-sm rounded-2xl border border-surface/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-surface/10 backdrop-blur-sm rounded-2xl border border-surface/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-teal-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container">
          <div className="text-center">
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Trusted By
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              <div className="text-text-secondary text-lg font-bold">Malawi Property Association</div>
              <div className="text-text-secondary text-lg font-bold">Real Estate Board</div>
              <div className="text-text-secondary text-lg font-bold">Verified Landlords</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
