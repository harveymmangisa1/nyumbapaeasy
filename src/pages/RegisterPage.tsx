import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, User, Mail, Lock, Building2,
  FileText, Briefcase, AlertCircle, CheckCircle2,
  Shield, ArrowRight, Home, Key, Hotel, BedDouble
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import FileUploadBox from '../components/FileUploadBox';
import { useToast } from '../context/ToastContext';


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
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [regStep, setRegStep] = useState<'intent' | 'role' | 'form'>('intent');
  const [role, setRole] = useState<'searcher' | 'landlord' | 'real_estate_agency' | 'lodge_owner' | 'bnb_owner'>('searcher');

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

    // Landlord & BnB Owner verification
    if ((role === 'landlord' || role === 'bnb_owner') && !skipVerification) {
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

    // Agency & Lodge Owner verification
    if ((role === 'real_estate_agency' || role === 'lodge_owner') && !skipVerification) {
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
        setError('Please upload your license document');
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
      // Try OTP registration first
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true,
          data: {
            name: formData.name,
            role,
            phone_number: formData.phoneNumber,
            ...((role === 'landlord' || role === 'bnb_owner') && !skipVerification && {
              national_id: verification.nationalId,
            }),
            ...((role === 'real_estate_agency' || role === 'lodge_owner') && !skipVerification && {
              business_registration_number: verification.businessRegistrationNumber,
              license_number: verification.licenseNumber,
              manager_names: verification.managerNames,
            }),
          },
        },
      });

      if (otpError) {
        console.error('OTP Error:', otpError);
        
        // If OTP fails, try direct signup as fallback
        if (otpError.message.includes('500') || otpError.message.includes('Internal Server Error')) {
          console.log('OTP failed, trying direct signup...');
          
          const { error: signupError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                name: formData.name,
                role,
                phone_number: formData.phoneNumber,
                ...((role === 'landlord' || role === 'bnb_owner') && !skipVerification && {
                  national_id: verification.nationalId,
                }),
                ...((role === 'real_estate_agency' || role === 'lodge_owner') && !skipVerification && {
                  business_registration_number: verification.businessRegistrationNumber,
                  license_number: verification.licenseNumber,
                  manager_names: verification.managerNames,
                }),
              },
            },
          });

          if (signupError) {
            if (signupError.message.includes('already registered') || signupError.message.includes('exists')) {
              setEmailExists(true);
              setError('An account with this email already exists. Please log in or use a different email.');
            } else {
              setError(signupError.message);
            }
            setIsLoading(false);
            return;
          }

          // Direct signup successful
          showToast('Registration successful! Please check your email to verify your account.', 'success');
          navigate('/verify-email', { state: { email: formData.email, role } });
        } else {
          // Other OTP errors
          if (otpError.message.includes('already registered') || otpError.message.includes('exists')) {
            setEmailExists(true);
            setError('An account with this email already exists. Please log in or use a different email.');
          } else {
            setError(otpError.message);
          }
          setIsLoading(false);
          return;
        }
      } else {
        // OTP successful
        navigate('/verify-email', { state: { email: formData.email, role } });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration service is temporarily unavailable. Please try again in a few minutes or contact support if the issue persists.');
      showToast('Registration temporarily unavailable. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${met ? 'bg-emerald-500' : 'bg-slate-300'
        }`} />
      <span className={`text-sm ${met ? 'text-emerald-700' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );

  // Render Logic
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => {
              if (regStep === 'role') setRegStep('intent');
              else if (regStep === 'form' && role === 'searcher') setRegStep('intent');
              else if (regStep === 'form' && role !== 'searcher') setRegStep('role');
              else navigate('/');
            }}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            {regStep !== 'intent' ? <ArrowRight className="h-5 w-5 rotate-180" /> : <Home className="h-5 w-5" />}
            <span className="font-medium">{regStep !== 'intent' ? 'Back' : 'NyumbaPaeasy'}</span>
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {regStep === 'intent' && "How can we help you?"}
            {regStep === 'role' && "What kind of property manager are you?"}
            {regStep === 'form' && "Create your account"}
          </h1>
          <p className="text-slate-600 text-lg">
            {regStep === 'intent' && "Choose how you want to use NyumbaPaeasy"}
            {regStep === 'role' && "Select the role that best describes you"}
            {regStep === 'form' && "Fill in your details to get started"}
          </p>
        </div>

        {/* STEP 1: INTENT */}
        {regStep === 'intent' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => {
                setRole('searcher');
                setRegStep('form');
              }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-slate-900 text-left group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">I want to Find a Home</h3>
              <p className="text-slate-500">
                Browse thousands of properties, save your favorites, and contact owners immediately.
              </p>
            </button>

            <button
              onClick={() => {
                setRegStep('role');
              }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-slate-900 text-left group"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Key className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">I want to List a Property</h3>
              <p className="text-slate-500">
                List your properties, manage tenants, and grow your real estate business.
              </p>
            </button>
          </div>
        )}

        {/* STEP 2: ROLE */}
        {regStep === 'role' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'landlord', label: 'Landlord', icon: Building2, desc: 'Individual renting out properties' },
              { id: 'real_estate_agency', label: 'Real Estate Agent', icon: Briefcase, desc: 'Professional agent or agency' },
              { id: 'lodge_owner', label: 'Lodge/Hotel Owner', icon: Hotel, desc: 'Managing a lodge or hotel' },
              { id: 'bnb_owner', label: 'BnB Owner', icon: BedDouble, desc: 'Short-term rental host' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setRole(item.id as any);
                  setRegStep('form');
                }}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-900 hover:shadow-md transition-all text-left flex items-start gap-4"
              >
                <div className="p-3 bg-slate-50 rounded-lg">
                  <item.icon className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.label}</h4>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 3: FORM */}
        {regStep === 'form' && (
          <div className="bg-white rounded-xl shadow-card-hover border border-slate-200 overflow-hidden">
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800 flex-1">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Display Current Role */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {role === 'searcher' && <User className="h-5 w-5 text-blue-600" />}
                    {role === 'landlord' && <Building2 className="h-5 w-5 text-purple-600" />}
                    {role === 'real_estate_agency' && <Briefcase className="h-5 w-5 text-slate-900" />}
                    {role === 'lodge_owner' && <Hotel className="h-5 w-5 text-amber-600" />}
                    {role === 'bnb_owner' && <BedDouble className="h-5 w-5 text-rose-600" />}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Registering as</p>
                    <p className="font-bold text-slate-900 capitalize">{role.replace(/_/g, ' ')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegStep('intent')}
                    className="ml-auto text-sm text-blue-600 font-medium hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Personal Information */}
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    {(role === 'real_estate_agency' || role === 'lodge_owner') ? 'Company Information' : 'Personal Information'}
                  </h3>

                  <div className="grid gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        {(role === 'real_estate_agency' || role === 'lodge_owner') ? 'Company Name' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          placeholder={(role === 'real_estate_agency' || role === 'lodge_owner') ? 'Enter company name' : 'Enter your full name'}
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
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all text-slate-900 placeholder:text-slate-400 ${emailExists ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-900'
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
                {(role !== 'searcher') && (
                  <div className="space-y-5 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-1">
                          Identity Verification
                        </h3>
                        <p className="text-sm text-slate-600">
                          Verify your account to build trust.
                        </p>
                      </div>
                      <Shield className="h-5 w-5 text-slate-600" />
                    </div>

                    {!skipVerification && (
                      <div className="space-y-5">
                        {(role === 'landlord' || role === 'bnb_owner') ? (
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
                            {/* Agency & Lodge Owner */}
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
                                {role === 'lodge_owner' ? 'Tourism/Operating License' : 'Real Estate License Number'}
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
                              label={role === 'lodge_owner' ? 'Operating License' : 'Real Estate License'}
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
                          className={`w-full pl-12 pr-12 py-3.5 rounded-xl border transition-all text-slate-900 placeholder:text-slate-400 ${formData.confirmPassword && !passwordsMatch
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
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-slate-900 font-bold hover:underline"
                  >
                    Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RegisterPage;