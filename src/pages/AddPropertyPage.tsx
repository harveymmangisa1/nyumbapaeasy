import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useProperties } from '../context/PropertyContext';
import { Camera, XCircle, Loader2, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
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
  const { user, isAuthenticated } = useUser();
  const { addProperty } = useProperties();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [type, setType] = useState('apartment');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState('');
  const [isSelfContained, setIsSelfContained] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCheck, setVerificationCheck] = useState<{ canList: boolean; message: string | null } | null>(null);

  useEffect(() => {
    document.title = 'Add New Property | NyumbaPaeasy';
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'landlord') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

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

    try {
      // Upload images to Supabase Storage
      if (!user) {
        setImageUploadError('User not authenticated. Please log in again.');
        return;
      }
      const uploadPromises = Array.from(e.target.files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        console.log('Uploading image:', uniqueName, file);
        const { error } = await supabase.storage
          .from('property-images')
          .upload(`user_${user.id}/${uniqueName}`, file);

        if (error) throw error;

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(uniqueName);

        return publicUrlData.publicUrl;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedImageUrls]);
      setImageUploadError(null);
    } catch (err: any) {
      setImageUploadError('Failed to upload image(s). Please try again.');
      console.error('Image upload error:', err);
    }
  };

  // Remove image from images state
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!user) {
      setError('You must be logged in to add a property.');
      return;
    }
    
    if (!title || !description || !price || !location || !district) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Check verification status before submitting
    if (verificationCheck && !verificationCheck.canList) {
      setError(verificationCheck.message || 'You do not have permission to list properties at this time.');
      return;
    }
    
    // Validate other fields
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    
    if (isNaN(bedrooms) || bedrooms < 0) {
      setError('Please enter a valid number of bedrooms.');
      return;
    }
    
    if (isNaN(bathrooms) || bathrooms < 0) {
      setError('Please enter a valid number of bathrooms.');
      return;
    }
    
    if (!images || images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare property data
      const propertyData = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        district: district.trim(),
        type,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: area.trim(),
        is_self_contained: isSelfContained,
        amenities: selectedAmenities,
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
        setType('apartment');
        setBedrooms(1);
        setBathrooms(1);
        setArea('');
        setIsSelfContained(false);
        setSelectedAmenities([]);
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

  if (!isAuthenticated) {
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
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Title */}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>

    {/* Description */}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={4}
        className="w-full p-2 border rounded-md"
      />
    </div>

    {/* Price */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Price (MWK)</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>

    {/* Location */}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>

    {/* District */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
      <select
        value={district}
        onChange={handleDistrictChange}
        required
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select District</option>
        {Object.keys(districtsWithAreasAndSectors).map((district) => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
        disabled={!district}
      >
        <option value="">Select Area</option>
        {district && Object.keys(districtsWithAreasAndSectors[district]).map((area) => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>
    </div>

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

    {/* Image Upload */}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
      <div className="flex flex-wrap gap-4 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img src={image} alt={`Property ${index}`} className="h-32 w-32 object-cover rounded" />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <label className="h-32 w-32 flex items-center justify-center border-2 border-dashed rounded cursor-pointer hover:border-blue-500">
          <>
            <Camera className="h-8 w-8 text-gray-400" />
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </>
        </label>
      </div>
      {imageUploadError && (
        <p className="text-sm text-red-500">{imageUploadError}</p>
      )}
    </div>

    {/* Landlord Name */}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Landlord Name</label>
      <input
        type="text"
        value={landlordName}
        onChange={(e) => setLandlordName(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>

    {/* Landlord Contact */}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Landlord Contact</label>
      <input
        type="text"
        value={landlordContact}
        onChange={(e) => setLandlordContact(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>

    {/* Submit Button */}
    <div className="col-span-2">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
        ) : (
          'Add Property'
        )}
      </button>
    </div>
  </div>
          </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;