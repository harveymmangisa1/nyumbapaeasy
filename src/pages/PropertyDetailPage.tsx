import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useUser } from '../context/UserContext';
import { MapPin, User, Phone, Mail, Bed, Bath, Square, Heart, Share, ArrowLeft, Check, X } from 'lucide-react';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPropertyById } = useProperties();
  const { isAuthenticated } = useUser();
  const [property, setProperty] = useState(getPropertyById(id || ''));
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Update document title
  useEffect(() => {
    if (property) {
      document.title = `${property.title} | NyumbaPaeasy`;
    } else {
      document.title = 'Property Not Found | NyumbaPaeasy';
    }
  }, [property]);
  
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Would normally send this to an API
    setTimeout(() => {
      setShowContact(false);
    }, 3000);
  };
  
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/properties" 
          className="inline-flex items-center text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Link>
        
        {/* Property Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-1 text-emerald-600" />
              <span>{property.location}, {property.district}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-2xl font-bold text-emerald-600">
              MK {property.price.toLocaleString()}{property.type !== 'commercial' ? '/month' : ''}
            </div>
          </div>
        </div>
        
        {/* Property Gallery */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-96 bg-gray-200">
            <img 
              src={property.images[activeImage]} 
              alt={property.title} 
              className="h-full w-full object-cover"
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      activeImage === index ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-700 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-700 hover:text-blue-500 transition-colors">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {property.images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 p-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  className={`h-16 md:h-20 w-full ${
                    activeImage === index ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image}
                    alt={`Property view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Property Details and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.type !== 'commercial' && (
                  <>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                      <Bed className="h-6 w-6 text-emerald-600 mb-1" />
                      <span className="text-sm text-gray-500">Bedrooms</span>
                      <span className="font-semibold">{property.bedrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                      <Bath className="h-6 w-6 text-emerald-600 mb-1" />
                      <span className="text-sm text-gray-500">Bathrooms</span>
                      <span className="font-semibold">{property.bathrooms}</span>
                    </div>
                  </>
                )}
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                  <Square className="h-6 w-6 text-emerald-600 mb-1" />
                  <span className="text-sm text-gray-500">Area</span>
                  <span className="font-semibold">{property.area} m²</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-1 ${property.isSelfContained ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {property.isSelfContained ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                  <span className="text-sm text-gray-500">Self Contained</span>
                  <span className="font-semibold">{property.isSelfContained ? 'Yes' : 'No'}</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {property.description}
                </p>
              </div>
              
              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
              <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Map view would appear here</p>
                  <p className="text-sm">{property.location}, {property.district}, Malawi</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Landlord Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Landlord</h2>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{property.landlordName}</p>
                  <p className="text-sm text-gray-600">Property Owner</p>
                </div>
              </div>
              
              {/* Contact Form */}
              {showContact && !submitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      className="input resize-none"
                      defaultValue={`I'm interested in this ${property.type} at ${property.location}. Please contact me with more information.`}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                  >
                    Send Message
                  </button>
                </form>
              ) : submitted ? (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-md text-center">
                  <Check className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">Message Sent!</p>
                  <p className="text-sm mt-1">The landlord will contact you soon.</p>
                </div>
              ) : (
                <div>
                  {isAuthenticated ? (
                    <button
                      onClick={() => setShowContact(true)}
                      className="btn btn-primary w-full mb-3"
                    >
                      Contact Landlord
                    </button>
                  ) : (
                    <Link to="/login" className="btn btn-primary w-full block text-center mb-3">
                      Login to Contact
                    </Link>
                  )}
                  
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Or contact directly:
                  </p>
                  
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <a
                        href={`tel:${property.landlordContact}`}
                        className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
                      >
                        <Phone className="h-5 w-5 mr-3 text-emerald-600" />
                        <span>{property.landlordContact}</span>
                      </a>
                      <a
                        href="mailto:landlord@example.com"
                        className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
                      >
                        <Mail className="h-5 w-5 mr-3 text-emerald-600" />
                        <span>Email Landlord</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm">
                      Contact details are visible after login
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Property Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Summary</h2>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium capitalize">{property.type}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Listed On:</span>
                  <span className="font-medium">
                    {new Date(property.createdAt.toDate()).toLocaleDateString()}
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">{property.area} m²</span>
                </li>
                {property.type !== 'commercial' && (
                  <>
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </li>
                  </>
                )}
                <li className="flex justify-between">
                  <span className="text-gray-600">Self Contained:</span>
                  <span className="font-medium">{property.isSelfContained ? 'Yes' : 'No'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;