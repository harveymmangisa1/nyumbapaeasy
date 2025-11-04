import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { Camera, XCircle, Loader2, Trash2, AlertCircle, ShieldAlert, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const districtsWithAreasAndSectors: Record<string, Record<string, string[]>> = {
  Lilongwe: {
    "Area 25": ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Sector 7", "Sector 8", "Sector 9"],
    "Area 47": ["Sector A", "Sector B", "Sector C"],
    "Area 18": [],
    "City Centre": [],
    "Chilinde": [],
    "Falls": [],
  },
  Blantyre: {
    "Ndirande": ["Sector 1", "Sector 2"],
    "Chilomoni": ["Sector A", "Sector B"],
    "Limbe": [],
    "Soche": [],
    "Bangwe": [],
  },
  Mzuzu: {
    "Katoto": ["Sector 1", "Sector 2"],
    "Chibanja": [],
    "Ching'ambo": [],
    "Lupaso": [],
  },
  Zomba: {
    "Chancellor College": [],
    "3 Miles": [],
    "Sadzi": [],
  },
};

const AddPropertyPage: React.FC = () => {
  const { user } = useAuth();
  const { addProperty } = useProperties();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [type, setType] = useState('apartment');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | '2_months' | '3_months' | '6_months' | '12_months'>('monthly');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState('');
  const [isSelfContained, setIsSelfContained] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCheck, setVerificationCheck] = useState<{ canList: boolean; message: string | null } | null>(null);

  useEffect(() => {
    document.title = 'Add New Property | NyumbaPaeasy';
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user?.role !== 'landlord') {
      navigate('/');
    }
  }, [user, navigate]);

  // Check user verification status on component mount
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (user && (user.role === 'landlord' || user.role === 'admin')) {
        // In a real implementation, you would call the verification service here
        // For now, we'll set a default that allows listing
        setVerificationCheck({ canList: true, message: null });
      }
    };
    
    checkVerificationStatus();
  }, [user]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setArea('');
    setSector(''); // Reset sector when district changes
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !selectedAmenities.includes(newAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setSelectedAmenities(selectedAmenities.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Validation: Check total number of images
    if (images.length + e.target.files.length > 10) {
      setImageUploadError('Maximum 10 images allowed per property.');
      return;
    }

    // Validation: Check file sizes and types
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    for (let file of Array.from(e.target.files)) {
      if (file.size > maxFileSize) {
        setImageUploadError(`File ${file.name} exceeds 5MB limit.`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setImageUploadError(`File ${file.name} is not a supported image format.`);
        return;
      }
    }

    try {
      setImageUploadError(null);
      
      if (!user) {
        setImageUploadError('User not authenticated. Please log in again.');
        return;
      }
      
      const uploadPromises = Array.from(e.target.files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `user_${user.id}/${uniqueName}`;
        
        const { error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (error) throw error;

        // Get the public URL with correct path
        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedImageUrls]);
    } catch (err: any) {
      setImageUploadError(err.message || 'Failed to upload image(s). Please try again.');
      console.error('Image upload error:', err);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file.size > maxFileSize) {
      setImageUploadError(`Cover image exceeds 5MB limit.`);
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError(`Cover image is not a supported format.`);
      return;
    }

    try {
      setImageUploadError(null);
      
      if (!user) {
        setImageUploadError('User not authenticated. Please log in again.');
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const uniqueName = `cover_${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `user_${user.id}/${uniqueName}`;
      
      const { error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      setCoverImage(publicUrlData.publicUrl);
    } catch (err: any) {
      setImageUploadError(err.message || 'Failed to upload cover image. Please try again.');
      console.error('Cover image upload error:', err);
    }
  };

  // Remove cover image
  const handleRemoveCoverImage = () => {
    setCoverImage('');
  };

  // Remove image from images state
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!title.trim()) errors.push('Property title is required');
    if (title.trim().length < 10) errors.push('Property title must be at least 10 characters');
    if (!description.trim()) errors.push('Property description is required');
    if (description.trim().length < 50) errors.push('Property description must be at least 50 characters');
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errors.push('Valid price is required');
    if (!location.trim()) errors.push('Location is required');
    if (!district) errors.push('District is required');
    if (!area.trim()) errors.push('Property area is required');
    if (!coverImage) errors.push('Cover image is required');
    if (isNaN(Number(bedrooms)) || Number(bedrooms) < 0) errors.push('Valid number of bedrooms is required');
    if (isNaN(Number(bathrooms)) || Number(bathrooms) < 0) errors.push('Valid number of bathrooms is required');
    if (!landlordName.trim()) errors.push('Landlord name is required');
    if (!landlordContact.trim()) errors.push('Landlord contact is required');
    if (type === 'commercial' && Number(bedrooms) > 0) errors.push('Commercial properties should not have bedrooms');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!user) {
      setError('You must be logged in to add a property.');
      return;
    }
    
    // Comprehensive validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    // Check verification status before submitting
    if (verificationCheck && !verificationCheck.canList) {
      setError(verificationCheck.message || 'You do not have permission to list properties at this time.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare property data
      const propertyData = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        payment_cycle: listingType === 'rent' ? paymentCycle : undefined,
        location: location.trim(),
        district: district.trim(),
        sector: sector.trim() || undefined,
        type,
        listing_type: listingType,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: area.trim(),
        is_self_contained: isSelfContained,
        amenities: selectedAmenities,
        cover_image: coverImage,
        images,
        landlord_name: landlordName.trim(),
        landlord_contact: landlordContact.trim()
      };
      
      // Add property using context
      const result = await addProperty(propertyData);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.property) {
        setSuccess('Property added successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setPrice('');
        setLocation('');
        setDistrict('');
        setSector('');
        setType('apartment');
        setListingType('rent');
        setPaymentCycle('monthly');
        setBedrooms(1);
        setBathrooms(1);
        setArea('');
        setIsSelfContained(false);
        setSelectedAmenities([]);
        setCoverImage('');
        setImages([]);
        setLandlordName('');
        setLandlordContact('');
        
        // Redirect to property detail page after a short delay
        setTimeout(() => {
          navigate(`/properties/${result.property?.id}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Error adding property:', err);
      setError('Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [landlordName, setLandlordName] = useState(user?.name || '');
  const [landlordContact, setLandlordContact] = useState(user?.email || '');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You must be logged in as a landlord to add properties.</p>
        <button 
          onClick={() => navigate('/login')}
          className="btn btn-primary"
        >
          Login
        </button>
      </div>
    );
  }
  
  if (user && user.role !== 'landlord' && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">Only landlords and administrators can add properties.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  if (verificationCheck && !verificationCheck.canList) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <ShieldAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Required</h2>
            <p className="text-gray-600 mb-4">
              {verificationCheck.message || 'You need to verify your account to list properties.'}
            </p>
            <button 
              onClick={() => navigate('/profile')}
              className="btn btn-primary"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Add New Property</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Property Details</h2>
            <p className="text-emerald-100 text-sm mt-1">Fill in the information below to list your property</p>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="e.g., Beautiful 3 Bedroom House in Area 47"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Describe your property in detail. Include features, condition, and what makes it special..."
                  />
                </div>
                
                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setListingType('rent')}
                      className={`p-3 border rounded-lg text-center font-medium transition-colors ${
                        listingType === 'rent'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      For Rent
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingType('sale')}
                      className={`p-3 border rounded-lg text-center font-medium transition-colors ${
                        listingType === 'sale'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      For Sale
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (MWK) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">MK</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder={listingType === 'rent' ? '150,000' : '15,000,000'}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {listingType === 'rent' ? 'Monthly rent amount' : 'Total purchase price'}
                  </p>
                </div>
                
                {/* Payment Cycle - Only for rent */}
                {listingType === 'rent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Cycle <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={paymentCycle}
                      onChange={(e) => setPaymentCycle(e.target.value as any)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="2_months">Every 2 Months</option>
                      <option value="3_months">Every 3 Months (Quarterly)</option>
                      <option value="6_months">Every 6 Months</option>
                      <option value="12_months">Yearly</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      How often rent payments are due
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Location Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Location Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Specific Location */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="e.g., Near City Centre Mall, Behind Total Filling Station"
                  />
                  <p className="text-xs text-gray-500 mt-1">Provide landmarks or specific location details</p>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={handleDistrictChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select District</option>
                    {Object.keys(districtsWithAreasAndSectors).map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100"
                    disabled={!district}
                  >
                    <option value="">Select Area</option>
                    {district && Object.keys(districtsWithAreasAndSectors[district]).map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sector - Optional */}
                {district && area && districtsWithAreasAndSectors[district][area]?.length > 0 && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sector (Optional)
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="">Select Sector (Optional)</option>
                      {districtsWithAreasAndSectors[district][area].map((sector) => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select a sector if applicable to your location</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Property Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Property Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="room">Room</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Property Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqm)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required={false}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {/* Self Contained */}
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={isSelfContained}
                    onChange={(e) => setIsSelfContained(e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">Self Contained</label>
                </div>

                {/* Amenities */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Add amenity"
                    />
                    <button
                      type="button"
                      onClick={handleAddAmenity}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                        <span className="text-sm">{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Property Images */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Property Images</h3>
              
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">This will be the main image displayed on property listings</p>
                
                <div className="flex items-start gap-4">
                  {coverImage ? (
                    <div className="relative">
                      <img 
                        src={coverImage} 
                        alt="Cover image" 
                        className="h-40 w-60 object-cover rounded-lg border-2 border-emerald-200" 
                      />
                      <button
                        type="button"
                        onClick={handleRemoveCoverImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded font-medium">Cover</span>
                      </div>
                    </div>
                  ) : (
                    <label className="h-40 w-60 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors bg-gray-50">
                      <div className="text-center">
                        <Camera className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Upload Cover Image</p>
                        <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <p className="text-sm text-gray-500 mb-3">Add more photos to showcase your property (up to 10 total images)</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Property ${index + 1}`} 
                        className="h-32 w-full object-cover rounded-lg border border-gray-200" 
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 9 && (
                    <label className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                      <div className="text-center">
                        <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Add Image</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
                
                {imageUploadError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {imageUploadError}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Images uploaded: {(coverImage ? 1 : 0) + images.length} / 10
                </p>
              </div>
            </div>

            {/* Landlord Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Landlord Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Landlord Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landlord Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={landlordName}
                    onChange={(e) => setLandlordName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter landlord's full name"
                  />
                </div>

                {/* Landlord Contact */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landlord Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={landlordContact}
                    onChange={(e) => setLandlordContact(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Phone number or email address"
                  />
                  <p className="text-xs text-gray-500 mt-1">Provide a phone number or email for potential tenants to contact</p>
                </div>
              </div>
            </div>

            
            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !coverImage}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Adding Property...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Add Property
                    </div>
                  )}
                </button>
              </div>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                By submitting this form, you agree to our terms and conditions for property listings.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;