import { analyticsService } from '../services/analyticsService';
import { supabase } from '../lib/supabase';

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackPropertyView', () => {
    it('should increment views count for a property', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: null });
      const result = await analyticsService.trackPropertyView('property-123');
      
      expect(result.success).toBe(true);
    });

    it('should handle errors when tracking property views', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ error: new Error('Database error') });
      
      const result = await analyticsService.trackPropertyView('property-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getPropertyViews', () => {
    it('should return the views count for a property', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { views: 10 }, error: null })
          })
        })
      });
      
      const result = await analyticsService.getPropertyViews('property-123');
      
      expect(result.views).toBe(10);
      expect(supabase.from).toHaveBeenCalledWith('properties');
    });

    it('should return 0 views if property not found', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      });
      
      const result = await analyticsService.getPropertyViews('property-123');
      
      expect(result.views).toBe(0);
    });
  });

  describe('getLandlordTotalViews', () => {
    it('should calculate total views for all landlord properties', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [{ views: 5 }, { views: 10 }, { views: 15 }], error: null })
        })
      });
      
      const result = await analyticsService.getLandlordTotalViews('landlord-123');
      
      expect(result.totalViews).toBe(30);
      expect(supabase.from).toHaveBeenCalledWith('properties');
    });
  });
});