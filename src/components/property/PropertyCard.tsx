import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, BadgeCheck, Star } from 'lucide-react';
import { Property } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);

  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  const isNew = (() => {
    const created = property.created_at ? new Date(property.created_at) : null;
    if (!created) return false;
    const diff = Date.now() - created.getTime();
    return diff < 1000 * 60 * 60 * 24 * 7; // 7 days
  })();

  // Check if property is saved on component mount
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', property.id)
          .single();
        
        setSaved(!!data);
      } catch (error) {
        // Property not saved
        setSaved(false);
      }
    };

    checkIfSaved();
  }, [user, property.id]);

  const getModeBadge = (listingType: string) => {
    switch (listingType) {
      case 'rent':
        return { text: 'Rent', color: 'bg-blue-500' };
      case 'short_stay':
        return { text: 'Short Stay', color: 'bg-amber-500' };
      case 'buy':
        return { text: 'Buy', color: 'bg-emerald-500' };
      case 'sale':
        return { text: 'Sale', color: 'bg-emerald-500' };
      case 'scale':
        return { text: 'Commercial', color: 'bg-purple-500' };
      default:
        return { text: listingType, color: 'bg-slate-500' };
    }
  };

  const modeBadge = getModeBadge(property.listing_type);

  return (
    <Link to={`/properties/${property.id}`} className="property-card group block overflow-hidden rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-card-hover">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          loading="lazy"
          className="property-card-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className={`${modeBadge.color} text-white px-2 py-1 text-xs font-semibold rounded-md shadow-sm`}>
            {modeBadge.text}
          </div>
          {isNew && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-md shadow-sm">New</span>
          )}
          {property.is_verified && (
            <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-md shadow-sm inline-flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { 
            e.preventDefault(); 
            setSaved(s => !s); 
          }}
          className={`absolute top-3 right-3 h-8 w-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${saved ? 'bg-red-500/90 text-white' : 'bg-white/80 hover:bg-white'}`}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : 'text-slate-600'}`} />
        </button>

        {/* Property info overlay */}
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-lg font-bold text-white line-clamp-1 mb-1">{property.title}</h3>
          <div className="flex items-center text-slate-200 text-sm">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{property.location}, {property.district}</span>
            {(property as any).category && <span className="ml-2 truncate capitalize">{`(${(property as any).category})`}</span>}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold text-slate-800">
            MK {property.price.toLocaleString()}
            <span className="text-sm font-normal text-slate-500 ml-1">
              {property.listing_type === 'rent' ? '/mo' : property.listing_type === 'short_stay' || property.listing_type === 'sale' ? '/night' : ''}
            </span>
          </div>
          {(property as any).rating && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-slate-700">{(property as any).rating}</span>
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-slate-400" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-slate-400" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4 text-slate-400" />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;