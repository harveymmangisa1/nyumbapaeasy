import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

async function runMigrations() {
  try {
    // Check if environment variables are set
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return;
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create execute_sql function if it doesn't exist
    const { error: createFunctionError } = await supabase.rpc('execute_sql', { sql: "create or replace function execute_sql(sql text) returns void as $$begin  execute sql;end;$$ language plpgsql volatile security definer;" });
    if (createFunctionError && createFunctionError.code !== '42723') { // 42723 = function already exists
      return;
    }

    // Create migrations table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('execute_sql', { sql: 'CREATE TABLE IF NOT EXISTS public.migrations (name TEXT PRIMARY KEY);' });
    if (createTableError) {
      return;
    }

    // Get already run migrations
    const { data: runMigrations, error: fetchMigrationsError } = await supabase.from('migrations').select('name');
    if (fetchMigrationsError) {
      return;
    }
    const runMigrationNames = runMigrations.map(m => m.name);

    const migrationsDir = path.join(process.cwd(), 'src', 'pages', 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();

    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        if (runMigrationNames.includes(file)) {
          continue;
        }

        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        const { error } = await supabase.rpc('execute_sql', { sql: migrationSQL });

        if (error) {
          return;
        }

        if (file !== '20250712000000_drop_all_tables.sql') {
          // Add migration to migrations table
          const { error: insertError } = await supabase.from('migrations').insert({ name: file });
          if (insertError) {
            return;
          }
        }
      }
    }

  } catch (error) {
  }
}

runMigrations();
