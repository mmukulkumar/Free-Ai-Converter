import React, { useRef, useState } from 'react';
import { Upload, X, ArrowLeft, ArrowRight, FileUp } from 'lucide-react';
import Tooltip from './Tooltip';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  onClear: () => void;
  hasFiles: boolean;
  acceptedExtensions: string[];
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesAdded, onClear, hasFiles, acceptedExtensions }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File) => {
    return acceptedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext.toLowerCase()) ||
      (file.type && file.type.includes(ext.replace('.', '')))
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(isValidFile);
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      } else {
        alert(`Please drop valid files only (${acceptedExtensions.join(', ')}).`);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter(isValidFile);
      onFilesAdded(validFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <Tooltip content="Select files from your device">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-full transition-all shadow-md shadow-primary-500/30 hover:shadow-lg active:scale-95"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
          </Tooltip>

          <Tooltip content="Clear all files from the queue">
            <button
              onClick={onClear}
              disabled={!hasFiles}
              className={`flex items-center px-6 py-2.5 font-semibold text-sm rounded-full transition-all active:scale-95 ${hasFiles
                  ? 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 cursor-pointer border border-red-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Queue
            </button>
          </Tooltip>
        </div>

        {/* Helper text for desktop */}
        <div className="hidden md:block text-xs font-medium text-slate-400">
          Max file size: 50MB
        </div>
      </div>

      {/* Modern Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          group relative h-64 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
          border-[3px] border-dashed
            {isDragging 
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 scale-[1.01]' 
            : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-500/50'
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept={acceptedExtensions.join(',')}
          multiple
        />

        {/* Decorative background Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110 duration-500">
          <FileUp className="w-48 h-48" />
        </div>

        {/* Animated Arrows */}
        <div className={`absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 transition-all duration-300 hidden md:block ${isDragging ? 'translate-x-2 text-primary-400' : ''}`}>
          <ArrowLeft className="w-8 h-8" />
        </div>
        <div className={`absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 transition-all duration-300 hidden md:block ${isDragging ? '-translate-x-2 text-primary-400' : ''}`}>
          <ArrowRight className="w-8 h-8" />
        </div>

        <div className="text-center relative z-10 p-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isDragging ? 'bg-primary-200 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' : 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 dark:text-primary-400 border border-slate-200 dark:border-white/5'}`}>
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">Drop your files here</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            or click to browse
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-500 dark:text-slate-400 shadow-sm">
            Supports {acceptedExtensions.join(' ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropZone;