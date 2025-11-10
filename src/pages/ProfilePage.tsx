import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Phone, Mail, MapPin, Eye, Calendar, Home, Clock, CheckCircle, Edit, Save } from 'lucide-react';

interface ProfileForm {
  username?: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  role?: 'user' | 'landlord' | 'admin' | 'real_estate_agency';
  is_verified?: boolean;
  has_pending_verification?: boolean;
  business_registration_number?: string;
  license_number?: string;
  manager_names?: string;
  phone_number?: string;
  bio?: string;
  location?: string;
}

interface PropertyVisit {
  id: string;
  property_id: string;
  property_title: string;
  property_image?: string;
  property_location: string;
  property_price: number;
  visited_at: string;
  views_count?: number;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState<ProfileForm>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'visits'>('profile');
  const [editingContact, setEditingContact] = useState(false);
  const [propertyVisits, setPropertyVisits] = useState<PropertyVisit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      
      // Load profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setForm({
          username: data.username ?? '',
          name: data.name ?? '',
          full_name: data.full_name ?? '',
          avatar_url: data.avatar_url ?? '',
          website: data.website ?? '',
          role: data.role,
          is_verified: data.is_verified,
          has_pending_verification: data.has_pending_verification,
          business_registration_number: data.business_registration_number ?? '',
          license_number: data.license_number ?? '',
          manager_names: data.manager_names ?? '',
          phone_number: data.phone_number ?? '',
          bio: data.bio ?? '',
          location: data.location ?? '',
        });
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    const loadPropertyVisits = async () => {
      if (!user || activeTab !== 'visits') return;
      
      setLoadingVisits(true);
      try {
        // Get property visits from analytics or create a visits table
        const { data, error } = await supabase
          .from('property_visits')
          .select(`
            id,
            property_id,
            visited_at,
            properties!inner(
              id,
              title,
              location,
              price,
              images
            )
          `)
          .eq('user_id', user.id)
          .order('visited_at', { ascending: false })
          .limit(20);

        if (!error && data) {
          const visits: PropertyVisit[] = data.map(visit => ({
            id: visit.id,
            property_id: visit.property_id,
            property_title: (visit.properties as any).title,
            property_image: (visit.properties as any).images?.[0],
            property_location: (visit.properties as any).location,
            property_price: (visit.properties as any).price,
            visited_at: visit.visited_at,
          }));
          setPropertyVisits(visits);
        }
      } catch (error) {
        console.error('Error loading property visits:', error);
      } finally {
        setLoadingVisits(false);
      }
    };

    loadPropertyVisits();
  }, [user, activeTab]);



  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Please Sign In</h2>
        <p className="text-gray-600">You need to be signed in to view your profile.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user.profile.avatar_url ? (
                <img 
                  src={user.profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                    }
                  }}
                />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.profile.name || user.email}
              </h1>
              <p className="text-gray-600 capitalize">
                {user.profile.role?.replace('_', ' ')}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                {user.profile.is_verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                )}
                {user.profile.has_pending_verification && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Verification
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('visits')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'visits'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Property Visits
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                <button
                  onClick={() => setEditingContact(!editingContact)}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
                >
                  {editingContact ? (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center text-gray-900">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {editingContact ? (
                    <input
                      type="tel"
                      value={form.phone_number || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, phone_number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="+265 999 123 456"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {form.phone_number || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {editingContact ? (
                    <input
                      type="text"
                      value={form.location || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Lilongwe, Malawi"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {form.location || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {editingContact ? (
                    <textarea
                      value={form.bio || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900">{form.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>

              {editingContact && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingContact(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const { error } = await supabase
                          .from('profiles')
                          .update({
                            phone_number: form.phone_number,
                            location: form.location,
                            bio: form.bio,
                          })
                          .eq('id', user.id);
                        
                        if (error) throw error;
                        setEditingContact(false);
                        setStatus('Contact information updated successfully!');
                      } catch (error) {
                        setStatus('Failed to update contact information');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="text-gray-900 font-mono text-xs">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="text-gray-900 capitalize">{user.profile.role?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.profile.is_verified 
                      ? 'bg-green-100 text-green-800' 
                      : user.profile.has_pending_verification
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.profile.is_verified ? 'Verified' : user.profile.has_pending_verification ? 'Pending' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Property Visits Tab */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Property Visits</h2>
            
            {loadingVisits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your property visits...</p>
              </div>
            ) : propertyVisits.length > 0 ? (
              <div className="space-y-4">
                {propertyVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {visit.property_image ? (
                        <img
                          src={visit.property_image}
                          alt={visit.property_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Home className="w-full h-full p-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{visit.property_title}</h3>
                      <p className="text-sm text-gray-600">{visit.property_location}</p>
                      <p className="text-sm font-medium text-emerald-600">MK {visit.property_price?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(visit.visited_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        Viewed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Property Visits Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start browsing properties to build your visit history.
                </p>
                <button
                  onClick={() => window.location.href = '/properties'}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  Browse Properties
                </button>
              </div>
            )}
          </div>
        )}

        {/* Status Messages */}
        {status && (
          <div className={`mt-4 p-4 rounded-md ${
            status.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}