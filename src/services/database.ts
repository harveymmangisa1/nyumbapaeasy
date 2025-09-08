import { supabase } from '../lib/supabase'

// Generic type for database operations
export type DatabaseError = {
  message: string
  code?: string
}

// Generic function to handle database errors
const handleError = (error: any): DatabaseError => {
  console.error('Database error:', error)
  return {
    message: error.message || 'An error occurred',
    code: error.code
  }
}

// Example CRUD operations - replace 'your_table' with your actual table names
export const databaseService = {
  // Create
  async create<T>(table: string, data: T) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
      
      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      return { data: null, error: handleError(error) }
    }
  },

  // Read
  async get<T>(table: string, id: string) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data: data as T, error: null }
    } catch (error) {
      return { data: null, error: handleError(error) }
    }
  },

  // Read all
  async getAll<T>(table: string) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
      
      if (error) throw error
      return { data: data as T[], error: null }
    } catch (error) {
      return { data: null, error: handleError(error) }
    }
  },

  // Update
  async update<T>(table: string, id: string, data: Partial<T>) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      return { data: null, error: handleError(error) }
    }
  },

  // Delete
  async delete(table: string, id: string) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: handleError(error) }
    }
  },

  // Custom query
  async query<T>(table: string, query: any) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .match(query)
      
      if (error) throw error
      return { data: data as T[], error: null }
    } catch (error) {
      return { data: null, error: handleError(error) }
    }
  }
} 