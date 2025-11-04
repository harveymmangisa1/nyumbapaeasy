import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Eye, Building } from 'lucide-react';
import { Property } from '../../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card group animate-fade-in hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      {/* Property Image with Overlay */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Price Tag */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 text-sm font-bold rounded-lg shadow-lg">
          MK {property.price.toLocaleString()} {property.listing_type === 'rent' ? '/month' : ''}
        </div>
        
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:bg-emerald-50 group-hover:bg-white">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
        
        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {property.is_self_contained && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">
              Self Contained
            </div>
          )}
          <div className="bg-gray-800/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium capitalize shadow-md">
            {property.type}
          </div>
        </div>
        
        {/* Views Badge */}
        {property.views && property.views > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center shadow-md">
            <Eye className="h-3 w-3 mr-1" />
            {property.views}
          </div>
        )}
      </div>
      
      {/* Property Details */}
      <div className="p-5 bg-white">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-1 mb-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 text-emerald-600 flex-shrink-0" />
          <span className="truncate">{property.location}, {property.district}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        {/* Property Stats */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 pb-2">
          {property.type !== 'commercial' ? (
            <>
              <div className="flex items-center text-gray-700">
                <Bed className="h-5 w-5 mr-1 text-emerald-600" />
                <span className="font-medium">{property.bedrooms}</span>
                <span className="text-gray-500 text-sm ml-1">beds</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Bath className="h-5 w-5 mr-1 text-emerald-600" />
                <span className="font-medium">{property.bathrooms}</span>
                <span className="text-gray-500 text-sm ml-1">baths</span>
              </div>
            </>
          ) : (
            <div></div> // Empty div for spacing
          )}
          <div className="flex items-center text-gray-700">
            <Square className="h-5 w-5 mr-1 text-emerald-600" />
            <span className="font-medium">{property.area}</span>
            <span className="text-gray-500 text-sm ml-1">m²</span>
          </div>
        </div>
      </div>
      
      {/* View Details Button */}
      <div className="px-5 pb-5 pt-0 bg-white">
        <Link 
          to={`/properties/${property.id}`}
          className="btn btn-primary w-full py-3 font-semibold rounded-lg transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg flex items-center justify-center"
        >
          <Building className="h-4 w-4 mr-2" />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;