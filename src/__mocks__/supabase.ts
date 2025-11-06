export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        update: jest.fn(() => Promise.resolve({ error: null })),
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    })),
    insert: jest.fn(() => Promise.resolve({ data: null, error: null }))
  })),
  rpc: jest.fn(() => Promise.resolve({ data: null, error: null }))
};