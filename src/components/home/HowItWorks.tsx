import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, UserCheck, ArrowRight, MessageCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      title: "Search Properties",
      description: "Browse our extensive listing of properties across Malawi. Use filters to narrow down your search by location, price, and amenities to find the perfect match."
    },
    {
      icon: <Home className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      title: "View Details",
      description: "Explore detailed property information including high-quality photos, amenities, location details, and pricing. Get all the information you need to make an informed decision."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-amber-500 to-amber-600",
      title: "Contact Owner",
      description: "Easily connect with property owners or managers directly through our platform. Schedule viewings and get answers to all your questions about the property."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How NyumbaPaeasy Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find your dream property in Malawi with our simple three-step process
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className={`${step.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold mb-4 text-lg">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link 
            to="/properties" 
            className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            Start Searching
            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;