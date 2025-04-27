import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore'; // Import doc and deleteDoc
import { getStorage, ref, deleteObject } from 'firebase/storage'; // Import storage functions
import { db, app } from '../firebaseConfig'; // Import app for storage
import { Home, Users, MessageSquare, Settings, PlusCircle, Edit, Trash2, Eye, Loader2 } from 'lucide-react'; // Import Loader2

// Define a more specific type for properties fetched from Firestore
interface PropertyData {
    id: string;
    title: string;
    type: string;
    price: number;
    location: string;
    images: string[]; // URLs
    imageRefs?: string[]; // Optional: Paths in storage for deletion
    views?: number;
    // Add other relevant property fields if needed
    [key: string]: any; // Allow other properties
}

// Define a type for inquiries
interface InquiryData {
    id: string;
    isRead: boolean;
    from: string;
    date: any; // Firestore timestamp or Date
    propertyTitle: string;
    message: string;
    email: string;
    phone: string;
    propertyId: string;
    // Add other relevant inquiry fields if needed
    [key: string]: any; // Allow other properties
}


const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const storage = getStorage(app); // Initialize storage

  const [activeTab, setActiveTab] = useState('properties');
  const [landlordProperties, setLandlordProperties] = useState<PropertyData[]>([]); // Use specific type
  const [totalViews, setTotalViews] = useState(0);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]); // Use specific type
  const [loading, setLoading] = useState(true);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null); // Track which property is being deleted

  // Update document title
  useEffect(() => {
    document.title = 'Landlord Dashboard | NyumbaPaeasy';
  }, []);

  // Redirect if not authenticated or not a landlord
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'landlord') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch landlord properties and inquiries from Firestore
  const fetchDashboardData = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      // Fetch properties owned by the landlord
      const propertiesQuery = query(
        collection(db, 'properties'),
        where('landlordId', '==', user.id)
      );
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const properties = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as PropertyData[]; // Cast to specific type

      setLandlordProperties(properties);

      // Calculate total views
      const views = properties.reduce((sum, property) => sum + (property.views || 0), 0);
      setTotalViews(views);

      // Fetch inquiries related to the landlord's properties (if any properties exist)
      if (properties.length > 0) {
          const propertyIds = properties.map(p => p.id);
          // Firestore 'in' queries are limited to 30 items. Handle larger sets if necessary.
          const inquiriesQuery = query(
            collection(db, 'inquiries'),
            where('propertyId', 'in', propertyIds.slice(0, 30)) // Handle potential limit
          );
          const inquiriesSnapshot = await getDocs(inquiriesQuery);
          const inquiriesData = inquiriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as InquiryData[]; // Cast to specific type
          setInquiries(inquiriesData);
      } else {
          setInquiries([]); // No properties, so no inquiries
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Consider adding user-facing error feedback
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
        fetchDashboardData();
    }
  }, [user]); // Re-fetch if user changes

  // --- Action Handlers ---

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleEditProperty = (propertyId: string) => {
    // Navigate to an edit page (assuming the route is /edit-property/:id)
    // You'll need to create this page/route separately.
    navigate(`/edit-property/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyToDelete: PropertyData) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyToDelete.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingPropertyId(propertyToDelete.id); // Indicate deletion is in progress

    try {
      // 1. Delete Firestore document
      const propertyDocRef = doc(db, 'properties', propertyToDelete.id);
      await deleteDoc(propertyDocRef);
      console.log(`Property document ${propertyToDelete.id} deleted.`);

      // 2. Delete associated images from Storage
      // IMPORTANT: This assumes image URLs can be reliably converted back to storage paths
      // or that you store the storage paths (e.g., in an `imageRefs` array) in Firestore.
      // If using only URLs, this part might be complex or unreliable.
      // Let's try deriving from URL (common pattern: find path after '/o/')
      const deleteImagePromises: Promise<void>[] = [];
      if (propertyToDelete.images && propertyToDelete.images.length > 0) {
          propertyToDelete.images.forEach(imageUrl => {
              try {
                  // Attempt to create a ref from the download URL
                  const imageRef = ref(storage, imageUrl);
                  deleteImagePromises.push(deleteObject(imageRef));
              } catch (storageError) {
                  // This might fail if the URL isn't a direct storage URL
                  // Or try extracting path if URL structure is known:
                  try {
                      const url = new URL(imageUrl);
                      const pathName = decodeURIComponent(url.pathname);
                      // Firebase Storage paths often look like /v0/b/your-bucket.appspot.com/o/properties%2Fimage.jpg
                      const pathStartIndex = pathName.indexOf('/o/');
                      if (pathStartIndex !== -1) {
                          const storagePath = pathName.substring(pathStartIndex + 3); // Get path after '/o/'
                          if (storagePath) {
                              const directRef = ref(storage, storagePath);
                              console.log(`Attempting deletion via derived path: ${storagePath}`);
                              deleteImagePromises.push(deleteObject(directRef));
                          } else {
                             console.warn(`Could not derive storage path for URL: ${imageUrl}`);
                          }
                      } else {
                          console.warn(`Could not derive storage path for URL (format unexpected): ${imageUrl}`);
                      }
                  } catch (parseError) {
                     console.error(`Error parsing or creating ref for image URL ${imageUrl}:`, storageError, parseError);
                  }
              }
          });

          try {
              await Promise.all(deleteImagePromises);
              console.log(`Associated images for property ${propertyToDelete.id} deleted from storage.`);
          } catch (imageDeleteError) {
              console.error(`Error deleting some images for property ${propertyToDelete.id}:`, imageDeleteError);
              // Decide if you want to proceed or show an error. Usually proceed.
          }
      }


      // 3. Update UI state - remove the deleted property
      setLandlordProperties(prevProperties =>
        prevProperties.filter(p => p.id !== propertyToDelete.id)
      );

      // Optional: Refresh inquiries if needed, though deleting a property might implicitly remove related inquiries over time or via backend functions.
      // fetchDashboardData(); // Or just update the properties list locally as done above.

      console.log(`Property ${propertyToDelete.id} deleted successfully.`);
      // Optional: Add a success notification/toast

    } catch (error) {
      console.error(`Error deleting property ${propertyToDelete.id}:`, error);
      alert('Failed to delete property. Please check the console and try again.');
      // Optional: Add an error notification/toast
    } finally {
      setDeletingPropertyId(null); // Reset deletion indicator
    }
  };


  // --- Render Logic ---

  if (!isAuthenticated || user?.role !== 'landlord') {
    // Redirect is handled by useEffect, return null or a placeholder while redirecting
    return null;
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <span className="ml-3 text-gray-600">Loading Dashboard...</span>
        </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Landlord Dashboard</h1>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-emerald-100 p-3 mr-4">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Listed Properties</p>
                <p className="text-2xl font-bold text-gray-800">{landlordProperties.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-gray-800">{totalViews}</p> {/* Assuming totalViews is calculated */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">New Inquiries</p>
                <p className="text-2xl font-bold text-gray-800">{inquiries.filter(i => !i.isRead).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Listings</p>
                <p className="text-2xl font-bold text-gray-800">{landlordProperties.length}</p> {/* Simplistic, could filter by status */}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            {/* Tab Buttons */}
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'properties'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('properties')}
            >
              My Properties
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'inquiries'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('inquiries')}
            >
              Inquiries ({inquiries.length})
            </button>
          </div>

          {/* Properties Tab Content */}
          {activeTab === 'properties' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Listed Properties</h2>
                <button
                  onClick={() => navigate('/add-property')}
                  className="btn btn-primary flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Property
                </button>
              </div>

              {landlordProperties.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Property</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Type</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Location</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {landlordProperties.map((property, index) => (
                        <tr key={property.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                <img
                                    src={property.images?.[0] || '/placeholder-image.png'} // Use placeholder if no image
                                    alt={property.title}
                                    className="h-full w-full object-cover"
                                    onError={(e) => (e.currentTarget.src = '/placeholder-image.png')} // Handle broken image links
                                />
                              </div>
                              <span className="font-medium text-gray-800 truncate max-w-xs" title={property.title}>
                                {property.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize">{property.type}</td>
                          <td className="px-4 py-3">MK {property.price?.toLocaleString() ?? 'N/A'}</td>
                          <td className="px-4 py-3">{property.location}</td>
                          <td className="px-4 py-3">
                            {/* Status logic can be more complex */}
                            <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2 items-center">
                              {/* View Button */}
                              <button
                                onClick={() => handleViewProperty(property.id)}
                                className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                                title="View"
                                disabled={deletingPropertyId === property.id}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditProperty(property.id)}
                                className="p-1 text-gray-500 hover:text-emerald-600 disabled:opacity-50"
                                title="Edit"
                                disabled={deletingPropertyId === property.id}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProperty(property)}
                                className={`p-1 text-gray-500 hover:text-red-600 disabled:opacity-50 ${deletingPropertyId === property.id ? 'cursor-wait' : ''}`}
                                title="Delete"
                                disabled={deletingPropertyId === property.id}
                              >
                                {deletingPropertyId === property.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Properties Listed Yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't listed any properties yet. Click the button below to add your first property.
                  </p>
                  <button
                    onClick={() => navigate('/add-property')}
                    className="btn btn-primary"
                  >
                    Add Your First Property
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Inquiries Tab Content */}
          {activeTab === 'inquiries' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Inquiries</h2>

              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map(inquiry => (
                    <div
                      key={inquiry.id}
                      className={`p-4 rounded-lg border ${
                        inquiry.isRead ? 'border-gray-200 bg-white' : 'border-blue-300 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">
                          Inquiry from: {inquiry.from || 'Anonymous'}
                          {!inquiry.isRead && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full align-middle">New</span>
                          )}
                        </h3>
                        <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                          {/* Format date nicely */}
                          {inquiry.date?.toDate ? new Date(inquiry.date.toDate()).toLocaleDateString() : 'Unknown Date'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Regarding: <span className="font-medium">{inquiry.propertyTitle || 'N/A'}</span></p>
                      <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded border border-gray-200">{inquiry.message || '(No message)'}</p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                          <span className="block sm:inline-block mr-4">Email: <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">{inquiry.email || 'N/A'}</a></span>
                          <span className="block sm:inline-block">Phone: <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">{inquiry.phone || 'N/A'}</a></span>
                        </div>
                        {/* Add Reply/Mark as Read functionality here if needed */}
                        <button className="btn btn-sm btn-outline text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500 self-start sm:self-center">
                          Mark as Read {/* Or Reply */}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Inquiries Yet</h3>
                  <p className="text-gray-600">
                    You haven't received any inquiries about your properties yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
