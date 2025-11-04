import { analyticsService } from './analyticsService';

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
  });
});