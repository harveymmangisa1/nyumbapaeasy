import { analyticsService } from './analyticsService';

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
    })),
    rpc: jest.fn(() => Promise.resolve({ data: null, error: null })),
  },
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should track an event', async () => {
      const result = await analyticsService.trackEvent('test_event', { foo: 'bar' });
      expect(result.success).toBe(true);
    });
  });

  describe('trackPropertyView', () => {
    it('should increment views count for a property', async () => {
      const result = await analyticsService.trackPropertyView('property-123');
      expect(result.success).toBe(true);
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
    });
  });
});