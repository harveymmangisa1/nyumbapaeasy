import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProperties, Property } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import {
  Home, Loader2, TrendingUp, Shield, ArrowRight, Plus,
  Search, Star, ChevronRight, MessageCircle, UserCheck,
  CheckCircle, Users, Clock
} from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';
import HeroSection from '../components/home/HeroSection';

const HomePage: React.FC = () => {
  const { properties, isLoading, featuredProperties } = useProperties();
  const recentProperties = !isLoading && properties.length > 0 ? properties.slice(0, 6) : [];
  const trendingProperties = !isLoading && properties.length > 0 ? properties.slice(0, 3) : [];
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'NyumbaPaeasy - Find Your Perfect Home in Malawi';
  }, []);

  // Handle auth callback
  useEffect(() => {
    if (location.hash.includes('access_token') || location.hash.includes('error')) {
      if (user) {
        navigate('/post-auth');
      }
    }
  }, [location.hash, user, navigate]);

  const steps = [
    {
      icon: Search,
      title: "Search Properties",
      description: "Browse our extensive listings. Use filters to narrow down your search by location, price, and amenities."
    },
    {
      icon: Home,
      title: "View Details",
      description: "Explore detailed property information with high-quality photos, amenities, and location details."
    },
    {
      icon: UserCheck,
      title: "Contact Owner",
      description: "Easily connect with property owners or managers directly through our secure platform to schedule viewings."
    }
  ];

  if (location.hash.includes('access_token') || location.hash.includes('error')) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-background via-white to-accent/5">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
          <Loader2 className="h-16 w-16 animate-spin text-accent mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-primary mb-2">Almost there!</h1>
          <p className="text-slate-600 text-lg">Completing your secure login...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-white to-background/50">
      {/* Hero Section */}
      <HeroSection />

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
            {featuredProperties.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {featuredProperties.length > 3 && (
            <div className="text-center mt-16">
              <Link to="/properties" className="btn btn-primary text-base group">
                View All Properties
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recently Added Properties */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-background/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                Fresh on the Market
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Newly Listed Properties
              </h2>
              <p className="text-lg text-text-secondary mt-2 max-w-2xl">
                Discover the latest homes and apartments just listed on our platform
              </p>
            </div>
            <Link
              to="/properties"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 font-semibold"
            >
              View All Properties
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-64 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : recentProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recentProperties.map((property: Property) => (
                  <div key={property.id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-300 font-semibold shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
                >
                  Explore All Properties
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-border">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">No Properties Available</h3>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                We're adding new properties every day. Check back soon or subscribe to get notified.
              </p>
              <button className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-semibold">
                Get Notified
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      {trendingProperties.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Now
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Most Viewed Properties
              </h2>
              <p className="text-lg text-text-secondary mt-2">
                Properties getting the most attention this week
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {trendingProperties.map((property, index) => (
                <div key={property.id} className="relative group">
                  <div className="absolute -top-3 -right-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    #{index + 1}
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                    <PropertyCard property={property} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-accent/10 p-3 rounded-full mb-4">
              <MessageCircle className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-3">How It Works</h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              Find your dream property in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="card text-center p-8 bg-card border border-border rounded-lg hover:shadow-xl transition-all duration-300">
                <div className={`bg-accent/10 text-accent w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/properties" className="btn btn-primary text-base group">
              Start Searching
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Property Owner CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-pattern-light opacity-20" />

        <div className="container relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
                  For Property Owners
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  List Your Property in <span className="text-accent">Minutes</span>
                </h2>
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Join Malawi's most trusted property platform. Reach thousands of qualified tenants,
                  manage listings effortlessly, and get guaranteed visibility.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Zero listing fees',
                    'Verified tenant profiles',
                    '24/7 support',
                    'Digital contract management'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/add-property"
                    className="group inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
                  >
                    <Plus className="h-5 w-5" />
                    List Your Property
                  </Link>
                  <Link
                    to="/landlord-guide"
                    className="group inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="lg:w-2/5">
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="text-center text-white mb-8">
                      <Home className="h-16 w-16 mx-auto mb-6 text-accent" />
                      <div className="text-2xl font-bold mb-2">Join 5,000+ Owners</div>
                      <div className="text-white/80">
                        Already listing with us
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-accent" />
                          <span className="text-white">Active Tenants</span>
                        </div>
                        <span className="text-2xl font-bold text-white">15K+</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-accent" />
                          <span className="text-white">Avg. Listing Time</span>
                        </div>
                        <span className="text-2xl font-bold text-white">3 Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-2xl flex items-center justify-center shadow-xl">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="text-center">
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-8">
              Trusted and Recommended By
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
              {[
                'Malawi Property Association',
                'Real Estate Board',
                'Verified Landlords',
                'Tenant Association'
              ].map((org, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                    <Star className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-lg font-bold text-primary">{org}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;