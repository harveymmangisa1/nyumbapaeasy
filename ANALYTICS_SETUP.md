# Analytics System Setup

This document explains how to set up the analytics system for the NyumbaPaeasy platform.

## Overview

The analytics system tracks property views and provides insights for both landlords and administrators. It includes:

1. Property view tracking
2. Analytics dashboard for landlords
3. Comprehensive analytics dashboard for administrators
4. Detailed analytics page with data tables

## Simplified Implementation

This is a simplified client-side implementation that works with the existing properties table by adding a `views` column.

## Database Schema

### Tables
1. `properties` - Added `views` column to track view counts

## Setup Instructions

### 1. Run the Database Migration

Execute the SQL migration file `src/pages/supabase/migrations/20250717000000_add_views_to_properties.sql` in your Supabase SQL editor.

The migration contains:

```sql
-- Add views column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add a comment to describe the column
COMMENT ON COLUMN public.properties.views IS 'Number of times this property has been viewed';
```

### 2. Install Dependencies

The required dependencies should already be installed:

```bash
# npm install recharts (no longer needed - using HTML tables instead)
```

They are already listed in your package.json.

## Features

### Property View Tracking

The system automatically tracks property views when users visit property detail pages. Each view increments the `views` count on the property record.

### Landlord Dashboard

Landlords can view analytics for their properties directly in their dashboard:
- Total views across all properties
- Popular properties list with view counts
- Views displayed in property listings

### Admin Dashboard

Administrators have access to platform-wide analytics:
- Total users and properties
- Total views across the platform
- Popular properties across the platform
- Recent user and property activity with view counts

### Analytics Page

Both landlords and administrators have access to a dedicated analytics page with:
- Data tables for property performance metrics
- Filtering options
- Comparative analysis tools

## Testing the Implementation

1. Visit property detail pages to generate view counts
2. Check landlord dashboard for total views and popular properties
3. Check admin dashboard for platform-wide analytics
4. Visit the dedicated analytics page for detailed visualizations

## Troubleshooting

If you encounter issues:

1. Ensure the database migration has been run successfully
2. Check that the `views` column exists on the `properties` table
3. Verify that the Supabase client is properly configured
4. Check browser console for any JavaScript errors

## Future Enhancements

Possible future enhancements to the analytics system:
1. More detailed tracking (unique visitors, time spent, etc.)
2. Geographic tracking of visitors
3. Device and browser analytics
4. Conversion tracking (inquiries, contacts)
5. Integration with external analytics services
6. Export functionality for reports
7. Advanced filtering and reporting capabilities