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
      console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
      console.log('Please copy .env.example to .env and fill in your Supabase credentials');
      return;
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create execute_sql function if it doesn't exist
    const { error: createFunctionError } = await supabase.rpc('execute_sql', { sql: "create or replace function execute_sql(sql text) returns void as $$begin  execute sql;end;$$ language plpgsql volatile security definer;" });
    if (createFunctionError && createFunctionError.code !== '42723') { // 42723 = function already exists
      console.error('Error creating execute_sql function:', createFunctionError);
      return;
    }

    // Create migrations table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('execute_sql', { sql: 'CREATE TABLE IF NOT EXISTS public.migrations (name TEXT PRIMARY KEY);' });
    if (createTableError) {
      console.error('Error creating migrations table:', createTableError);
      return;
    }

    // Get already run migrations
    const { data: runMigrations, error: fetchMigrationsError } = await supabase.from('migrations').select('name');
    if (fetchMigrationsError) {
      console.error('Error fetching migrations:', fetchMigrationsError);
      return;
    }
    const runMigrationNames = runMigrations.map(m => m.name);

    const migrationsDir = path.join(process.cwd(), 'src', 'pages', 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();

    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        if (runMigrationNames.includes(file)) {
          console.log(`Skipping already run migration: ${file}`);
          continue;
        }

        console.log(`Running migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        const { error } = await supabase.rpc('execute_sql', { sql: migrationSQL });

        if (error) {
          console.error(`Error executing migration from ${file}:`, JSON.stringify(error, null, 2));
          return;
        }

        if (file !== '20250712000000_drop_all_tables.sql') {
          // Add migration to migrations table
          const { error: insertError } = await supabase.from('migrations').insert({ name: file });
          if (insertError) {
            console.error(`Error inserting migration ${file} into migrations table:`, insertError);
            return;
          }
        }
      }
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

runMigrations();
