import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, UserCheck, ArrowRight, MessageCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
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

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-accent/10 p-3 rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">How It Works</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Find your dream property in just a few simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="card text-center p-8 border border-border hover:shadow-lg transition-shadow duration-300">
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
  );
};

export default HowItWorks;