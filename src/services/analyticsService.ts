import { supabase } from '../lib/supabase';

export const analyticsService = {
  trackEvent: async (eventName: string, eventData: Record<string, unknown>) => {
    try {
      const { error } = await supabase.from('analytics_events').insert([
        { event_name: eventName, event_data: eventData },
      ]);
      if (error) throw error;
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  trackPropertyView: async (propertyId: string) => {
    try {
      const { error } = await supabase.rpc('increment_property_view', { p_id: propertyId });
      if (error) throw error;
      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  getPropertyViews: async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('views')
        .eq('id', propertyId)
        .single();
      if (error) throw error;
      return { views: data?.views || 0 };
    } catch (error: unknown) {
      return { views: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  getLandlordTotalViews: async (landlordId: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('views')
        .eq('landlord_id', landlordId);
      if (error) throw error;
      const totalViews = data?.reduce((acc, property) => acc + property.views, 0) || 0;
      return { totalViews };
    } catch (error: unknown) {
      return { totalViews: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};