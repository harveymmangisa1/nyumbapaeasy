import { analyticsService } from '../services/analyticsService';

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
          update: jest.fn(() => Promise.resolve({ error: null })),
          order: jest.fn(() => ({ limit: jest.fn(() => Promise.resolve({ data: [], error: null })) }))
        }))
      })),
      rpc: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackPropertyView', () => {
    it('should increment views count for a property', async () => {
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { views: 5 }, error: null })
          })
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null })
        })
      });
      
      const result = await analyticsService.trackPropertyView('property-123');
      
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
    });

    it('should handle errors when tracking property views', async () => {
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ error: new Error('Database error') })
          })
        })
      });
      
      const result = await analyticsService.trackPropertyView('property-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getPropertyViews', () => {
    it('should return the views count for a property', async () => {
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { views: 10 }, error: null })
          })
        })
      });
      
      const result = await analyticsService.getPropertyViews('property-123');
      
      expect(result.views).toBe(10);
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
    });

    it('should return 0 views if property not found', async () => {
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.from.mockReturnValue({
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
      const mockSupabase = require('../lib/supabase').supabase;
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [{ views: 5 }, { views: 10 }, { views: 15 }], error: null })
        })
      });
      
      const result = await analyticsService.getLandlordTotalViews('landlord-123');
      
      expect(result.totalViews).toBe(30);
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
    });
  });
});