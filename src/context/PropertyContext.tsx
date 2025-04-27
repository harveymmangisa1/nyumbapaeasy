import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { useUser } from "./UserContext";
import { db, auth } from "../firebaseconfig";

export interface Property {
  // src/context/PropertyContext.tsx
  id: string;
  createdBy: string; // Add this
  landlordId: string;
  landlordName: string;
  landlordContact: string;
  createdAt: Timestamp;
  isFeatured: boolean;
  title: string;
  description: string;
  price: number;
  location: string;
  district: string;
  type: 'apartment' | 'house' | 'room' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: string;
  isSelfContained: boolean;
  amenities: string[];
  images: string[];
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  isSelfContained?: boolean;
}

interface PropertyContextType {
  properties: Property[];
  featuredProperties: Property[];
  isLoading: boolean;
  searchProperties: (filters: SearchFilters) => Property[];
  getPropertyById: (id: string) => Property | undefined;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'landlordId' | 'landlordName' | 'landlordContact'>) => Promise<string | null>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider = ({ children }: PropertyProviderProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const propertiesCollectionRef = collection(db, 'properties');
        const q = query(propertiesCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const propertiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt instanceof Timestamp 
            ? doc.data().createdAt 
            : Timestamp.now(),
        })) as Property[];

        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const featuredProperties = properties.filter(property => property.isFeatured);

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
      if (filters.isSelfContained !== undefined && property.isSelfContained !== filters.isSelfContained) return false;
      return true;
    });
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...propertyData,
        createdBy: auth.currentUser?.uid || '', // Direct UID access
        landlordId: auth.currentUser?.uid || '',
        createdAt: serverTimestamp()
      });
  
      // Update local state
      setProperties(prev => [{
        ...propertyData,
        id: docRef.id,
        createdBy: auth.currentUser?.uid || '',
        createdAt: Timestamp.now()
      }, ...prev]);
  
      return docRef.id;
    } catch (error) {
      console.error('Add property error:', error);
      return null;
    }
  };
  return (
    <PropertyContext.Provider value={{
      properties,
      featuredProperties,
      isLoading,
      searchProperties,
      getPropertyById,
      addProperty,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyContext;