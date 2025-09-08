import { supabase } from '../lib/supabase';

export interface VerificationCheckResult {
  canListProperties: boolean;
  reason: string | null;
  daysRemaining: number | null;
}

/**
 * Check if a user can list properties based on their verification status
 * @param userId The user ID to check
 * @returns VerificationCheckResult with permission status and details
 */
export const checkUserPropertyListingPermission = async (userId: string): Promise<VerificationCheckResult> => {
  try {
    // First, check if user is verified
    const { data: verifiedDocs, error: verifiedError } = await supabase
      .from('verification_documents')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'verified');
    
    if (verifiedError) throw verifiedError;
    
    // If user has verified documents, they can list properties
    if (verifiedDocs.length > 0) {
      return {
        canListProperties: true,
        reason: null,
        daysRemaining: null
      };
    }
    
    // Check if user has pending verification
    const { data: pendingDocs, error: pendingError } = await supabase
      .from('verification_documents')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'pending');
    
    if (pendingError) throw pendingError;
    
    // If user has pending verification, check submission date
    if (pendingDocs.length > 0) {
      // Get the earliest pending document submission date
      const { data: earliestPending, error: dateError } = await supabase
        .from('verification_documents')
        .select('submitted_at')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true })
        .limit(1);
      
      if (dateError) throw dateError;
      
      if (earliestPending && earliestPending.length > 0) {
        const submissionDate = new Date(earliestPending[0].submitted_at);
        const fiveDaysLater = new Date(submissionDate);
        fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
        
        const today = new Date();
        const timeDiff = fiveDaysLater.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysRemaining >= 0) {
          return {
            canListProperties: true,
            reason: `Verification pending. ${daysRemaining} days remaining to complete verification.`,
            daysRemaining
          };
        } else {
          return {
            canListProperties: false,
            reason: 'Verification period expired. Please verify your account to list properties.',
            daysRemaining: 0
          };
        }
      }
    }
    
    // If no verified or pending documents, check account creation date
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    if (profile) {
      const createdAt = new Date(profile.created_at);
      const fiveDaysLater = new Date(createdAt);
      fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
      
      const today = new Date();
      const timeDiff = fiveDaysLater.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysRemaining >= 0) {
        return {
          canListProperties: true,
          reason: `New account. ${daysRemaining} days remaining to verify your account.`,
          daysRemaining
        };
      } else {
        return {
          canListProperties: false,
          reason: 'Verification period expired. Please verify your account to list properties.',
          daysRemaining: 0
        };
      }
    }
    
    // Default case - should not happen
    return {
      canListProperties: false,
      reason: 'Unable to determine verification status.',
      daysRemaining: null
    };
  } catch (error) {
    console.error('Error checking user property listing permission:', error);
    return {
      canListProperties: false,
      reason: 'Error checking verification status. Please try again later.',
      daysRemaining: null
    };
  }
};

/**
 * Check if a user is verified
 * @param userId The user ID to check
 * @returns Boolean indicating if user is verified
 */
export const isUserVerified = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('is_user_verified', { user_uuid: userId });
    
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error checking user verification status:', error);
    return false;
  }
};

/**
 * Check if a user has pending verification
 * @param userId The user ID to check
 * @returns Boolean indicating if user has pending verification
 */
export const isUserVerificationPending = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('is_user_verification_pending', { user_uuid: userId });
    
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error checking user verification pending status:', error);
    return false;
  }
};