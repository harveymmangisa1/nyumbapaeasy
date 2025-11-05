import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface VerificationDocumentUploadProps {
  onUploadComplete?: () => void;
}

const VerificationDocumentUpload: React.FC<VerificationDocumentUploadProps> = ({ onUploadComplete }) => {
  const { user, refreshUserVerificationStatus } = useAuth();
  const [documentType, setDocumentType] = useState<'business_license' | 'property_deed' | 'national_id' | 'other'>('business_license');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        return;
      }
      // Check file type
      if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('application/pdf')) {
        setUploadError('Only image and PDF files are allowed');
        return;
      }
      setFile(selectedFile);
      setUploadError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !user) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');
    
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);
      
      // Save document record to database
      const { error: insertError } = await supabase
        .from('verification_documents')
        .insert([
          {
            user_id: user.id,
            document_type: documentType,
            document_url: publicUrl,
            document_name: file.name,
            status: 'pending'
          }
        ]);
      
      if (insertError) throw insertError;
      
      setUploadSuccess('Document uploaded successfully! It will be reviewed within 24-48 hours.');
      setFile(null);
      
      // Refresh user verification status
      await refreshUserVerificationStatus();
      
      // Call callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: unknown) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Verification Document</h3>
      
      {user?.isVerified && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800">Your account is verified!</span>
        </div>
      )}
      
      {user?.hasPendingVerification && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 flex items-center">
          <Clock className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">Verification pending. Your documents are being reviewed.</span>
        </div>
      )}
      
      {user && user.verificationDocuments.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Your Documents</h4>
          <div className="space-y-2">
            {user.verificationDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{doc.document_name}</p>
                    <p className="text-xs text-gray-500">{getDocumentTypeLabel(doc.document_type)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {doc.status === 'verified' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                  {doc.status === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  )}
                  {doc.status === 'rejected' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as 'business_license' | 'property_deed' | 'national_id' | 'other')}
            className="input w-full"
            disabled={isUploading}
          >
            <option value="business_license">Business License</option>
            <option value="property_deed">Property Deed</option>
            <option value="national_id">National ID</option>
            <option value="other">Other Document</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Document
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-emerald-400 bg-gray-50 hover:bg-emerald-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                disabled={isUploading}
              />
            </label>
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
        </div>
        
        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {uploadError}
          </div>
        )}
        
        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            {uploadSuccess}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading || !file}
          className={`btn btn-primary w-full ${
            isUploading || !file ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Document'
          )}
        </button>
      </form>
    </div>
  );
};

export default VerificationDocumentUpload;