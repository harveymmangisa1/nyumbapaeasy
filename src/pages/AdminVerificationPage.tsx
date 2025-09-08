import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  User, 
  Mail, 
  Calendar,
  ShieldAlert
} from 'lucide-react';

interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: 'business_license' | 'property_deed' | 'national_id' | 'other';
  document_url: string;
  document_name: string;
  status: 'pending' | 'verified' | 'rejected';
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  user_email: string;
  user_name: string;
}

const AdminVerificationPage: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [selectedDocument, setSelectedDocument] = useState<VerificationDocument | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    document.title = 'Admin Verification | NyumbaPaeasy';
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate]);

  // Fetch verification documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user || user.role !== 'admin') return;
      
      setLoading(true);
      try {
        let query = supabase
          .from('verification_documents')
          .select(`
            *,
            user:users(email)
          `)
          .order('submitted_at', { ascending: false });
        
        if (filter !== 'all') {
          query = query.eq('status', filter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Fetch user profiles for each document
        const documentWithProfiles = await Promise.all(
          data.map(async (doc) => {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', doc.user_id)
              .single();
            
            return {
              ...doc,
              user_email: doc.user?.email || 'Unknown',
              user_name: profileError ? 'Unknown' : profile?.name || 'Unknown'
            };
          })
        );
        
        setDocuments(documentWithProfiles as VerificationDocument[]);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [user, filter]);

  const handleDocumentSelect = (doc: VerificationDocument) => {
    setSelectedDocument(doc);
    setAdminNotes(doc.admin_notes || '');
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    if (!selectedDocument || !user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('verification_documents')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', selectedDocument.id);
      
      if (error) throw error;
      
      // Update local state
      setDocuments(prev => prev.map(doc => 
        doc.id === selectedDocument.id 
          ? { ...doc, status, admin_notes: adminNotes, reviewed_at: new Date().toISOString(), reviewed_by: user.id }
          : doc
      ));
      
      setSelectedDocument(prev => 
        prev ? { ...prev, status, admin_notes: adminNotes, reviewed_at: new Date().toISOString(), reviewed_by: user.id } 
        : null
      );
      
      // Show success message
      alert(`Document ${status} successfully!`);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'business_license': return 'Business License';
      case 'property_deed': return 'Property Deed';
      case 'national_id': return 'National ID';
      case 'other': return 'Other Document';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </span>;
      case 'pending':
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </span>;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Access denied. Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admin Verification</h1>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Documents
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'verified' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'rejected' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {filter === 'all' ? 'All Documents' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Documents`}
                    <span className="ml-2 text-sm font-normal text-gray-500">({documents.length})</span>
                  </h2>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  </div>
                ) : documents.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => handleDocumentSelect(doc)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedDocument?.id === doc.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.document_name}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{getDocumentTypeLabel(doc.document_type)}</p>
                            <div className="flex items-center mt-2">
                              <User className="h-3 w-3 text-gray-400 mr-1" />
                              <p className="text-xs text-gray-600 truncate">{doc.user_name}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Mail className="h-3 w-3 text-gray-400 mr-1" />
                              <p className="text-xs text-gray-600 truncate">{doc.user_email}</p>
                            </div>
                          </div>
                          <div className="ml-2">
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(doc.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Document Details */}
            <div className="lg:col-span-2">
              {selectedDocument ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedDocument.document_name}</h2>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-600 mr-4">
                            Type: {getDocumentTypeLabel(selectedDocument.document_type)}
                          </span>
                          {getStatusBadge(selectedDocument.status)}
                        </div>
                      </div>
                      <a
                        href={selectedDocument.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        View Document
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">User Information</h3>
                        <div className="bg-gray-50 rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedDocument.user_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedDocument.user_email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Submission Details</h3>
                        <div className="bg-gray-50 rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              Submitted: {new Date(selectedDocument.submitted_at).toLocaleString()}
                            </span>
                          </div>
                          {selectedDocument.reviewed_at && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                Reviewed: {new Date(selectedDocument.reviewed_at).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        id="adminNotes"
                        rows={4}
                        className="input w-full"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes about this verification..."
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleVerify('verified')}
                        disabled={isUpdating || selectedDocument.status === 'verified'}
                        className={`btn btn-primary flex items-center ${
                          isUpdating || selectedDocument.status === 'verified' ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Verify Document
                      </button>
                      
                      <button
                        onClick={() => handleVerify('rejected')}
                        disabled={isUpdating || selectedDocument.status === 'rejected'}
                        className={`btn btn-danger flex items-center ${
                          isUpdating || selectedDocument.status === 'rejected' ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject Document
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No document selected</h3>
                    <p className="text-gray-500">Select a document from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerificationPage;