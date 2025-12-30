import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Home, 
  FileText, 
  TrendingUp, 
  MapPin, 
  XCircle, 
  Clock,
  BarChart3,
  Eye
} from 'lucide-react';


interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface PropertyData {
  id: string;
  title: string;
  price: number;
  location: string;
  created_at: string;
  is_featured: boolean;
  views?: number;
  landlord_id?: string;
  landlord_name?: string;
}

interface DocumentData {
  id: string;
  user_id: string;
  document_type: string;
  status: string;
  submitted_at: string;
  user: {
    email: string;
  }[];
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [roleCounts, setRoleCounts] = useState({
    admin: 0,
    landlord: 0,
    renter: 0
  });
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [recentProperties, setRecentProperties] = useState<PropertyData[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<DocumentData[]>([]);
const [popularProperties, setPopularProperties] = useState<PropertyData[]>([]);
  const [totalViews, setTotalViews] = useState(0);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.profile?.role !== 'admin') return;
      
      setLoading(true);
      try {
        // Fetch stats
const [{ count: usersCount }, { count: propertiesCount }, { count: verificationsCount }] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('verification_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ]);
        
setTotalUsers(usersCount || 0);
        setTotalProperties(propertiesCount || 0);
        setPendingVerifications(verificationsCount || 0);
        
        // Fetch role counts
        const { data: roleData, error: roleError } = await supabase
          .from('profiles')
          .select('role');
        
        if (!roleError && roleData) {
          const counts = {
            admin: 0,
            landlord: 0,
            renter: 0
          };
          
          roleData.forEach(profile => {
            if (profile.role === 'admin') counts.admin++;
            else if (profile.role === 'landlord') counts.landlord++;
            else if (profile.role === 'renter') counts.renter++;
          });
          
          setRoleCounts(counts);
        }
        
        // Fetch recent users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, name, email, role, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (!usersError && usersData) {
          setRecentUsers(usersData as UserData[]);
        }
        
        // Fetch recent properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('id, title, price, location, created_at, is_featured, views')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (!propertiesError && propertiesData) {
          setRecentProperties(propertiesData as PropertyData[]);
        }
        
        // Fetch pending verification documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('verification_documents')
          .select(`
            id,
            user_id,
            document_type,
            status,
            submitted_at,
            user:users(email)
          `)
          .eq('status', 'pending')
          .order('submitted_at', { ascending: false })
          .limit(5);
        
        if (!documentsError && documentsData) {
          setPendingDocuments(documentsData as DocumentData[]);
        }
        
// Fetch popular properties
        const { data: popularProps, error: popularError } = await supabase
          .from('properties')
          .select('*')
          .order('views', { ascending: false })
          .limit(5);
        if (!popularError && popularProps) {
          setPopularProperties(popularProps);
        }
        
        // Calculate total views
        const { data: allProperties, error: viewsError } = await supabase
          .from('properties')
          .select('views');
        
        if (!viewsError && allProperties) {
          const total = allProperties.reduce((sum, property) => sum + (property.views || 0), 0);
          setTotalViews(total);
        }
      } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.profile?.name || user?.email}. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
            </div>
            <div className="mt-4 flex text-sm">
              <span className="text-gray-500 mr-2">Admin:</span>
              <span className="font-medium">{roleCounts.admin}</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-gray-500 mr-2">Landlord:</span>
              <span className="font-medium">{roleCounts.landlord}</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-gray-500 mr-2">Renter:</span>
              <span className="font-medium">{roleCounts.renter}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-emerald-100 p-3 mr-4">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Properties</p>
                <p className="text-2xl font-bold text-gray-800">{totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-gray-800">{totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Verifications</p>
                <p className="text-2xl font-bold text-gray-800">{pendingVerifications}</p>
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
                      <p className="text-sm text-gray-500">Landlord: {property.landlord_name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm font-medium text-gray-800 mr-4">{property.views} views</span>
                    <Link 
                      to={`/properties/${property.id}`} 
                      className="btn btn-sm btn-outline text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-right">
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800">
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent users
                </div>
              )}
            </div>
          </div>

          {/* Recent Properties */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Properties</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentProperties.length > 0 ? (
                recentProperties.map((property) => (
                  <div key={property.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{property.title}</p>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{property.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">MK {property.price?.toLocaleString()}</p>
                        {property.is_featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                            Featured
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {property.views || 0} views
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent properties
                </div>
              )}
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Pending Verifications</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingDocuments.length > 0 ? (
                pendingDocuments.map((document) => (
                  <div key={document.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{document.user?.[0]?.email || 'Unknown User'}</p>
                        <p className="text-sm text-gray-500 capitalize">{document.document_type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(document.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No pending verifications
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/admin/verification" 
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FileText className="h-8 w-8 text-emerald-600 mb-2" />
                <span className="text-sm font-medium text-gray-800">Verify Documents</span>
                <span className="text-xs text-gray-500 mt-1">{pendingVerifications} pending</span>
              </Link>
              <Link 
                to="/properties" 
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-800">View Properties</span>
                <span className="text-xs text-gray-500 mt-1">{totalProperties} total</span>
              </Link>
<Link 
                to="/admin/verification" 
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-800">Manage Users</span>
                <span className="text-xs text-gray-500 mt-1">{totalUsers} total</span>
              </Link>
              <Link 
                to="/analytics" 
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-gray-800">View Analytics</span>
                <span className="text-xs text-gray-500 mt-1">Full report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;