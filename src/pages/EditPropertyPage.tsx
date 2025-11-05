import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useProperties, Property } from '../context/PropertyContext';
import { supabase } from '../lib/supabase';
import { Loader2, Camera, Trash2, XCircle, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';

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

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useUser();
  const { getPropertyById } = useProperties();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [type, setType] = useState<'apartment' | 'house' | 'room' | 'commercial'>('apartment');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState('');
  const [isSelfContained, setIsSelfContained] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [landlordName, setLandlordName] = useState('');
  const [landlordContact, setLandlordContact] = useState('');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Edit Property | NyumbaPaeasy';
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'landlord' && user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID not found');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // First try to get from context
        const contextProperty = getPropertyById(id);
        if (contextProperty) {
          setProperty(contextProperty);
          populateForm(contextProperty);
        } else {
          // Fetch from Supabase if not in context
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              setError('Property not found.');
            } else {
              setError('Failed to load property data. Please try again.');
            }
            return;
          }

          if (data) {
            const propertyData = data as Property;
            
            // Check if user owns this property or is admin
            if (user && propertyData.landlord_id !== user.id && user.role !== 'admin') {
              setError('You do not have permission to edit this property.');
              return;
            }
            
            setProperty(propertyData);
            populateForm(propertyData);
          }
        }
      } catch (err: unknown) {
        console.error('Error fetching property:', err);
        setError('Failed to load property data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, getPropertyById]);

  const populateForm = (propertyData: Property) => {
    setTitle(propertyData.title);
    setDescription(propertyData.description);
    setPrice(propertyData.price.toString());
    setLocation(propertyData.location);
    setDistrict(propertyData.district);
    setType(propertyData.type);
    setBedrooms(propertyData.bedrooms);
    setBathrooms(propertyData.bathrooms);
    setArea(propertyData.area);
    setIsSelfContained(propertyData.is_self_contained);
    setSelectedAmenities(propertyData.amenities || []);
    setImages(propertyData.images || []);
    setLandlordName(propertyData.landlord_name);
    setLandlordContact(propertyData.landlord_contact);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
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

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    for (const file of Array.from(e.target.files)) {
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

        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);
      setImages((prevImages) => [...prevImages, ...uploadedImageUrls]);
    } catch (err: unknown) {
      setImageUploadError(err.message || 'Failed to upload image(s). Please try again.');
      console.error('Image upload error:', err);
    }
  };

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
    if (isNaN(Number(bedrooms)) || Number(bedrooms) < 0) errors.push('Valid number of bedrooms is required');
    if (isNaN(Number(bathrooms)) || Number(bathrooms) < 0) errors.push('Valid number of bathrooms is required');
    if (!landlordName.trim()) errors.push('Landlord name is required');
    if (!landlordContact.trim()) errors.push('Landlord contact is required');
    if (images.length === 0) errors.push('At least one property image is required');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!property || !user) {
      setError('Property data not available or user not authenticated.');
      return;
    }

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedPropertyData = {
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
        landlord_contact: landlordContact.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('properties')
        .update(updatedPropertyData)
        .eq('id', property.id);

      if (error) throw error;

      setSuccess('Property updated successfully!');
      setTimeout(() => {
        navigate(`/properties/${property.id}`);
      }, 2000);
    } catch (err: unknown) {
      console.error('Error updating property:', err);
      setError('Failed to update property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Property Not Found</h2>
        <p className="text-gray-600 mb-4">
          {error || 'The property you are trying to edit was not found.'}
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!isAuthenticated || (user && property.landlord_id !== user.id && user.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You don't have permission to edit this property.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="inline-flex items-center text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Edit Property</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter property title"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe the property in detail"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (MWK) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter price"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'apartment' | 'house' | 'room' | 'commercial')}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Room</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Location */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter specific location"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
              <select
                value={district}
                onChange={handleDistrictChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select District</option>
                {Object.keys(districtsWithAreasAndSectors).map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqm) *</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 150"
              />
            </div>

            {/* Bedrooms */}
            {type !== 'commercial' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  min="0"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}

            {/* Bathrooms */}
            {type !== 'commercial' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  min="0"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}

            {/* Self Contained */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={isSelfContained}
                onChange={(e) => setIsSelfContained(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
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
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Add amenity"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Images *</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Property ${index + 1}`} 
                      className="h-32 w-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="h-32 w-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">Add Image</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
              {imageUploadError && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {imageUploadError}
                </p>
              )}
            </div>

            {/* Landlord Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landlord Name *</label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter landlord name"
              />
            </div>

            {/* Landlord Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landlord Contact *</label>
              <input
                type="text"
                value={landlordContact}
                onChange={(e) => setLandlordContact(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter contact information"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Saving Changes...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;
