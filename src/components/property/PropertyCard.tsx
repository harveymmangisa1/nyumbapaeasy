import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Eye, Building } from 'lucide-react';
import { Property } from '../../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  return (
    <Link to={`/properties/${property.id}`} className="card group block overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 text-sm font-bold rounded-md">
          MK {property.price.toLocaleString()} {property.listing_type === 'rent' ? '/mo' : ''}
        </div>

        <button className="absolute top-3 right-3 h-9 w-9 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:bg-surface">
          <Heart className="h-5 w-5 text-text-secondary hover:text-red-500" />
        </button>

        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-lg font-bold text-surface line-clamp-1 mb-1">{property.title}</h3>
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{property.location}, {property.district}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-surface">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-accent" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-accent" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4 text-accent" />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;