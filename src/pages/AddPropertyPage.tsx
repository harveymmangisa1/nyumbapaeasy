import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Camera, XCircle, Loader2, Trash2 } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app, db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

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
  const navigate = useNavigate();
  const storage = getStorage(app);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [district, setDistrict] = useState('');
  const [areaName, setAreaName] = useState('');
  const [sector, setSector] = useState('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'room' | 'commercial'>('house');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [isSelfContained, setIsSelfContained] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageRefs, setImageRefs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | '2 months' | '3 months'>('monthly');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [fencingType, setFencingType] = useState<'brick fenced' | 'glass fenced' | 'wood pallets' | 'incomplete fencing' | 'none'>('none');
  const [propertyCategory, setPropertyCategory] = useState<'standalone' | 'semi-detached' | 'townhouses' | 'bedsitter'>('standalone');
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [googleMapLink, setGoogleMapLink] = useState('');

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

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setAreaName('');
    setSector('');
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArea = e.target.value;
    setAreaName(selectedArea);
    setSector('');
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    try {
      const uploadPromises = Array.from(e.target.files).map(async (file) => {
        const uniqueName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `properties/${uniqueName}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
    } catch (error) {
      setImageUploadError('Failed to upload images. Please try again.');
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrlToRemove = images[index];
    const imageRefToRemove = imageRefs[index];

    setImages(images.filter((_, i) => i !== index));
    setImageRefs(imageRefs.filter((_, i) => i !== index));

    if (imageRefToRemove) {
      try {
        const imageToDeleteRef = ref(storage, imageRefToRemove);
        await deleteObject(imageToDeleteRef);
        console.log('Image deleted from storage:', imageRefToRemove);
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user?.id || user.role !== 'landlord') {
      setError('User is not authenticated or not authorized as a landlord. Please log in.');
      navigate('/login');
      return;
    }

    if (!title || !description || !price || !district || !areaName || !propertySize) {
      setError('Please fill in all required fields (Title, Description, Price, District, Area, Area Size).');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Please enter a valid positive price amount.');
      return;
    }

    if (isNaN(Number(propertySize)) || Number(propertySize) <= 0) {
      setError('Please enter a valid positive area size.');
      return;
    }

    if (images.length === 0) {
      setError('Please add at least one property image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const locationString = `${areaName}${sector ? `, ${sector}` : ''}`;

      const newPropertyData = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        location: locationString,
        district,
        type: propertyType,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        area: propertySize,
        isSelfContained,
        amenities,
        images,
        isFeatured: false,
        createdBy: user.id,
        landlordId: user.id,
        landlordName: user.name || 'N/A',
        landlordContact: user.contact || 'N/A',
        createdAt: serverTimestamp(),
        listingType,
        paymentCycle: listingType === 'rent' ? paymentCycle : null,
        fencingType, // New field
        propertyCategory, // New field
        isAvailable, // New field
        hasElectricity, // New field
        hasWater, // New field
        googleMapLink: googleMapLink.trim() || null, // New field
      };

      const docRef = await addDoc(collection(db, 'properties'), newPropertyData);
      console.log('Property added with ID: ', docRef.id);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Submit Error:', err);
      setError(`Failed to add property: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'landlord') {
    return null;
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
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Listing Type */}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="rent"
            checked={listingType === 'rent'}
            onChange={(e) => setListingType(e.target.value as 'rent' | 'sale')}
            className="h-4 w-4 text-blue-600"
          />
          <span className="ml-2">For Rent</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="sale"
            checked={listingType === 'sale'}
            onChange={(e) => setListingType(e.target.value as 'rent' | 'sale')}
            className="h-4 w-4 text-blue-600"
          />
          <span className="ml-2">For Sale</span>
        </label>
      </div>
    </div>

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

    {/* Price and Payment Cycle */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {listingType === 'rent' ? 'Monthly Rent' : 'Sale Price'} (MWK)
      </label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>
    {listingType === 'rent' && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Cycle</label>
        <select
          value={paymentCycle}
          onChange={(e) => setPaymentCycle(e.target.value as any)}
          className="w-full p-2 border rounded-md"
        >
          <option value="monthly">Monthly</option>
          <option value="2 months">Every 2 Months</option>
          <option value="3 months">Every 3 Months</option>
        </select>
      </div>
    )}

    {/* Property Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value as any)}
        className="w-full p-2 border rounded-md"
      >
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
        <option value="room">Room</option>
        <option value="commercial">Commercial</option>
      </select>
    </div>

    {/* Location Fields */}
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
        value={areaName}
        onChange={handleAreaChange}
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

    {district && areaName && districtsWithAreasAndSectors[district][areaName].length > 0 && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select Sector</option>
          {districtsWithAreasAndSectors[district][areaName].map((sector) => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>
    )}

    {/* Property Details */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
      <input
        type="number"
        value={bedrooms}
        onChange={(e) => setBedrooms(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
      <input
        type="number"
        value={bathrooms}
        onChange={(e) => setBathrooms(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Property Size (sqm)</label>
      <input
        type="number"
        value={propertySize}
        onChange={(e) => setPropertySize(e.target.value)}
        required
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
        {amenities.map((amenity, index) => (
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
          {isUploadingImages ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
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
          )}
        </label>
      </div>
      {imageUploadError && (
        <p className="text-sm text-red-500">{imageUploadError}</p>
      )}
    </div>

    {/* Fencing Type */}
<div>
  <label htmlFor="fencingType" className="block text-sm font-medium text-gray-700 mb-2">Fencing Type</label>
  <select
    id="fencingType"
    value={fencingType}
    onChange={(e) => setFencingType(e.target.value as 'brick fenced' | 'glass fenced' | 'wood pallets' | 'incomplete fencing' | 'none')}
    className="w-full p-2 border rounded-md"
  >
    <option value="none">None</option>
    <option value="brick fenced">Brick Fenced</option>
    <option value="glass fenced">Glass Fenced</option>
    <option value="wood pallets">Wood Pallets</option>
    <option value="incomplete fencing">Incomplete Fencing</option>
  </select>
</div>

{/* Property Category */}
<div>
  <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-700 mb-2">Property Category</label>
  <select
    id="propertyCategory"
    value={propertyCategory}
    onChange={(e) => setPropertyCategory(e.target.value as 'standalone' | 'semi-detached' | 'townhouses' | 'bedsitter')}
    className="w-full p-2 border rounded-md"
  >
    <option value="standalone">Standalone</option>
    <option value="semi-detached">Semi-Detached</option>
    <option value="townhouses">Townhouses</option>
    <option value="bedsitter">Bedsitter</option>
  </select>
</div>

{/* Availability */}
<div className="flex items-center">
  <input
    type="checkbox"
    id="isAvailable"
    checked={isAvailable}
    onChange={(e) => setIsAvailable(e.target.checked)}
    className="h-4 w-4 text-blue-600"
  />
  <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">Currently Available</label>
</div>

{/* Utilities */}
<div className="flex gap-4">
  <div className="flex items-center">
    <input
      type="checkbox"
      id="hasElectricity"
      checked={hasElectricity}
      onChange={(e) => setHasElectricity(e.target.checked)}
      className="h-4 w-4 text-blue-600"
    />
    <label htmlFor="hasElectricity" className="ml-2 text-sm text-gray-700">Electricity</label>
  </div>
  <div className="flex items-center">
    <input
      type="checkbox"
      id="hasWater"
      checked={hasWater}
      onChange={(e) => setHasWater(e.target.checked)}
      className="h-4 w-4 text-blue-600"
    />
    <label htmlFor="hasWater" className="ml-2 text-sm text-gray-700">Water</label>
  </div>
</div>

{/* Google Map Link */}
<div>
  <label htmlFor="googleMapLink" className="block text-sm font-medium text-gray-700 mb-2">Google Map Link (Optional)</label>
  <input
    type="url"
    id="googleMapLink"
    value={googleMapLink}
    onChange={(e) => setGoogleMapLink(e.target.value)}
    className="w-full p-2 border rounded-md"
    placeholder="Enter Google Map link"
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