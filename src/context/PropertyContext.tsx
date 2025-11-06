import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase'; // Import your Supabase client
import { useAuth } from "./AuthContext"; // Import your Supabase Auth context hook

// Interface for data submitted when creating a new property
export interface NewPropertyData {
  title: string;
  description: string;
  price: number;
  payment_cycle?: 'monthly' | '2_months' | '3_months' | '6_months' | '12_months'; // Optional for rent properties
  location: string;
  district: string;
  sector?: string; // Optional sector within district
  type: 'apartment' | 'house' | 'room' | 'commercial';
  listing_type: 'rent' | 'sale'; // New field for listing type
  bedrooms: number;
  bathrooms: number;
  area: string;
  is_self_contained: boolean;
  amenities: string[];
  cover_image: string; // Primary image for display
  images: string[]; // Additional images
  is_featured?: boolean; // Optional, defaults to false in DB or handled by backend
  landlord_name: string;
  landlord_contact: string;
}

export interface Property {
  id: string; // uuid
  created_by: string; // user_id from auth.users
  landlord_id: string; // user_id from auth.users (likely same as created_by)
  landlord_name: string;
  landlord_contact: string;
  created_at: string; // ISO timestamp string from Supabase
  is_featured: boolean;
  title: string;
  description: string;
  price: number;
  payment_cycle?: 'monthly' | '2_months' | '3_months' | '6_months' | '12_months'; // Optional for rent properties
  location: string;
  district: string;
  sector?: string; // Optional sector within district
  type: 'apartment' | 'house' | 'room' | 'commercial';
  listing_type: 'rent' | 'sale'; // New field for listing type
  bedrooms: number;
  bathrooms: number;
  area: string;
  is_self_contained: boolean;
  amenities: string[];
  cover_image: string; // Primary image for display
  images: string[]; // Additional images
  is_verified?: boolean; // Optional verification flag
  views?: number; // Add views field
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  is_self_contained?: boolean;
}

interface PropertyContextType {
  properties: Property[];
  featuredProperties: Property[];
  isLoading: boolean;
  searchProperties: (filters: SearchFilters) => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getSimilarProperties: (property: Property, limit?: number) => Property[];
  addProperty: (propertyData: NewPropertyData) => Promise<{ property: Property | null; error: string | null }>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider = ({ children }: PropertyProviderProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth(); // Use Supabase auth user

  useEffect(() => {
    
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const { data: fetchedProperties, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching properties from Supabase:", error);
          setProperties([]);
        } else {
          setProperties(fetchedProperties as Property[] || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching properties:", error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []); // Re-fetch if needed based on other dependencies, e.g., user changes if properties are user-specific

  const featuredProperties = properties.filter(property => property.is_featured);

  const searchProperties = (filters: SearchFilters) => {
    return properties.filter(property => {
      if (filters.location &&
          !property.location.toLowerCase().includes(filters.location.toLowerCase()) &&
          !property.district.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.minPrice !== undefined && property.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && property.price > filters.maxPrice) return false;
      if (filters.bedrooms !== undefined && property.bedrooms < filters.bedrooms) return false;
      if (filters.propertyType && property.type !== filters.propertyType) return false;
      if (filters.is_self_contained !== undefined && property.is_self_contained !== filters.is_self_contained) return false;
      return true;
    });
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const getSimilarProperties = (property: Property, limit: number = 4) => {
    const priceRange = property.price * 0.3; // 30% price tolerance
    const minPrice = property.price - priceRange;
    const maxPrice = property.price + priceRange;
    
    return properties
      .filter(p => 
        p.id !== property.id && // Exclude current property
        p.district === property.district && // Same district
        p.type === property.type && // Same property type
        p.listing_type === property.listing_type && // Same listing type
        p.price >= minPrice && p.price <= maxPrice // Similar price range
      )
      .sort((a, b) => {
        // Sort by location similarity first, then price similarity
        const aLocationMatch = a.location.toLowerCase().includes(property.location.toLowerCase()) ? 1 : 0;
        const bLocationMatch = b.location.toLowerCase().includes(property.location.toLowerCase()) ? 1 : 0;
        
        if (aLocationMatch !== bLocationMatch) {
          return bLocationMatch - aLocationMatch;
        }
        
        // Sort by price similarity
        const aPriceDiff = Math.abs(a.price - property.price);
        const bPriceDiff = Math.abs(b.price - property.price);
        return aPriceDiff - bPriceDiff;
      })
      .slice(0, limit);
  };

  const addProperty = async (propertyData: NewPropertyData): Promise<{ property: Property | null; error: string | null }> => {
    if (!user) {
      return { property: null, error: "User not authenticated to add property" };
    }
    
    try {
      // Simple permission check - in a real app, you might want more sophisticated checks
      const canListProperties = user.profile?.role === 'landlord' || user.profile?.role === 'real_estate_agency' || user.profile?.role === 'admin';
      
      if (!canListProperties) {
        return { property: null, error: "You don't have permission to list properties" };
      }
      
      const propertyToInsert = {
        ...propertyData,
        created_by: user.id,
        landlord_id: user.id, // Assuming the user adding the property is the landlord
        is_featured: propertyData.is_featured || false, // Default if not provided
        views: 0, // Initialize views to 0
        // 'created_at' will be set by Supabase (DEFAULT now())
      };

      const { data: newProperty, error } = await supabase
        .from('properties')
        .insert([propertyToInsert])
        .select()
        .single(); // Assuming you insert one record and want it back

      if (error) {
        console.error('Error adding property to Supabase:', error);
        return { property: null, error: error.message };
      }
      
      if (!newProperty) {
        return { property: null, error: "Property data not returned after insert" };
      }

      setProperties(prev => [newProperty as Property, ...prev]);
      return { property: newProperty as Property, error: null };
    } catch (error) {
      console.error('Unexpected error in addProperty:', error);
      return { property: null, error: "An unexpected error occurred. Please try again." };
    }
  };


  return (
    <PropertyContext.Provider value={{
      properties,
      featuredProperties,
      isLoading,
      searchProperties,
      getPropertyById,
      getSimilarProperties,
      addProperty,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

export default PropertyContext;
