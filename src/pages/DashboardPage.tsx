import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Property } from '../context/PropertyContext';
import { PlusCircle, Edit, Trash2, Eye, DollarSign, Home, Users, AlertTriangle, TrendingUp, TrendingDown, Calendar, Activity } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('landlord_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setProperties(data || []);
      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      // Delete property document from 'properties' table
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id);

      if (deleteError) {
        throw new Error(`Failed to delete property: ${deleteError.message}`);
      }

      // Delete associated images from Supabase Storage
      const imageRefs = propertyToDelete.imageRefs || [];
      if (imageRefs.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('property-images')
          .remove(imageRefs);

        if (storageError) {
          // Don't throw an error, just log it, as the property is already deleted
        }
      }

      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      setShowDeleteConfirm(false);
      setPropertyToDelete(null);
    } catch (err: unknown) {
      setError(err.message);
      setShowDeleteConfirm(false);
    }
  };

  const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalListings = properties.length;
  const averagePrice = totalListings > 0 ? properties.reduce((acc, p) => acc + p.price, 0) / totalListings : 0;

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back, {user?.profile?.username || user?.email}!</p>
          </div>
          <Link
            to="/add-property"
            className="btn btn-primary mt-4 sm:mt-0 inline-flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add New Property
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +12%
              </span>
            </div>
            <p className="text-sm text-slate-600">Active Listings</p>
            <p className="text-3xl font-bold text-slate-800">{totalListings}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +8%
              </span>
            </div>
            <p className="text-sm text-slate-600">Total Views</p>
            <p className="text-3xl font-bold text-slate-800">{totalViews}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                -3%
              </span>
            </div>
            <p className="text-sm text-slate-600">Average Price</p>
            <p className="text-3xl font-bold text-slate-800">MK {averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +15%
              </span>
            </div>
            <p className="text-sm text-slate-600">Active Now</p>
            <p className="text-3xl font-bold text-slate-800">24</p>
          </div>
        </div>

        {/* Recent Activity & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Overview</h3>
                <select className="input w-auto text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              {/* Chart Placeholder - Replace with actual chart library */}
              <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">Analytics chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { user: 'John Doe', action: 'viewed your property', time: '2 hours ago', amount: null },
                { user: 'Sarah Smith', action: 'made inquiry for', time: '4 hours ago', amount: 'MK 150,000' },
                { user: 'Mike Johnson', action: 'booked property', time: '6 hours ago', amount: 'MK 250,000' },
                { user: 'Emma Wilson', action: 'viewed your property', time: '1 day ago', amount: null },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{activity.user}</p>
                      <p className="text-xs text-slate-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {amount ? (
                      <p className="text-sm font-semibold text-slate-800">{activity.amount}</p>
                    ) : null}
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

{/* Property List */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">My Properties</h2>
          </div>
          {properties.length > 0 ? (
<div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Views</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {properties.map(property => (
                    <tr key={property.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{property.title}</div>
                        <div className="text-sm text-slate-500">{property.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">MK {property.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{property.views || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/properties/${property.id}`} className="text-blue-600 hover:text-blue-900 mr-4" title="View">
                          <Eye className="h-5 w-5 inline" />
                        </Link>
                        <Link to={`/edit-property/${property.id}`} className="text-amber-600 hover:text-amber-900 mr-4" title="Edit">
                          <Edit className="h-5 w-5 inline" />
                        </Link>
                        <button onClick={() => handleDeleteClick(property)} className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
<div className="text-center p-12">
              <Home className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No properties found</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by adding a new property.</p>
            </div>
          )}
        </div>
      </div>

{/* Delete Confirmation Modal */}
      {showDeleteConfirm && propertyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Delete Property</h3>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete "{propertyToDelete.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-destructive">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;