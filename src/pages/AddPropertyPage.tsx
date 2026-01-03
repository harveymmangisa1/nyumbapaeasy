import React, { useState } from 'react';
import { Home, MapPin, Bed, Bath, Maximize, User, Phone, Mail, Check, X, Upload, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

const AddPropertyPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form state
  const [propertyCategory, setPropertyCategory] = useState('');
  const [listingType, setListingType] = useState('rent');
  const [propertyType, setPropertyType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [paymentCycle, setPaymentCycle] = useState('monthly');

  // Location
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [sector, setSector] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [nearbyLandmarks, setNearbyLandmarks] = useState('');

  // Property details
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareMeters, setSquareMeters] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState('');
  const [floors, setFloors] = useState('');

  // Features
  const [isSelfContained, setIsSelfContained] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [hasSecuritySystem, setHasSecuritySystem] = useState(false);
  const [hasGenerator, setHasGenerator] = useState(false);
  const [hasAirConditioning, setHasAirConditioning] = useState(false);
  const [hasInternet, setHasInternet] = useState(false);
  const [hasWaterSupply, setHasWaterSupply] = useState(false);

  // Additional amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  // Images
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  // Landlord info
  const [landlordName, setLandlordName] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState('phone');

  // Availability
  const [availableFrom, setAvailableFrom] = useState('');
  const [minimumLeaseTerm, setMinimumLeaseTerm] = useState('');
  const [petPolicy, setPetPolicy] = useState('not_allowed');
  const [smokingPolicy, setSmokingPolicy] = useState('not_allowed');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const listingRoles = ['landlord', 'real_estate_agency', 'lodge_owner', 'bnb_owner', 'admin'];
  const canAddProperty = user && listingRoles.includes(user.profile.role);
  const isUnverified = canAddProperty && !user?.profile.is_verified;

  if (!canAddProperty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Verification Required</h2>
              <p className="mt-2 text-slate-600">
                You need to be a verified landlord to add a property.
                Please complete your profile verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const districts: Record<string, Record<string, string[]>> = {
    Lilongwe: {
      'Area 25': ['Sector 1', 'Sector 2', 'Sector 3'],
      'Area 47': ['Sector A', 'Sector B', 'Sector C'],
      'Area 18': [],
      'City Centre': [],
      'Chilinde': [],
    },
    Blantyre: {
      'Ndirande': ['Sector 1', 'Sector 2'],
      'Chilomoni': ['Sector A', 'Sector B'],
      'Limbe': [],
      'Soche': [],
    },
  };

  const predefinedAmenities = [
    'Swimming Pool', 'Gym', 'Laundry Room', 'Balcony', 'Terrace',
    'Storage Room', 'Servant Quarter', 'DSTV', 'Borehole', 'Solar Panels',
    'Backup Water Tank', 'Electric Fence', 'CCTV', 'Gated Community',
    'Playground', 'Shopping Nearby', 'School Nearby', 'Hospital Nearby'
  ];

  const handleAddAmenity = (amenity: string) => {
    if (!selectedAmenities.includes(amenity)) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'additional') => {
    const files = Array.from(e.target.files || []);
    if (type === 'cover') {
      setCoverImage(files[0] as File);
    } else {
      setAdditionalImages([...additionalImages, ...files as File[]].slice(0, 9));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!propertyCategory) newErrors.propertyCategory = 'Please select property category';
      if (!listingType) newErrors.listingType = 'Please select listing type';
      if (!propertyType) newErrors.propertyType = 'Please select property type';
      if (!title.trim()) newErrors.title = 'Title is required';
      if (title.trim().length < 10) newErrors.title = 'Title must be at least 10 characters';
      if (!description.trim()) newErrors.description = 'Description is required';
      if (description.trim().length < 50) newErrors.description = 'Description must be at least 50 characters';
      if (!price || Number(price) <= 0) newErrors.price = 'Valid price is required';
    }

    if (step === 2) {
      if (!district) newErrors.district = 'District is required';
      if (!area) newErrors.area = 'Area is required';
      if (!specificLocation.trim()) newErrors.specificLocation = 'Specific location is required';
    }

    if (step === 3) {
      if (!bedrooms || Number(bedrooms) < 0) newErrors.bedrooms = 'Valid number of bedrooms required';
      if (!bathrooms || Number(bathrooms) < 0) newErrors.bathrooms = 'Valid number of bathrooms required';
    }

    if (step === 4) {
      if (!coverImage) newErrors.coverImage = 'Cover image is required';
    }

    if (step === 5) {
      if (!landlordName.trim()) newErrors.landlordName = 'Landlord name is required';
      if (!landlordPhone.trim()) newErrors.landlordPhone = 'Phone number is required';
      if (!availableFrom) newErrors.availableFrom = 'Availability date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const { error } = await supabase
          .from('properties')
          .insert([
            {
              title,
              description,
              price,
              currency: 'TZS',
              location: specificLocation,
              district,
              area,
              sector,
              listing_type: listingType,
              property_type: propertyType,
              category: propertyCategory,
              bedrooms,
              bathrooms,
              square_meters: squareMeters,
              is_self_contained: isSelfContained,
              is_furnished: isFurnished,
              has_parking: hasParking,
              amenities: selectedAmenities,
              landlord_name: landlordName,
              landlord_phone: landlordPhone,
              landlord_email: landlordEmail,
              landlord_id: user?.id,
              status: 'available',
              is_verified: false,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('Error adding property:', error);
          showToast('Failed to add property. Please try again.', 'error');
          return;
        }

        // Reset form or redirect
        showToast('Property added successfully!', 'success');
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Error submitting property:', error);
        alert('Failed to add property. Please try again.');
      }
    }
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${currentStep > step ? 'bg-emerald-600 text-white' :
              currentStep === step ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                'bg-slate-200 text-slate-600'
              }`}>
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            {step < 5 && (
              <div className={`h-1 w-12 md:w-24 mx-2 transition-all ${currentStep > step ? 'bg-emerald-600' : 'bg-slate-200'
                }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600 mt-2">
        <span className={currentStep === 1 ? 'font-medium text-emerald-600' : ''}>Basic Info</span>
        <span className={currentStep === 2 ? 'font-medium text-emerald-600' : ''}>Location</span>
        <span className={currentStep === 3 ? 'font-medium text-emerald-600' : ''}>Details</span>
        <span className={currentStep === 4 ? 'font-medium text-emerald-600' : ''}>Photos</span>
        <span className={currentStep === 5 ? 'font-medium text-emerald-600' : ''}>Contact</span>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    message ? (
      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {message}
      </p>
    ) : null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">List Your Property</h1>
            <p className="text-emerald-100">Fill in the details to get your property listed</p>
            {isUnverified && (
              <div className="mt-3 bg-yellow-400/20 border border-yellow-400/30 rounded-lg px-3 py-2">
                <p className="text-yellow-100 text-sm">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  Your account is not yet verified. Properties will be marked as "Unverified" until verification is complete.
                </p>
              </div>
            )}
          </div>

          <div className="p-8">
            <ProgressBar />

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Basic Information</h2>

                {/* Property Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Property Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['residential', 'business'].map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setPropertyCategory(category)}
                        className={`p-4 rounded-xl border-2 transition-all ${propertyCategory === category
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <span className="font-medium capitalize">{category}</span>
                      </button>
                    ))}
                  </div>
                  <ErrorMessage message={errors.propertyCategory} />
                </div>

                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    I want to <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['rent', 'sale'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setListingType(type)}
                        className={`p-4 rounded-xl border-2 transition-all ${listingType === type
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <span className="font-medium capitalize">{type === 'rent' ? 'Rent Out' : 'Sell'}</span>
                      </button>
                    ))}
                  </div>
                  <ErrorMessage message={errors.listingType} />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(propertyCategory === 'residential'
                      ? [
                        { value: 'house', label: 'House', icon: Home },
                        { value: 'apartment', label: 'Apartment', icon: Home },
                        { value: 'room', label: 'Room', icon: Bed },
                      ]
                      : [
                        { value: 'hotel', label: 'Hotel', icon: Home },
                        { value: 'lodge', label: 'Lodge', icon: Home },
                        { value: 'shop', label: 'Shop', icon: Home },
                      ]
                    ).map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setPropertyType(type.value)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${propertyType === type.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <ErrorMessage message={errors.propertyType} />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Modern 3 Bedroom House in Area 47"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">{title.length} / 100 characters</p>
                  <ErrorMessage message={errors.title} />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe your property in detail. Include features, condition, neighborhood, and what makes it special..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">{description.length} / 500 characters minimum 50</p>
                  <ErrorMessage message={errors.description} />
                </div>

                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {listingType === 'rent' ? 'Monthly Rent' : 'Sale Price'} (MK) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">MK</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <ErrorMessage message={errors.price} />
                  </div>

                  {listingType === 'rent' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Payment Cycle
                      </label>
                      <select
                        value={paymentCycle}
                        onChange={(e) => setPaymentCycle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly (3 months)</option>
                        <option value="biannually">Bi-annually (6 months)</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Location Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setArea('');
                        setSector('');
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select District</option>
                      {Object.keys(districts).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ErrorMessage message={errors.district} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        setSector('');
                      }}
                      disabled={!district}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
                    >
                      <option value="">Select Area</option>
                      {district && Object.keys(districts[district]).map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <ErrorMessage message={errors.area} />
                  </div>

                  {district && area && districts[district][area]?.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sector (Optional)
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select Sector</option>
                        {districts[district][area].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Specific Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={specificLocation}
                      onChange={(e) => setSpecificLocation(e.target.value)}
                      placeholder="e.g., Behind City Mall, Next to Total Filling Station"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <ErrorMessage message={errors.specificLocation} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nearby Landmarks (Optional)
                  </label>
                  <textarea
                    value={nearbyLandmarks}
                    onChange={(e) => setNearbyLandmarks(e.target.value)}
                    rows={3}
                    placeholder="e.g., 5 minutes from Kamuzu Central Hospital, Near Shoprite"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Property Details</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bedrooms <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Bed className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        min="0"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <ErrorMessage message={errors.bedrooms} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bathrooms <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Bath className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        min="0"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <ErrorMessage message={errors.bathrooms} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Area (m²)
                    </label>
                    <div className="relative">
                      <Maximize className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        value={squareMeters}
                        onChange={(e) => setSquareMeters(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      placeholder="2020"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Parking Spaces
                    </label>
                    <input
                      type="number"
                      value={parkingSpaces}
                      onChange={(e) => setParkingSpaces(e.target.value)}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Floors
                    </label>
                    <input
                      type="number"
                      value={floors}
                      onChange={(e) => setFloors(e.target.value)}
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Key Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { state: isSelfContained, setter: setIsSelfContained, label: 'Self-contained' },
                      { state: isFurnished, setter: setIsFurnished, label: 'Furnished' },
                      { state: hasParking, setter: setHasParking, label: 'Parking' },
                      { state: hasGarden, setter: setHasGarden, label: 'Garden' },
                      { state: hasSecuritySystem, setter: setHasSecuritySystem, label: 'Security System' },
                      { state: hasGenerator, setter: setHasGenerator, label: 'Generator' },
                      { state: hasAirConditioning, setter: setHasAirConditioning, label: 'Air Conditioning' },
                      { state: hasInternet, setter: setHasInternet, label: 'Internet' },
                      { state: hasWaterSupply, setter: setHasWaterSupply, label: 'Water Supply' },
                    ].map((feature, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={feature.state}
                          onChange={(e) => feature.setter(e.target.checked)}
                          className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                        />
                        <span className="text-sm text-slate-700">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Amenities */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Additional Amenities
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {predefinedAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() =>
                          selectedAmenities.includes(amenity)
                            ? handleRemoveAmenity(amenity)
                            : handleAddAmenity(amenity)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedAmenities.includes(amenity)
                          ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                          : 'bg-slate-100 text-slate-700 border-2 border-transparent hover:border-slate-300'
                          }`}
                      >
                        {selectedAmenities.includes(amenity) && <Check className="inline h-4 w-4 mr-1" />}
                        {amenity}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      placeholder="Add custom amenity"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Property Photos</h2>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-slate-600 mb-3">This will be the main image for your property listing</p>

                  {!coverImage ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all bg-slate-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-12 w-12 text-slate-400 mb-3" />
                        <p className="mb-2 text-sm font-medium text-slate-700">Click to upload cover image</p>
                        <p className="text-xs text-slate-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cover')}
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Cover"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImage(null)}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Cover Photo
                      </div>
                    </div>
                  )}
                  <ErrorMessage message={errors.coverImage} />
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Additional Images (Optional)
                  </label>
                  <p className="text-sm text-slate-600 mb-3">Add up to 9 more photos (Total: {additionalImages.length + 1}/10)</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {additionalImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setAdditionalImages(additionalImages.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {additionalImages.length < 9 && (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                        <Upload className="h-8 w-8 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-600">Add Photo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, 'additional')}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Photo Tips</p>
                      <ul className="text-blue-700 space-y-1 text-xs">
                        <li>• Use natural lighting for best results</li>
                        <li>• Show different angles and rooms</li>
                        <li>• Include exterior and interior shots</li>
                        <li>• Highlight unique features and amenities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Contact & Availability */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Contact & Availability</h2>

                {/* Landlord Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Contact Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={landlordName}
                        onChange={(e) => setLandlordName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <ErrorMessage message={errors.landlordName} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="tel"
                          value={landlordPhone}
                          onChange={(e) => setLandlordPhone(e.target.value)}
                          placeholder="+265 999 123 456"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <ErrorMessage message={errors.landlordPhone} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="email"
                          value={landlordEmail}
                          onChange={(e) => setLandlordEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['phone', 'email'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPreferredContact(method)}
                          className={`p-3 rounded-xl border-2 transition-all ${preferredContact === method
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="font-medium capitalize">{method}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Availability Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Available From <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={availableFrom}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <ErrorMessage message={errors.availableFrom} />
                    </div>

                    {listingType === 'rent' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Minimum Lease Term
                        </label>
                        <select
                          value={minimumLeaseTerm}
                          onChange={(e) => setMinimumLeaseTerm(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select term</option>
                          <option value="1_month">1 Month</option>
                          <option value="3_months">3 Months</option>
                          <option value="6_months">6 Months</option>
                          <option value="1_year">1 Year</option>
                          <option value="2_years">2 Years</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pet Policy
                      </label>
                      <select
                        value={petPolicy}
                        onChange={(e) => setPetPolicy(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="not_allowed">Not Allowed</option>
                        <option value="allowed">Allowed</option>
                        <option value="negotiable">Negotiable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Smoking Policy
                      </label>
                      <select
                        value={smokingPolicy}
                        onChange={(e) => setSmokingPolicy(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="not_allowed">Not Allowed</option>
                        <option value="allowed">Allowed</option>
                        <option value="outside_only">Outside Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded mt-0.5"
                      required
                    />
                    <span className="text-sm text-slate-700">
                      I confirm that all information provided is accurate and I agree to the{' '}
                      <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Terms & Conditions
                      </button>
                      {' '}and{' '}
                      <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Previous
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Next Step
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="ml-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Submit Property
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <p>Need help? <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">Contact Support</button></p>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;