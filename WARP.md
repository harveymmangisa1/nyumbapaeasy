# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

NyumbaPaeasy is a React TypeScript house listing and property management platform for Malawi, built with Supabase as the backend service. The platform enables landlords to list properties, renters to search and view properties, and administrators to manage the entire system.

## Development Commands

### Common Development Tasks

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Development Server
- **Port**: 5175 (configured in Vite)
- **Access**: http://localhost:5175

## Architecture & Code Structure

### Technology Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Build Tool**: Vite 6.3.6
- **State Management**: React Context API
- **Icons**: Lucide React
- **Testing**: Jest with React Testing Library

### Key Directories
- `src/components/` - Reusable UI components organized by feature
- `src/pages/` - Page components for routing
- `src/context/` - React context providers for global state
- `src/lib/` - Library configurations (Supabase client)
- `src/services/` - Business logic and API services
- `src/types/` - TypeScript type definitions

### Database Schema (Supabase)
Main tables:
- `profiles` - User profiles with roles (admin, landlord, renter)
- `properties` - Property listings with full details
- `verification_documents` - Document verification for landlords
- `inquiries` - Property inquiries from renters

### Authentication & Roles
- **Supabase Auth** for user management
- **Role-based access control**: admin, landlord, renter
- **Verification system** for landlords with document upload

## Core Features

### Property Management
- **Add Properties**: Enhanced form with validation and image upload
- **Edit Properties**: Full property editing with access control
- **Property Search**: Advanced filtering by location, price, type, amenities
- **Property Details**: Comprehensive property view with contact forms

### User Management
- **Registration/Login**: Supabase authentication
- **Profile Management**: User profiles with verification status
- **Role Assignment**: Admin can manage user roles

### Admin Panel
- **User Management**: View and manage all users
- **Property Oversight**: Monitor all property listings
- **Verification System**: Review and approve landlord documents
- **Analytics Dashboard**: Property views and popular listings

### File Management
- **Supabase Storage** for property images and verification documents
- **Image validation**: File type, size, and quantity limits
- **Automatic image optimization** and CDN delivery

## Important Implementation Details

### Form Validation
All forms implement comprehensive validation:
- Client-side validation with real-time feedback
- File upload validation (size, type, quantity)
- Business logic validation (e.g., commercial properties)

### Error Handling
- Comprehensive error boundaries and fallbacks
- User-friendly error messages
- Loading states for all async operations

### Image Upload System
- Maximum 10 images per property
- 5MB file size limit per image
- Supported formats: JPEG, JPG, PNG, WEBP
- Automatic path generation for Supabase Storage

### Security Considerations
- Row Level Security (RLS) policies in Supabase
- Role-based component access control
- Input sanitization and validation
- Secure file upload handling

## Environment Setup

### Required Environment Variables
Create `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Configuration
- Enable Authentication providers
- Set up Storage buckets: `property-images`, `verification-documents`
- Configure RLS policies for data security
- Run database migrations from `src/pages/supabase/migrations/`

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for React and TypeScript
- Tailwind CSS for styling with consistent design system
- Functional components with React Hooks

### State Management
- React Context API for global state (User, Properties)
- Local state for component-specific data
- Supabase client for data persistence

### Component Organization
- Feature-based organization in `src/components/`
- Reusable UI components with proper TypeScript types
- Page components handle routing and data fetching
- Service layer for business logic separation

### Testing Strategy
- Jest for unit tests
- React Testing Library for component tests
- Focus on critical user flows and business logic

## Common Tasks for Future Development

### Adding New Property Fields
1. Update `Property` interface in `src/context/PropertyContext.tsx`
2. Modify property forms in `AddPropertyPage.tsx` and `EditPropertyPage.tsx`
3. Update property display in `PropertyDetailPage.tsx`
4. Run database migration to add new columns

### Adding New User Roles
1. Update role types in user context
2. Modify authentication checks in protected routes
3. Update admin panel for role management
4. Add role-specific features and permissions

### Extending Analytics
1. Add new tracking events in `src/services/analyticsService.ts`
2. Update admin dashboard to display new metrics
3. Create new analytics pages as needed

### Performance Optimization
- Implement lazy loading for routes
- Add image optimization and lazy loading
- Use React.memo for expensive components
- Optimize Supabase queries with proper indexing

## Production Deployment

### Build Process
- `npm run build` creates optimized production build
- Static assets are generated in `dist/` directory
- Vite handles code splitting and optimization automatically

### Deployment Checklist
- Configure production Supabase instance
- Set up proper environment variables
- Configure domain and CORS settings
- Set up monitoring and error tracking
- Test all critical user flows

### Monitoring
- Monitor Supabase usage and performance
- Track user registration and property listing metrics
- Set up error logging (recommended: Sentry)
- Monitor image storage usage and costs

## Support & Documentation

### Key Files to Reference
- `src/context/PropertyContext.tsx` - Property management logic
- `src/context/UserContext.tsx` - User authentication and profiles
- `src/services/analyticsService.ts` - Analytics tracking
- `package.json` - Dependencies and scripts

### External Dependencies
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vite Documentation](https://vitejs.dev/)

This platform is designed for easy extension and maintenance, with clean separation of concerns and comprehensive type safety throughout the codebase.
