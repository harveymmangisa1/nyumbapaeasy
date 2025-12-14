import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, BadgeCheck } from 'lucide-react';
import { Property } from '../../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  const isNew = (() => {
    const created = property.created_at ? new Date(property.created_at) : null;
    if (!created) return false;
    const diff = Date.now() - created.getTime();
    return diff < 1000 * 60 * 60 * 24 * 7; // 7 days
  })();

  const [saved, setSaved] = useState(false);

  return (
    <Link to={`/properties/${property.id}`} className="card group block overflow-hidden rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="bg-accent text-white px-3 py-1 text-sm font-bold rounded-md shadow-sm">
            MK {property.price.toLocaleString()} {property.listing_type === 'rent' ? '/mo' : ''}
          </div>
          {isNew && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-md shadow-sm">New</span>
          )}
          {property.is_verified && (
            <span className="bg-white text-emerald-700 text-xs px-2 py-1 rounded-md shadow-sm inline-flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" /> Verified
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); setSaved(s => !s); }}
          className={`absolute top-3 right-3 h-9 w-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${saved ? 'bg-red-500/90 text-white' : 'bg-surface/80 hover:bg-surface'}`}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`h-5 w-5 ${saved ? 'fill-current' : 'text-text-secondary'}`} />
        </button>

        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-lg font-bold text-surface line-clamp-1 mb-1">{property.title}</h3>
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{property.location}, {property.district}</span>
            {(property as any).category && <span className="ml-2 truncate capitalize">{`(${(property as any).category})`}</span>}
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