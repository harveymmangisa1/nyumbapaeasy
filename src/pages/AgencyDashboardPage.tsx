import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Home, 
  Users, 
  MessageSquare, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2, 
  BarChart3,
  Building2,
  FileText,
  Briefcase
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

// Define types for properties and inquiries (same as DashboardPage)
interface PropertyData {
    id: string;
    title: string;
    type: string;
    price: number;
    location: string;
    images: string[];
    imageRefs?: string[];
    views?: number;
    created_at: string;
}

interface InquiryData {
    id: string;
    isRead: boolean;
    from: string;
    date: string;
    propertyTitle: string;
    message: string;
    email: string;
    phone: string;
    propertyId: string;
}

const AgencyDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('properties');
  const [agencyProperties, setAgencyProperties] = useState<PropertyData[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [popularProperties, setPopularProperties] = useState<PropertyData[]>([]);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  // Update document title
  useEffect(() => {
    document.title = 'Agency Dashboard | NyumbaPaeasy';
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user?.role !== 'real_estate_agency') {
      navigate('/');
    }
  }, [user, navigate]);

  // Initial fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
        if (!user?.id) return;

        setLoading(true);

        try {
          // Fetch properties managed by the agency
          const { data: properties, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .eq('landlord_id', user.id);

          if (propertiesError) throw propertiesError;

          setAgencyProperties(properties as PropertyData[]);

          // Calculate total views
          const views = properties.reduce((sum, property) => sum + (property.views || 0), 0);
          setTotalViews(views);

          // Fetch popular properties
          const { properties: popularProps, error: popularError } = await analyticsService.getPopularProperties(user.id);
          if (!popularError) {
            setPopularProperties(popularProps);
          }

          // Fetch inquiries related to the agency's properties
          if (properties.length > 0) {
              const propertyIds = properties.map(p => p.id);
              const { data: inquiriesData, error: inquiriesError } = await supabase
                .from('inquiries')
                .select('*')
                .in('propertyId', propertyIds);

              if (inquiriesError) throw inquiriesError;
              setInquiries(inquiriesData as InquiryData[]);
          } else {
              setInquiries([]);
          }

        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };
    if (user?.id) {
        fetchDashboardData();
    }
  }, [user]);

  // Action Handlers (same as DashboardPage)
  const handleViewProperty = (propertyId: string) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/edit-property/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyToDelete: PropertyData) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyToDelete.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingPropertyId(propertyToDelete.id);

    try {
      // Delete Supabase document
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id);

      if (deleteError) throw deleteError;

      // Delete associated images from Supabase Storage
      if (propertyToDelete.imageRefs && propertyToDelete.imageRefs.length > 0) {
        const { error: storageError } = await supabase
          .storage
          .from('property-images')
          .remove(propertyToDelete.imageRefs);

        if (storageError) {
          console.error("Error deleting images from storage:", storageError);
        }
      }

      // Update local state
      setAgencyProperties(prev => prev.filter(property => property.id !== propertyToDelete.id));
      setInquiries(prev => prev.filter(inquiry => inquiry.propertyId !== propertyToDelete.id));

      alert(`"${propertyToDelete.title}" has been successfully deleted.`);
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("An error occurred while deleting the property. Please try again.");
    } finally {
      setDeletingPropertyId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your agency dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Real Estate Agency Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your property portfolio and client inquiries</p>
            {/* Display Agency Details */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center mb-2">
                <Building2 className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="font-medium text-gray-800">{user?.name}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Reg: {user?.business_registration_number || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>License: {user?.license_number || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>Managers: {user?.manager_names || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/add-property')}
            className="btn btn-primary mt-4 md:mt-0 flex items-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Property
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-emerald-100 p-3 mr-4">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Properties Under Management</p>
                <p className="text-2xl font-bold text-gray-800">{agencyProperties.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-gray-800">{totalViews}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Property Views</p>
                <p className="text-2xl font-bold text-gray-800">
                  {popularProperties.length > 0 ? popularProperties[0]?.views || 0 : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Client Inquiries</p>
                <p className="text-2xl font-bold text-gray-800">{inquiries.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Properties */}
        {popularProperties.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Most Popular Properties</h2>
            <div className="space-y-4">
              {popularProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="text-lg font-bold text-gray-400 w-8">#{index + 1}</div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">{property.title}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{property.views} views</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewProperty(property.id)}
                    className="btn btn-sm btn-outline text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'properties'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('properties')}
          >
            Property Portfolio
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'inquiries'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('inquiries')}
          >
            Client Inquiries
          </button>
        </div>

        {/* Tab Content - Reusing the same structure as DashboardPage */}
        <div>
          {activeTab === 'properties' && (
            <div>
              {agencyProperties.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Property</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Type</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Location</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Views</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencyProperties.map((property, index) => (
                        <tr key={property.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                <img
                                  src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder-image.jpg'}
                                  alt={property.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-image.jpg';
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{property.title}</p>
                                <p className="text-xs text-gray-500">
                                  Added {new Date(property.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {property.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800">
                            MK {property.price?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{property.location}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{property.views || 0}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2 items-center">
                              <button
                                onClick={() => handleViewProperty(property.id)}
                                className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                                title="View"
                                disabled={deletingPropertyId === property.id}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditProperty(property.id)}
                                className="p-1 text-gray-500 hover:text-emerald-600 disabled:opacity-50"
                                title="Edit"
                                disabled={deletingPropertyId === property.id}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
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
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Properties in Portfolio Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start building your property portfolio by adding your first property listing.
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

          {activeTab === 'inquiries' && (
            <div>
              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800">{inquiry.propertyTitle}</h3>
                            <p className="text-gray-600">From: {inquiry.from}</p>
                            <p className="text-gray-500 text-sm">{new Date(inquiry.date).toLocaleDateString()}</p>
                        </div>
                        {!inquiry.isRead && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 self-start sm:self-center">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4">{inquiry.message}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                          <span className="block sm:inline-block mr-4">Email: <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">{inquiry.email || 'N/A'}</a></span>
                          <span className="block sm:inline-block">Phone: <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">{inquiry.phone || 'N/A'}</a></span>
                        </div>
                        <button className="btn btn-sm btn-outline text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500 self-start sm:self-center">
                          Mark as Read
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Client Inquiries Yet</h3>
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

export default AgencyDashboardPage;