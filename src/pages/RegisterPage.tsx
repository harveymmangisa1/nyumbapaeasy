import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, User, Mail, Lock, Check, Building2, 
  FileText, Briefcase, AlertCircle, CheckCircle2, 
  Shield, BadgeAlert, ArrowRight, Home
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import FileUploadBox from '../components/FileUploadBox';


interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface VerificationState {
  nationalId: string;
  nationalIdFile: File | null;
  proofOfOwnership: File | null;
  businessRegistrationNumber: string;
  businessRegFile: File | null;
  licenseNumber: string;
  licenseFile: File | null;
  managerNames: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [role, setRole] = useState<'renter' | 'landlord' | 'real_estate_agency'>('renter');
  
  // Verification states
  const [verification, setVerification] = useState<VerificationState>({
    nationalId: '',
    nationalIdFile: null,
    proofOfOwnership: null,
    businessRegistrationNumber: '',
    businessRegFile: null,
    licenseNumber: '',
    licenseFile: null,
    managerNames: '',
  });
  
  const [skipVerification, setSkipVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Update form data
  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update verification data
  const updateVerification = (field: keyof typeof verification, value: unknown) => {
    setVerification(prev => ({ ...prev, [field]: value as any }));
  };

  // Password validation
  useEffect(() => {
    setPasswordValidation({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    });
  }, [formData.password]);

  const passwordsMatch = formData.password && formData.confirmPassword && 
                        formData.password === formData.confirmPassword;
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Email validation and existence check
  const checkEmailExists = useCallback(async (email: string) => {
    if (!email) {
      setEmailExists(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailExists(false);
      return;
    }

    setCheckingEmail(true);
    try {
      // In a real implementation, you'd call a Supabase RPC function here
      // For now, we'll rely on the signup error for existence check
      setEmailExists(false);
    } catch (err) {
      console.error('Error checking email:', err);
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.email) {
        checkEmailExists(formData.email);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.email, checkEmailExists]);

  // File handling
  const handleFileUpload = (file: File, setter: (file: File) => void) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setter(file);
  };

  const removeFile = (setter: (file: null) => void) => {
    setter(null);
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your full name or company name');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (emailExists) {
      setError('An account with this email already exists. Please log in or use a different email.');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return false;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return false;
    }

    // Landlord verification
    if (role === 'landlord' && !skipVerification) {
      if (!verification.nationalId.trim()) {
        setError('National ID number is required for verification');
        return false;
      }
      if (!verification.nationalIdFile) {
        setError('Please upload a copy of your National ID');
        return false;
      }
      if (!verification.proofOfOwnership) {
        setError('Please upload proof of property ownership');
        return false;
      }
    }

    // Agency verification
    if (role === 'real_estate_agency' && !skipVerification) {
      if (!verification.businessRegistrationNumber.trim()) {
        setError('Business Registration Number is required for verification');
        return false;
      }
      if (!verification.businessRegFile) {
        setError('Please upload your business registration certificate');
        return false;
      }
      if (!verification.licenseNumber.trim()) {
        setError('License Number is required for verification');
        return false;
      }
      if (!verification.licenseFile) {
        setError('Please upload your real estate license');
        return false;
      }
      if (!verification.managerNames.trim()) {
        setError('Manager Names are required for verification');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Send numeric OTP to email and store profile metadata in user metadata via signup-like options
      const { data, error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true,
          data: {
            name: formData.name,
            role,
            phone_number: formData.phoneNumber,
            ...(role === 'landlord' && !skipVerification && {
              national_id: verification.nationalId,
            }),
            ...(role === 'real_estate_agency' && !skipVerification && {
              business_registration_number: verification.businessRegistrationNumber,
              license_number: verification.licenseNumber,
              manager_names: verification.managerNames,
            }),
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('exists')) {
          setEmailExists(true);
          setError('An account with this email already exists. Please log in or use a different email.');
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }

      // If you want to upload verification docs only after the account is fully created and session exists,
      // defer uploads to after first login. Otherwise we cannot guarantee a user id at this stage.

      // Redirect to VerifyEmailPage to input the code
      navigate('/verify-email', { state: { email: formData.email, role } });
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVerificationDocuments = async (userId: string) => {
    const uploadFile = async (file: File | null, type: string) => {
      if (!file) return;

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
    };

    if (role === 'landlord') {
      await uploadFile(verification.nationalIdFile, 'national_id');
      await uploadFile(verification.proofOfOwnership, 'proof_of_ownership');
    } else if (role === 'real_estate_agency') {
      await uploadFile(verification.businessRegFile, 'business_registration');
      await uploadFile(verification.licenseFile, 'real_estate_license');
    }
  };

  if (registrationSuccess) {
    const willBeVerified = role === 'renter' || 
                          (role === 'landlord' && !skipVerification) ||
                          (role === 'real_estate_agency' && !skipVerification);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Welcome to NyumbaPaeasy!</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            We've sent a verification email to{' '}
            <span className="font-semibold text-slate-900">{formData.email}</span>
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Verify your email</p>
                  <p className="text-blue-700">Check your inbox and click the verification link to activate your account.</p>
                </div>
              </div>
            </div>

            {willBeVerified && (role === 'landlord' || role === 'real_estate_agency') && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-900 mb-1">Document verification in progress</p>
                    <p className="text-amber-700">Your verification documents are being reviewed. This typically takes 1-2 business days.</p>
                  </div>
                </div>
              </div>
            )}

            {!willBeVerified && (role === 'landlord' || role === 'real_estate_agency') && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <BadgeAlert className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-orange-900 mb-1">Unverified Account</p>
                    <p className="text-orange-700">Complete verification anytime from your dashboard to build trust with clients.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button
              onClick={async () => {
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email: formData.email,
                });
                if (error) {
                  alert('Error resending code: ' + error.message);
                } else {
                  alert('A new login/verification code has been sent to your email.');
                }
              }}
              className="w-full text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              Resend code
            </button>
          </div>
        </div>
      </div>
    );
  }

  const RoleButton = ({ value, label, description, icon: Icon }: {
    value: string;
    label: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) => (
    <button
      type="button"
      onClick={() => setRole(value as 'renter' | 'landlord' | 'real_estate_agency')}
      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
        role === value
          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-900 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-5 w-5 ${role === value ? 'text-white' : 'text-slate-400'}`} />
        {role === value && <Check className="h-5 w-5" />}
      </div>
      <div className={`font-semibold mb-1 ${role === value ? 'text-white' : 'text-slate-900'}`}>
        {label}
      </div>
      <p className={`text-xs ${role === value ? 'text-slate-200' : 'text-slate-500'}`}>
        {description}
      </p>
    </button>
  );

  const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
        met ? 'bg-emerald-500' : 'bg-slate-300'
      }`} />
      <span className={`text-sm ${met ? 'text-emerald-700' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">NyumbaPaeasy</span>
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Find Your Perfect Home
          </h1>
          <p className="text-slate-600 text-lg">
            Create your account to get started
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800 flex-1">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-4">
                  I'm registering as
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <RoleButton
                    value="renter"
                    label="Renter/Buyer"
                    description="Looking for property"
                    icon={User}
                  />
                  <RoleButton
                    value="landlord"
                    label="Landlord"
                    description="List properties"
                    icon={Building2}
                  />
                  <RoleButton
                    value="real_estate_agency"
                    label="Agency"
                    description="Real estate business"
                    icon={Briefcase}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  {role === 'real_estate_agency' ? 'Company Information' : 'Personal Information'}
                </h3>
                
                <div className="grid gap-5">
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
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder={role === 'real_estate_agency' ? 'Enter company name' : 'Enter your full name'}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
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
                        value={formData.email}
                        onChange={(e) => {
                          updateFormData('email', e.target.value);
                          setEmailExists(false);
                          setError('');
                        }}
                        placeholder="your.email@example.com"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all text-slate-900 placeholder:text-slate-400 ${
                          emailExists ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-900'
                        } focus:outline-none focus:ring-2 focus:border-transparent bg-white`}
                      />
                      {checkingEmail && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    {emailExists && (
                      <p className="text-xs text-red-600 mt-2">
                        An account with this email already exists.
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                      placeholder="+265 999 123 456"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Verification Sections */}
              {(role === 'landlord' || role === 'real_estate_agency') && (
                <div className="space-y-5 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-1">
                        {role === 'landlord' ? 'Landlord' : 'Agency'} Verification
                      </h3>
                      <p className="text-sm text-slate-600">
                        Verify your identity to build trust with {role === 'landlord' ? 'tenants' : 'clients'}
                      </p>
                    </div>
                    <Shield className="h-5 w-5 text-slate-600" />
                  </div>

                  {!skipVerification && (
                    <div className="space-y-5">
                      {role === 'landlord' ? (
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
                                value={verification.nationalId}
                                onChange={(e) => updateVerification('nationalId', e.target.value)}
                                placeholder="e.g., NID123456789"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                              />
                            </div>
                          </div>

                          <FileUploadBox
                            file={verification.nationalIdFile}
                            onUpload={(file) => handleFileUpload(file, (f) => updateVerification('nationalIdFile', f))}
                            onRemove={() => removeFile(() => updateVerification('nationalIdFile', null))}
                            accept="image/*,.pdf"
                            label="National ID Copy"
                            description="PDF or Image (max 5MB)"
                          />

                          <FileUploadBox
                            file={verification.proofOfOwnership}
                            onUpload={(file) => handleFileUpload(file, (f) => updateVerification('proofOfOwnership', f))}
                            onRemove={() => removeFile(() => updateVerification('proofOfOwnership', null))}
                            accept=".pdf,.doc,.docx,image/*"
                            label="Proof of Property Ownership"
                            description="Title deed, lease agreement, or property certificate"
                          />
                        </>
                      ) : (
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
                                value={verification.businessRegistrationNumber}
                                onChange={(e) => updateVerification('businessRegistrationNumber', e.target.value)}
                                placeholder="e.g., BRN123456789"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                              />
                            </div>
                          </div>

                          <FileUploadBox
                            file={verification.businessRegFile}
                            onUpload={(file) => handleFileUpload(file, (f) => updateVerification('businessRegFile', f))}
                            onRemove={() => removeFile(() => updateVerification('businessRegFile', null))}
                            accept=".pdf,image/*"
                            label="Business Registration Certificate"
                            description="PDF or Image (max 5MB)"
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
                                value={verification.licenseNumber}
                                onChange={(e) => updateVerification('licenseNumber', e.target.value)}
                                placeholder="e.g., LIC987654321"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                              />
                            </div>
                          </div>

                          <FileUploadBox
                            file={verification.licenseFile}
                            onUpload={(file) => handleFileUpload(file, (f) => updateVerification('licenseFile', f))}
                            onRemove={() => removeFile(() => updateVerification('licenseFile', null))}
                            accept=".pdf,image/*"
                            label="Real Estate License"
                            description="PDF or Image (max 5MB)"
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
                                value={verification.managerNames}
                                onChange={(e) => updateVerification('managerNames', e.target.value)}
                                placeholder="John Doe, Jane Smith"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
                    <input
                      id="skipVerification"
                      type="checkbox"
                      checked={skipVerification}
                      onChange={(e) => setSkipVerification(e.target.checked)}
                      className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded mt-0.5"
                    />
                    <label htmlFor="skipVerification" className="text-sm text-slate-600">
                      Skip verification for now. <span className="font-medium text-orange-600">
                        Your profile will show an "Unverified" badge
                      </span> until you complete verification.
                    </label>
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Security
                </h3>
                
                <div className="grid gap-5">
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
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  {(passwordFocused || formData.password) && (
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                      <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements</p>
                      <div className="grid gap-2">
                        <PasswordRequirement met={passwordValidation.length} label="At least 8 characters" />
                        <PasswordRequirement met={passwordValidation.uppercase} label="One uppercase letter" />
                        <PasswordRequirement met={passwordValidation.lowercase} label="One lowercase letter" />
                        <PasswordRequirement met={passwordValidation.number} label="One number" />
                        <PasswordRequirement met={passwordValidation.special} label="One special character" />
                      </div>
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
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        placeholder="Re-enter your password"
                        className={`w-full pl-12 pr-12 py-3.5 rounded-xl border transition-all text-slate-900 placeholder:text-slate-400 ${
                          formData.confirmPassword && !passwordsMatch
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-slate-200 focus:ring-slate-900'
                        } focus:outline-none focus:ring-2 focus:border-transparent bg-white`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      {formData.confirmPassword && passwordsMatch && (
                        <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <p className="text-xs text-red-600 mt-2">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || emailExists}
                className={`w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 ${
                  isLoading || emailExists ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            
            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-slate-900 hover:text-slate-700 font-semibold transition-colors"
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