import React from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadBoxProps {
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  accept: string;
  label: string;
  description: string;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  file,
  onUpload,
  onRemove,
  accept,
  label,
  description,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="w-full bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-all text-center p-6 cursor-pointer relative">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                {file ? 'File selected' : 'Click to upload'}
              </p>
              <p className="text-xs text-slate-500">{description}</p>
            </div>
          </div>
        </div>
        {file && (
          <div className="flex-shrink-0 w-48 bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="ml-2 overflow-hidden">
                <p className="text-sm text-slate-800 font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={onRemove}
                className="ml-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadBox;
