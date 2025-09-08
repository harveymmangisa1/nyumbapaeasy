import { analyticsService } from '../services/analyticsService';

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null })
  }
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackPropertyView', () => {
    it('should increment views count for a property', async () => {
      const mockProperty = { views: 5 };
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.select.mockResolvedValueOnce({ data: mockProperty, error: null });
      mockSupabase.update.mockResolvedValueOnce({ error: null });
      
      const result = await analyticsService.trackPropertyView('property-123');
      
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
      expect(mockSupabase.select).toHaveBeenCalledWith('views');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'property-123');
      expect(mockSupabase.update).toHaveBeenCalledWith({ views: 6 });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'property-123');
    });

    it('should handle errors when tracking property views', async () => {
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.select.mockResolvedValueOnce({ error: new Error('Database error') });
      
      const result = await analyticsService.trackPropertyView('property-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getPropertyViews', () => {
    it('should return the views count for a property', async () => {
      const mockProperty = { views: 10 };
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.select.mockResolvedValueOnce({ data: mockProperty, error: null });
      
      const result = await analyticsService.getPropertyViews('property-123');
      
      expect(result.views).toBe(10);
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
      expect(mockSupabase.select).toHaveBeenCalledWith('views');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'property-123');
    });

    it('should return 0 views if property not found', async () => {
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.select.mockResolvedValueOnce({ data: null, error: null });
      
      const result = await analyticsService.getPropertyViews('property-123');
      
      expect(result.views).toBe(0);
    });
  });

  describe('getLandlordTotalViews', () => {
    it('should calculate total views for all landlord properties', async () => {
      const mockProperties = [
        { views: 5 },
        { views: 10 },
        { views: 15 }
      ];
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.select.mockResolvedValueOnce({ data: mockProperties, error: null });
      
      const result = await analyticsService.getLandlordTotalViews('landlord-123');
      
      expect(result.totalViews).toBe(30);
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
      expect(mockSupabase.select).toHaveBeenCalledWith('views');
      expect(mockSupabase.eq).toHaveBeenCalledWith('landlord_id', 'landlord-123');
    });
  });
});