
import React, { useState, useEffect, useRef } from 'react';
import { Download, Check, Loader2, FileCode, ArrowRight, Pencil, X, Eye, AlertCircle } from 'lucide-react';
import { OptimizedFile } from '../types';
import { formatBytes, calculateSavings } from '../utils/optimizer';
import Tooltip from './Tooltip';
import PreviewModal from './PreviewModal';

interface FileListProps {
  files: OptimizedFile[];
}

const FileItem: React.FC<{ file: OptimizedFile; onPreview: (file: OptimizedFile) => void }> = ({ file, onPreview }) => {
  const [progress, setProgress] = useState(0);

  const initialBaseName = file.originalName.substring(0, file.originalName.lastIndexOf('.')) || file.originalName;
  const [baseName, setBaseName] = useState(initialBaseName);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(baseName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: number;

    if (file.status === 'PROCESSING') {
      setProgress(0);
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95;
          const increment = prev < 50 ? 5 : (prev < 80 ? 2 : 0.5);
          return prev + increment;
        });
      }, 150);
    } else if (file.status === 'COMPLETED') {
      setProgress(100);
    }

    return () => clearInterval(interval);
  }, [file.status]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setBaseName(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempName(baseName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') handleCancelEdit();
  };

  const getDownloadName = () => {
    return `${baseName}.${file.outputExtension}`;
  };

  return (
    <div className="group bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between transition-all duration-300 hover:shadow-md dark:shadow-none hover:border-primary-100 dark:hover:border-primary-500/30">
      <div className="flex items-center space-x-4 overflow-hidden flex-1">
        {/* Icon/Preview */}
        <div
          onClick={() => file.status === 'COMPLETED' && onPreview(file)}
          className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all overflow-hidden border border-slate-100 dark:border-white/10 ${file.status === 'COMPLETED' ? 'bg-slate-50 dark:bg-slate-900 cursor-pointer hover:opacity-80' : 'bg-slate-50 dark:bg-slate-900'}`}
        >
          {file.status === 'COMPLETED' && file.blobUrl ? (
            <img src={file.blobUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <FileCode className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          )}
        </div>

        <div className="min-w-0 flex-1 pr-4">
          {/* Filename Row */}
          <div className="flex items-center mb-1.5">
            {isEditing ? (
              <div className="flex items-center space-x-1 w-full max-w-[240px] animate-fade-in">
                <input
                  ref={inputRef}
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-w-0 text-sm font-medium border border-primary-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary-100 text-slate-800"
                />
                <Tooltip content="Confirm">
                  <button onClick={handleSaveName} className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded p-1 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                </Tooltip>
                <Tooltip content="Cancel">
                  <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded p-1 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            ) : (
              <div className="flex items-center group/name overflow-hidden">
                <p
                  onClick={() => file.status === 'COMPLETED' && onPreview(file)}
                  className={`text-sm font-semibold text-slate-700 dark:text-white truncate ${file.status === 'COMPLETED' ? 'cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 hover:underline decoration-dashed underline-offset-2' : ''}`}
                  title={getDownloadName()}
                >
                  {baseName}.{file.outputExtension}
                </p>
                {file.status === 'COMPLETED' && (
                  <div className="ml-2 opacity-0 group-hover/name:opacity-100 transition-opacity">
                    <Tooltip content="Rename this file">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempName(baseName);
                          setIsEditing(true);
                        }}
                        className="text-slate-300 hover:text-primary-500 p-0.5 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status Row */}
          <div className="text-xs min-h-[1.5rem] flex items-center">
            {file.status === 'PENDING' && <span className="text-slate-400 font-medium italic">Queued...</span>}

            {file.status === 'PROCESSING' && (
              <div className="w-full max-w-[200px] animate-fade-in">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-primary-600 text-[10px] font-bold uppercase tracking-wider">Processing</span>
                  <span className="text-primary-600 font-bold text-[10px]">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-primary-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {file.status === 'COMPLETED' && (
              <div className="flex items-center space-x-2 animate-fade-in">
                <span className="text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-700">{formatBytes(file.originalSize)}</span>
                <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                <span className="text-slate-700 dark:text-slate-200 font-bold">{formatBytes(file.optimizedSize)}</span>
                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  -{calculateSavings(file.originalSize, file.optimizedSize)}
                </span>
              </div>
            )}

            {file.status === 'ERROR' && (
              <Tooltip content={file.errorMessage || "Processing failed"}>
                <div className="flex items-center gap-1.5 cursor-help">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[10px]">Failed</span>
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ml-2 flex items-center gap-2">
        {file.status === 'COMPLETED' && (
          <>
            <Tooltip content="Preview & Compare">
              <button
                onClick={() => onPreview(file)}
                className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-all"
              >
                <Eye className="w-5 h-5" />
              </button>
            </Tooltip>

            <a
              href={file.blobUrl}
              download={getDownloadName()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-md active:scale-95 hover:shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ files }) => {
  const [previewFile, setPreviewFile] = useState<OptimizedFile | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const completedFiles = files.filter(f => f.status === 'COMPLETED' && f.blobUrl);

  const handleDownloadAll = async () => {
    if (completedFiles.length === 0) return;

    setIsZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all completed files to the ZIP
      for (const file of completedFiles) {
        if (file.blobUrl) {
          const response = await fetch(file.blobUrl);
          const blob = await response.blob();
          const baseName = file.originalName.substring(0, file.originalName.lastIndexOf('.')) || file.originalName;
          zip.file(`${baseName}.${file.outputExtension}`, blob);
        }
      }

      // Generate and download the ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted_files_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create ZIP:', error);
    } finally {
      setIsZipping(false);
    }
  };

  if (files.length === 0) return null;

  return (
    <>
      {/* Download All Button */}
      {completedFiles.length > 1 && (
        <div className="mt-6 flex justify-center animate-fade-in">
          <button
            onClick={handleDownloadAll}
            disabled={isZipping}
            className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg transition-all
                ${isZipping
                ? 'bg-slate-300 text-slate-500 cursor-wait'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:-translate-y-0.5 active:scale-95'
              }
              `}
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download All ({completedFiles.length} files) as ZIP</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 animate-fade-in-up delay-100">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onPreview={setPreviewFile} />
        ))}
      </div>

      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
};

export default FileList;
