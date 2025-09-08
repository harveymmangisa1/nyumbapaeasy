// Script to run Supabase migrations
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function runMigration() {
  try {
    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file');
      console.log('Please copy .env.example to .env and fill in your Supabase credentials');
      return;
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read the analytics migration file
    const migrationPath = path.join(__dirname, 'migrations', '20250716000000_analytics_system.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`Migration file not found: ${migrationPath}`);
      return;
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} statements to execute...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements or comments
      if (statement.startsWith('--') || statement.length === 0) {
        continue;
      }
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      console.log(`SQL: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
      
      // Execute the statement using Supabase's raw SQL execution
      const { error } = await supabase.rpc('execute_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        return;
      }
    }
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };