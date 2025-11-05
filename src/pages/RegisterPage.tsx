import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Check, Building2, FileText, Briefcase, AlertCircle, CheckCircle2, Shield, BadgeAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FileUploadBox from '../components/FileUploadBox';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('renter');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Landlord verification
  const [nationalId, setNationalId] = useState('');
  const [nationalIdFile, setNationalIdFile] = useState(null);
  const [proofOfOwnership, setProofOfOwnership] = useState(null);
  const [skipLandlordVerification, setSkipLandlordVerification] = useState(false);
  
  // Agency verification
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [businessRegFile, setBusinessRegFile] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [managerNames, setManagerNames] = useState('');
  const [skipAgencyVerification, setSkipAgencyVerification] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Password validation criteria
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    });
  }, [password]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const checkEmailExists = useCallback(async (currentEmail: string) => {
    if (!currentEmail) {
      setEmailExists(false);
      return;
    }
    setCheckingEmail(true);
    try {
      // Supabase does not have a direct client-side method to check if an email exists
      // without attempting to sign up or send an OTP. A common workaround is to try
      // to sign in with OTP and catch the error, or use a server-side function.
      // For a client-side check, we'll attempt to get user by email, which requires
      // admin privileges. A safer client-side approach is to try signInWithOtp
      // and check the error message, or create a custom RPC function.
      // For simplicity and demonstration, we'll simulate a check here.
      // In a real app, you might have a serverless function or an RPC.

      // A more robust solution would involve a server-side check via an RPC:
      // const { data, error } = await supabase.rpc('check_email_exists', { email_to_check: currentEmail });
      // if (error && error.message.includes('duplicate key')) { setEmailExists(true); }

      // For now, we'll rely on the signUp error for actual existence, but provide
      // a basic client-side validation for format.
      // This part needs a backend function to be truly effective for existence.
      // For a client-side only check, we can only validate format.
      // To truly check existence, we'd need a custom Supabase Edge Function or a backend API.
      // For the purpose of this exercise, we'll assume a successful check means it doesn't exist.
      // If the email is valid format, we assume it doesn't exist until signUp proves otherwise.
      setEmailExists(false); // Assume false until proven true by actual signup error

      // A more practical client-side check for existence would be to try to sign in with OTP
      // and if it succeeds, it means the email exists. If it fails with a specific error,
      // it might mean the email doesn't exist or other issues.
      // However, calling signInWithOtp just to check existence is not ideal as it sends emails.

      // For now, we'll just ensure the format is valid.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
        setEmailExists(false); // Invalid format, not an existence issue
      } else {
        // Simulate a check. In a real app, this would be an API call.
        // For now, we'll just clear any previous existence error if format is valid.
        setEmailExists(false);
      }

    } catch (err) {
      console.error('Error checking email existence:', err);
      // If there's an error during the check, we can't confirm existence.
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (email) {
        checkEmailExists(email);
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [email, checkEmailExists]);

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setter(file);
    }
  };

  const removeFile = (setter) => {
    setter(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!name.trim()) {
      setError('Please enter your full name or company name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (emailExists) {
      setError('An account with this email already exists. Please log in or use a different email.');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    // Landlord verification checks
    if (role === 'landlord' && !skipLandlordVerification) {
      if (!nationalId.trim()) {
        setError('National ID number is required for verification');
        return;
      }
      if (!nationalIdFile) {
        setError('Please upload a copy of your National ID');
        return;
      }
      if (!proofOfOwnership) {
        setError('Please upload proof of property ownership');
        return;
      }
    }

    // Agency verification checks
    if (role === 'real_estate_agency' && !skipAgencyVerification) {
      if (!businessRegistrationNumber.trim()) {
        setError('Business Registration Number is required for verification');
        return;
      }
      if (!businessRegFile) {
        setError('Please upload your business registration certificate');
        return;
      }
      if (!licenseNumber.trim()) {
        setError('License Number is required for verification');
        return;
      }
      if (!licenseFile) {
        setError('Please upload your real estate license');
        return;
      }
      if (!managerNames.trim()) {
        setError('Manager Names are required for verification');
        return;
      }
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone_number: phoneNumber,
            // Include verification details if not skipping
            ...(role === 'landlord' && !skipLandlordVerification && {
              national_id: nationalId,
              // national_id_file: nationalIdFile, // Files handled separately
              // proof_of_ownership: proofOfOwnership,
            }),
            ...(role === 'real_estate_agency' && !skipAgencyVerification && {
              business_registration_number: businessRegistrationNumber,
              // business_reg_file: businessRegFile,
              license_number: licenseNumber,
              // license_file: licenseFile,
              manager_names: managerNames,
            }),
          },
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) {
        // Supabase will return an error if email already exists
        if (error.message.includes('already registered') || error.message.includes('exists')) {
          setEmailExists(true);
          setError('An account with this email already exists. Please log in or use a different email.');
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Handle file uploads for verification documents if not skipping
        if (role === 'landlord' && !skipLandlordVerification) {
          await uploadVerificationDocuments(data.user.id, 'landlord');
        }
        if (role === 'real_estate_agency' && !skipAgencyVerification) {
          await uploadVerificationDocuments(data.user.id, 'agency');
        }
      }

      setRegistrationSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVerificationDocuments = async (userId: string, userRole: 'landlord' | 'agency') => {
    const uploadFile = async (file: File | null, type: string) => {
      if (!file) return null;

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);
      
      const { error: insertError } = await supabase
        .from('verification_documents')
        .insert({
          user_id: userId,
          document_type: type,
          document_url: publicUrl,
          document_name: file.name,
          status: 'pending',
        });
      
      if (insertError) throw insertError;
      return publicUrl;
    };

    if (userRole === 'landlord') {
      await uploadFile(nationalIdFile, 'national_id');
      await uploadFile(proofOfOwnership, 'proof_of_ownership');
    } else if (userRole === 'agency') {
      await uploadFile(businessRegFile, 'business_registration');
      await uploadFile(licenseFile, 'real_estate_license');
    }
  };

  if (registrationSuccess) {
    const willBeVerified = role === 'renter' || 
                          (role === 'landlord' && !skipLandlordVerification) ||
                          (role === 'real_estate_agency' && !skipAgencyVerification);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">Account Created!</h2>
          <p className="text-slate-600 mb-6">
            We've sent a verification email to <span className="font-medium text-slate-900">{email}</span>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-left">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Verify your email</p>
                <p className="text-blue-700">Check your inbox and click the verification link to activate your account.</p>
              </div>
            </div>
          </div>

          {willBeVerified && (role === 'landlord' || role === 'real_estate_agency') && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-900">
                  <p className="font-medium mb-1">Document verification in progress</p>
                  <p className="text-amber-700">Your verification documents are being reviewed. This typically takes 1-2 business days.</p>
                </div>
              </div>
            </div>
          )}

          {!willBeVerified && (role === 'landlord' || role === 'real_estate_agency') && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <BadgeAlert className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-900">
                  <p className="font-medium mb-1">Unverified Account</p>
                  <p className="text-orange-700">Your profile will show an "Unverified" badge. Complete verification anytime from your dashboard to build trust.</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
          >
            Go to Login
          </button>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
              });
              if (error) {
                alert('Error resending verification email: ' + error.message);
              } else {
                alert('Verification email sent! Check your inbox.');
              }
            }}
            className="w-full mt-3 text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            Resend verification email
          </button>
        </div>
      </div>
    );
  }

  const FileUploadBox = ({ file, onUpload, onRemove, accept, label, description, setter }) => (
    <FileUploadBox
      file={file}
      onUpload={onUpload}
      onRemove={onRemove}
      accept={accept}
      label={label}
      description={description}
      setter={setter}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Create Account</h1>
              <p className="text-slate-600">Join NyumbaPaeasy to find your perfect home</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  I'm registering as
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'renter', label: 'Renter/Buyer', desc: 'Looking for property' },
                    { value: 'landlord', label: 'Landlord', desc: 'List properties' },
                    { value: 'real_estate_agency', label: 'Agency', desc: 'Real estate business' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        role === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${role === option.value ? 'text-emerald-900' : 'text-slate-900'}`}>
                          {option.label}
                        </span>
                        {role === option.value && (
                          <Check className="h-5 w-5 text-emerald-600" />
                        )}
                      </div>
                      <p className={`text-xs ${role === option.value ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
                  {role === 'real_estate_agency' ? 'Company Information' : 'Personal Information'}
                </h3>
                
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    {role === 'real_estate_agency' ? 'Company Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'real_estate_agency' ? 'Enter company name' : 'Enter your full name'}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailExists(false); // Reset on change
                        setError(''); // Clear general error on email change
                      }}
                      onBlur={() => checkEmailExists(email)} // Check on blur
                      placeholder="your.email@example.com"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all text-slate-900 placeholder:text-slate-400 ${
                        emailExists ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-emerald-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {checkingEmail && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">Checking...</span>
                    )}
                  </div>
                  {emailExists && (
                    <p className="text-xs text-red-600 mt-1">An account with this email already exists. Please log in or use a different email.</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">We'll send a verification link to this email</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+265 999 123 456"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Landlord Verification Section */}
              {role === 'landlord' && (
                <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
                        Landlord Verification (Optional)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Verify your identity to build trust with potential tenants
                      </p>
                    </div>
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>

                  {!skipLandlordVerification && (
                    <>
                      <div>
                        <label htmlFor="nationalId" className="block text-sm font-medium text-slate-700 mb-2">
                          National ID Number
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input
                            id="nationalId"
                            type="text"
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                            placeholder="e.g., NID123456789"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                          />
                        </div>
                      </div>

                      <FileUploadBox
                        file={nationalIdFile}
                        onUpload={handleFileUpload}
                        onRemove={removeFile}
                        accept="image/*,.pdf"
                        label="National ID Copy"
                        description="PDF or Image (max 5MB)"
                        setter={setNationalIdFile}
                      />

                      <FileUploadBox
                        file={proofOfOwnership}
                        onUpload={handleFileUpload}
                        onRemove={removeFile}
                        accept=".pdf,.doc,.docx,image/*"
                        label="Proof of Property Ownership"
                        description="Title deed, lease agreement, or property certificate"
                        setter={setProofOfOwnership}
                      />
                    </>
                  )}

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <input
                      id="skipLandlordVerification"
                      type="checkbox"
                      checked={skipLandlordVerification}
                      onChange={(e) => setSkipLandlordVerification(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded mt-0.5"
                    />
                    <label htmlFor="skipLandlordVerification" className="text-xs text-slate-600">
                      Skip verification for now. <span className="font-medium text-orange-600">Your profile will show an "Unverified" badge</span> until you complete verification from your dashboard.
                    </label>
                  </div>
                </div>
              )}

              {/* Agency Verification Section */}
              {role === 'real_estate_agency' && (
                <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
                        Agency Verification (Optional)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Verify your agency to gain client trust and credibility
                      </p>
                    </div>
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>

                  {!skipAgencyVerification && (
                    <>
                      <div>
                        <label htmlFor="businessReg" className="block text-sm font-medium text-slate-700 mb-2">
                          Business Registration Number
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input
                            id="businessReg"
                            type="text"
                            value={businessRegistrationNumber}
                            onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                            placeholder="e.g., BRN123456789"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                          />
                        </div>
                      </div>

                      <FileUploadBox
                        file={businessRegFile}
                        onUpload={handleFileUpload}
                        onRemove={removeFile}
                        accept=".pdf,image/*"
                        label="Business Registration Certificate"
                        description="PDF or Image (max 5MB)"
                        setter={setBusinessRegFile}
                      />
                      
                      <div>
                        <label htmlFor="license" className="block text-sm font-medium text-slate-700 mb-2">
                          Real Estate License Number
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input
                            id="license"
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="e.g., LIC987654321"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                          />
                        </div>
                      </div>

                      <FileUploadBox
                        file={licenseFile}
                        onUpload={handleFileUpload}
                        onRemove={removeFile}
                        accept=".pdf,image/*"
                        label="Real Estate License"
                        description="PDF or Image (max 5MB)"
                        setter={setLicenseFile}
                      />
                      
                      <div>
                        <label htmlFor="managers" className="block text-sm font-medium text-slate-700 mb-2">
                          Authorized Manager(s)
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input
                            id="managers"
                            type="text"
                            value={managerNames}
                            onChange={(e) => setManagerNames(e.target.value)}
                            placeholder="John Doe, Jane Smith"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Separate multiple names with commas</p>
                      </div>
                    </>
                  )}

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <input
                      id="skipAgencyVerification"
                      type="checkbox"
                      checked={skipAgencyVerification}
                      onChange={(e) => setSkipAgencyVerification(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded mt-0.5"
                    />
                    <label htmlFor="skipAgencyVerification" className="text-xs text-slate-600">
                      Skip verification for now. <span className="font-medium text-orange-600">Your profile will show an "Unverified" badge</span> until you complete verification from your dashboard.
                    </label>
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Security</h3>
                
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      placeholder="Create a strong password"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {(passwordFocused || password) && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                    <p className="text-xs font-medium text-slate-700 mb-2">Password must contain:</p>
                    {[
                      { key: 'length', label: 'At least 8 characters' },
                      { key: 'uppercase', label: 'One uppercase letter' },
                      { key: 'lowercase', label: 'One lowercase letter' },
                      { key: 'number', label: 'One number' },
                      { key: 'special', label: 'One special character (!@#$%^&*)' },
                    ].map((req) => (
                      <div key={req.key} className="flex items-center gap-2">
                        {passwordValidation[req.key] ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${passwordValidation[req.key] ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border transition-all text-slate-900 placeholder:text-slate-400 ${
                        confirmPassword && !passwordsMatch
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-emerald-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {confirmPassword && passwordsMatch && (
                      <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{' '}
                  <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </button>
                </label>
              </div>
              
              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || emailExists}
                className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 flex items-center justify-center gap-2 ${
                  isLoading || emailExists ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
            
            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;