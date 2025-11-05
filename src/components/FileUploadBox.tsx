import React from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadBoxProps {
  file: File | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => void;
  onRemove: (setter: (file: File | null) => void) => void;
  accept: string;
  label: string;
  description: string;
  setter: (file: File | null) => void;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  file,
  onUpload,
  onRemove,
  accept,
  label,
  description,
  setter,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 font-medium">Click to upload</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => onUpload(e, setter)}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(setter)}
            className="text-slate-400 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;