
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Property } from '../../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : 'fallback-image-url.jpg'; // Add a fallback

  return (
    <div className="card group animate-fade-in">
      {/* Property Image with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Price Tag */}
        <div className="absolute bottom-0 left-0 bg-emerald-600 text-white px-3 py-1.5 text-sm font-semibold">
          MK {property.price.toLocaleString()} {property.type !== 'commercial' ? '/month' : ''}
        </div>
        
        {/* Favorite Button */}
        <button className="absolute top-2 right-2 h-8 w-8 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-colors">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
        
        {/* Property Type Badge */}
        {property.isSelfContained && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
            Self Contained
          </div>
        )}
      </div>
      
      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
          <span>{property.location}, {property.district}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>
        
        {/* Property Stats */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          {property.type !== 'commercial' && (
            <>
              <div className="flex items-center text-gray-700">
                <Bed className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            </>
          )}
          <div className="flex items-center text-gray-700">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.area} m²</span>
          </div>
        </div>
      </div>
      
      {/* View Details Button */}
      <div className="p-4 pt-0">
        <Link 
          to={`/properties/${property.id}`}
          className="btn btn-outline w-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-500 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;