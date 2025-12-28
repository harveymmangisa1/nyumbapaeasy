export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'landlord' | 'renter' | 'real_estate_agency' | 'lodge_owner' | 'bnb_owner';
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  district: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  listing_type: 'rent' | 'sale' | 'lease';
  status: 'available' | 'sold' | 'rented';
  amenities: string[];
  is_verified: boolean;
  views: number;
  created_at: string;
}

// Verification document interface
export interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: 'business_license' | 'property_deed' | 'national_id' | 'other';
  document_url: string;
  document_name: string;
  status: 'pending' | 'verified' | 'rejected';
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

// Profile interface
export interface Profile {
  id: string;
  name: string;
  role: 'admin' | 'landlord' | 'renter' | 'real_estate_agency' | 'lodge_owner' | 'bnb_owner';
  business_registration_number?: string | null;
  license_number?: string | null;
  manager_names?: string | null;
  created_at: string;
  updated_at: string;
}

// Property view tracking interface
export interface PropertyView {
  id: string;
  property_id: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

// Property view statistics interface
export interface PropertyViewStats {
  property_id: string;
  property_title: string;
  total_views: number;
  unique_views: number;
  last_viewed: string;
}

// Add more interfaces for your other tables