# NyumbaPaeasy Verification System

## Overview
The verification system ensures that landlords and agents on NyumbaPaeasy are legitimate by requiring them to upload verification documents. This helps prevent scams and maintains the quality of listings on the platform.

## Features

### 1. Document Upload
- Users can upload business licenses, property deeds, national IDs, or other documents
- Supported file types: Images (PNG, JPG) and PDFs
- Maximum file size: 5MB

### 2. Verification Status
Users can have one of three verification statuses:
- **Verified**: Document has been approved by admin
- **Pending**: Document has been uploaded and is awaiting review
- **Not Verified**: No documents have been uploaded or all documents have been rejected

### 3. Admin Verification Interface
- Admins can review all uploaded documents
- Filter documents by status (pending, verified, rejected)
- View document details and user information
- Approve or reject documents with admin notes

### 4. Access Control
- New landlords have 5 days to upload verification documents
- Accounts without verified documents after 5 days lose the ability to list or manage properties
- Verified accounts can list and manage properties indefinitely

## Database Structure

### verification_documents Table
```sql
CREATE TABLE public.verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT CHECK (document_type IN ('business_license', 'property_deed', 'national_id', 'other')),
    document_url TEXT,
    document_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage
- Documents are stored in the `verification-documents` bucket in Supabase Storage
- Files are organized by user ID: `user_id/filename.ext`

## Implementation Details

### User Context
The UserContext has been enhanced to include:
- `isVerified`: Boolean indicating if user has verified documents
- `hasPendingVerification`: Boolean indicating if user has pending documents
- `verificationDocuments`: Array of all user's verification documents
- `refreshUserVerificationStatus`: Function to refresh verification status

### Components
1. **VerificationDocumentUpload**: Component for uploading documents
2. **VerificationBadge**: Displays verification status in UI

### Pages
1. **ProfilePage**: Shows verification status and upload component
2. **AdminVerificationPage**: Admin interface for reviewing documents

### Services
1. **verificationService**: Contains functions for checking user permissions
2. **databaseService**: Updated to work with Supabase

## User Flow

### Landlord/Agent Registration
1. User registers as landlord/agent
2. User is redirected to profile page
3. User sees verification prompt
4. User uploads verification documents
5. Documents appear as "Pending" in user's profile
6. Admin reviews documents (24-48 hour turnaround)
7. If approved, user status becomes "Verified"
8. If rejected, user can upload new documents

### Access Control
1. New users have 5 days to verify their account
2. After 5 days, unverified accounts lose property listing permissions
3. Verified accounts retain full access indefinitely

## Admin Workflow

### Reviewing Documents
1. Admin navigates to `/admin/verification`
2. Filters documents by status (default: pending)
3. Clicks on a document to view details
4. Reviews document in new tab
5. Adds admin notes if necessary
6. Clicks "Verify" or "Reject"
7. User is notified of status change

## Security

### Row Level Security (RLS)
- Users can only view their own documents
- Users can only upload documents for themselves
- Users can only update pending documents
- Admins can view and update all documents

### Storage Policies
- Users can only upload to their own folder
- Users can only view their own documents
- Admins can view all documents

## API Functions

### is_user_verified(user_uuid)
Returns boolean indicating if user has verified documents

### is_user_verification_pending(user_uuid)
Returns boolean indicating if user has pending documents

## Error Handling
- File size limits enforced (5MB)
- File type validation (images and PDFs only)
- Graceful error handling for upload failures
- User-friendly error messages

## Future Enhancements
1. Email notifications for status changes
2. Automatic reminders for pending verifications
3. Support for multiple document types
4. Document expiration and renewal system
5. Enhanced admin dashboard with statistics