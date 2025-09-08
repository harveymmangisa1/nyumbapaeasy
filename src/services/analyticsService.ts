import { supabase } from '../lib/supabase';

// Simple client-side analytics service that works with existing properties table
export const analyticsService = {
  // Track a property view by incrementing the views count
  async trackPropertyView(propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current views count
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('views')
        .eq('id', propertyId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update views count
      const currentViews = property?.views || 0;
      const { error: updateError } = await supabase
        .from('properties')
        .update({ views: currentViews + 1 })
        .eq('id', propertyId);
      
      if (updateError) throw updateError;
      
      return { success: true };
    } catch (error: any) {
      console.error('Error tracking property view:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  },

  // Get view statistics for a specific property
  async getPropertyViews(propertyId: string): Promise<{ views: number; error?: string }> {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .select('views')
        .eq('id', propertyId)
        .single();
      
      if (error) throw error;
      
      return { views: property?.views || 0 };
    } catch (error: any) {
      console.error('Error fetching property views:', error);
      return { views: 0, error: error.message || 'Unknown error' };
    }
  },

  // Get total views for all properties of a landlord
  async getLandlordTotalViews(landlordId: string): Promise<{ totalViews: number; error?: string }> {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('views')
        .eq('landlord_id', landlordId);
      
      if (error) throw error;
      
      const totalViews = properties?.reduce((sum, property) => sum + (property.views || 0), 0) || 0;
      
      return { totalViews };
    } catch (error: any) {
      console.error('Error fetching landlord total views:', error);
      return { totalViews: 0, error: error.message || 'Unknown error' };
    }
  },

  // Get popular properties for a landlord (top 5 by views)
  async getPopularProperties(landlordId: string): Promise<{ properties: any[]; error?: string }> {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, views')
        .eq('landlord_id', landlordId)
        .order('views', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      return { properties: properties || [] };
    } catch (error: any) {
      console.error('Error fetching popular properties:', error);
      return { properties: [], error: error.message || 'Unknown error' };
    }
  },

  // Get popular properties platform-wide (top 5 by views)
  async getPopularPropertiesAdmin(): Promise<{ properties: any[]; error?: string }> {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, views, landlord_name')
        .order('views', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      return { properties: properties || [] };
    } catch (error: any) {
      console.error('Error fetching popular properties (admin):', error);
      return { properties: [], error: error.message || 'Unknown error' };
    }
  },
  
  // Get landlord analytics summary
  async getLandlordAnalyticsSummary(landlordId: string): Promise<{ data: any; error?: string }> {
    try {
      // Get total views and unique visitors
      const { data: summary, error: summaryError } = await supabase.rpc('get_landlord_analytics_summary', {
        landlord_id: landlordId
      });
      
      if (summaryError) throw summaryError;
      
      // Get popular properties
      const { data: popularProperties, error: popularError } = await supabase.rpc('get_popular_properties', {
        landlord_id: landlordId
      });
      
      if (popularError) throw popularError;
      
      // Get views by date
      const { data: viewsByDate, error: viewsError } = await supabase.rpc('get_views_by_date', {
        landlord_id: landlordId
      });
      
      if (viewsError) throw viewsError;
      
      const { count: totalProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('landlord_id', landlordId);
      
      if (propertiesError) throw propertiesError;
      
      return {
        data: {
          total_views: summary?.total_views || 0,
          unique_visitors: summary?.unique_visitors || 0,
          popular_properties: popularProperties || [],
          views_by_date: viewsByDate || [],
          total_properties: totalProperties || 0
        }
      };
    } catch (error: any) {
      console.error('Error fetching landlord analytics summary:', error);
      return { data: null, error: error.message || 'Unknown error' };
    }
  },
  
  // Get admin analytics summary
  async getAdminAnalyticsSummary(): Promise<{ data: any; error?: string }> {
    try {
      // Get total views and unique visitors
      const { data: summary, error: summaryError } = await supabase.rpc('get_admin_analytics_summary');
      
      if (summaryError) throw summaryError;
      
      // Get popular properties
      const { data: popularProperties, error: popularError } = await supabase.rpc('get_popular_properties_admin');
      
      if (popularError) throw popularError;
      
      // Get views by date
      const { data: viewsByDate, error: viewsError } = await supabase.rpc('get_views_by_date_admin');
      
      if (viewsError) throw viewsError;
      
      // Get total properties
      const { count: totalProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
      
      if (propertiesError) throw propertiesError;
      
      return {
        data: {
          total_views: summary?.total_views || 0,
          unique_visitors: summary?.unique_visitors || 0,
          popular_properties: popularProperties || [],
          views_by_date: viewsByDate || [],
          total_properties: totalProperties || 0
        }
      };
    } catch (error: any) {
      console.error('Error fetching admin analytics summary:', error);
      return { data: null, error: error.message || 'Unknown error' };
    }
  }
};