import React, { useState } from 'react';
import { X, ArrowLeftRight, Download, ZoomIn, Columns, Square, Layout } from 'lucide-react';
import { OptimizedFile } from '../types';

interface PreviewModalProps {
  file: OptimizedFile;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ file, onClose }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'side-by-side'>('single');

  if (!file.blobUrl) return null;

  // Regex to check if we can display this format in an <img> tag
  const imageRegex = /(jpg|jpeg|png|webp|svg|gif|bmp|ico|avif)$/i;
  
  const isOutputImage = imageRegex.test(file.outputExtension);
  const isInputImage = imageRegex.test(file.originalName.split('.').pop() || '');
  // Comparison is possible if both input and output are viewable images
  const canCompare = isOutputImage && isInputImage && !!file.originalBlobUrl;

  const currentUrl = (showOriginal && canCompare && viewMode === 'single') ? file.originalBlobUrl : file.blobUrl;
  const currentLabel = showOriginal ? 'Original' : 'Converted Result';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fade-in p-4 md:p-6" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-fade-in-up" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
            <div className="flex items-center gap-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {file.originalName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {viewMode === 'side-by-side' ? 'Comparing Original vs Optimized' : (showOriginal ? 'Showing original file' : 'Showing optimized result')}
                    </p>
                </div>
                
                {/* View Toggles */}
                {canCompare && (
                    <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1 ml-4 border border-slate-200">
                        <button 
                            onClick={() => setViewMode('single')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'single' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Square className="w-3.5 h-3.5" />
                            Single
                        </button>
                        <button 
                            onClick={() => setViewMode('side-by-side')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'side-by-side' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Columns className="w-3.5 h-3.5" />
                            Side-by-Side
                        </button>
                    </div>
                )}
            </div>

            <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Checkerboard pattern for transparency */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ 
                backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }} />

            {isOutputImage ? (
                viewMode === 'side-by-side' && canCompare ? (
                    // Side by Side View
                    <div className="flex-1 flex flex-col md:flex-row w-full h-full relative z-10">
                        {/* Original Pane */}
                        <div className="flex-1 relative border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 flex items-center justify-center p-4 overflow-hidden group">
                            <span className="absolute top-4 left-4 bg-slate-800/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md z-20 shadow-lg">
                                ORIGINAL
                            </span>
                            <img 
                                src={file.originalBlobUrl} 
                                alt="Original" 
                                className="max-w-full max-h-full object-contain shadow-sm rounded transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                        </div>

                        {/* Optimized Pane */}
                        <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden group bg-white/30">
                            <span className="absolute top-4 left-4 bg-primary-600/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md z-20 shadow-lg">
                                OPTIMIZED
                            </span>
                             <img 
                                src={file.blobUrl} 
                                alt="Optimized" 
                                className="max-w-full max-h-full object-contain shadow-sm rounded transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                        </div>
                    </div>
                ) : (
                    // Single View
                    <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                        <img 
                            src={currentUrl} 
                            alt="Preview" 
                            className="max-w-full max-h-full object-contain shadow-xl rounded-lg transition-all duration-200"
                        />
                        {showOriginal && (
                            <div className="absolute top-6 left-6 bg-slate-800/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md pointer-events-none">
                                ORIGINAL
                            </div>
                        )}
                        {!showOriginal && viewMode === 'single' && (
                             <div className="absolute top-6 left-6 bg-primary-600/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md pointer-events-none">
                                RESULT
                            </div>
                        )}
                    </div>
                )
            ) : (
                <div className="relative z-10 flex-1 flex items-center justify-center p-8">
                    <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <ZoomIn className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">Preview Unavailable</h4>
                        <p className="text-slate-500 text-sm">
                            This file format ({file.outputExtension.toUpperCase()}) cannot be previewed directly in the browser. Please download the file to view it.
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer / Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shrink-0">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
                 {canCompare && viewMode === 'single' && (
                    <button 
                        onMouseDown={() => setShowOriginal(true)}
                        onMouseUp={() => setShowOriginal(false)}
                        onMouseLeave={() => setShowOriginal(false)}
                        onTouchStart={() => setShowOriginal(true)}
                        onTouchEnd={() => setShowOriginal(false)}
                        className="flex items-center px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors select-none active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Hold to Compare
                    </button>
                 )}
                 {canCompare && viewMode === 'side-by-side' && (
                     <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                         Displaying side-by-side comparison
                     </div>
                 )}
            </div>

            <a 
                href={file.blobUrl} 
                download={`${file.originalName.substring(0, file.originalName.lastIndexOf('.'))}.${file.outputExtension}`}
                className="flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all active:scale-95 w-full sm:w-auto justify-center hover:-translate-y-0.5"
            >
                <Download className="w-5 h-5 mr-2" />
                Download Image
            </a>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;