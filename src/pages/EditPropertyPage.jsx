import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';
import { Loader2 } from 'lucide-react';

const EditPropertyPage = () => {
  const { id } = useParams(); // Get property ID from URL
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [fencingType, setFencingType] = useState('');
  const [propertyCategory, setPropertyCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [googleMapLink, setGoogleMapLink] = useState('');

  useEffect(() => {
    document.title = 'Edit Property | NyumbaPaeasy';
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const propertyRef = doc(db, 'properties', id);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          const data = propertySnap.data();
          setPropertyData(data);

          // Pre-fill form fields
          setTitle(data.title || '');
          setDescription(data.description || '');
          setPrice(data.price || '');
          setFencingType(data.fencingType || 'none');
          setPropertyCategory(data.propertyCategory || 'standalone');
          setIsAvailable(data.isAvailable || false);
          setHasElectricity(data.hasElectricity || false);
          setHasWater(data.hasWater || false);
          setGoogleMapLink(data.googleMapLink || '');
        } else {
          setError('Property not found.');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !price) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyRef = doc(db, 'properties', id);
      await updateDoc(propertyRef, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        fencingType,
        propertyCategory,
        isAvailable,
        hasElectricity,
        hasWater,
        googleMapLink: googleMapLink.trim(),
        updatedAt: new Date(),
      });

      setSuccess('Property updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect after success
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error || 'Property not found.'}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Edit Property</h1>

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
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price (MWK) *</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Fencing Type */}
          <div className="mb-4">
            <label htmlFor="fencingType" className="block text-sm font-medium text-gray-700 mb-2">Fencing Type</label>
            <select
              id="fencingType"
              value={fencingType}
              onChange={(e) => setFencingType(e.target.value)}
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
          <div className="mb-4">
            <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-700 mb-2">Property Category</label>
            <select
              id="propertyCategory"
              value={propertyCategory}
              onChange={(e) => setPropertyCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="standalone">Standalone</option>
              <option value="semi-detached">Semi-Detached</option>
              <option value="townhouses">Townhouses</option>
              <option value="bedsitter">Bedsitter</option>
            </select>
          </div>

          {/* Availability */}
          <div className="mb-4 flex items-center">
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
          <div className="mb-4 flex gap-4">
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
          <div className="mb-4">
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
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;