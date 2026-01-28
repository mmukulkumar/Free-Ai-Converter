import React, { useState, useRef } from 'react';
import { Upload, Download, Zap, Eye, EyeOff } from 'lucide-react';

interface BackgroundRemoverDemoProps {
  onProcess?: (blob: Blob, fileName: string) => void;
}

const BackgroundRemoverDemo: React.FC<BackgroundRemoverDemoProps> = ({ onProcess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult('');
      setShowComparison(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      }
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const { removeBackgroundAdvanced } = await import('../utils/backgroundRemover');
      const blob = await removeBackgroundAdvanced(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setResult(e.target?.result as string);
        setShowComparison(true);

        if (onProcess) {
          const fileName = selectedFile.name.replace(/\.[^.]+$/, '_no_bg.png');
          onProcess(blob, fileName);
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Background removal failed:', error);
      alert('Failed to remove background. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.href = result;
    link.download = selectedFile?.name.replace(/\.[^.]+$/, '_no_bg.png') || 'no_background.png';
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500" />
          Background Remover Demo
        </h2>
        <p className="text-slate-600 mt-2">Upload an image to remove its background instantly</p>
      </div>

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 font-medium">Drag & drop an image or click to select</p>
          <p className="text-slate-500 text-sm mt-1">Supports PNG, JPG, WEBP, GIF, and more</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preview and Result */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2">Original Image</p>
              <img
                src={preview}
                alt="Original"
                className="w-full rounded-lg shadow-md max-h-96 object-contain bg-white"
              />
            </div>

            {result && (
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">Background Removed</p>
                <div className="relative rounded-lg shadow-md overflow-hidden max-h-96 bg-white">
                  {showComparison && (
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors z-10"
                    >
                      {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  {showComparison ? (
                    <>
                      <img
                        src={result}
                        alt="Result"
                        className="w-full object-contain max-h-96"
                      />
                    </>
                  ) : (
                    <img
                      src={preview}
                      alt="Original"
                      className="w-full object-contain max-h-96"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreview('');
                setResult('');
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Change Image
            </button>

            {!result ? (
              <button
                onClick={processImage}
                disabled={isProcessing}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Remove Background'}
              </button>
            ) : (
              <button
                onClick={downloadResult}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Result
              </button>
            )}
          </div>

          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700 font-medium">Processing your image...</p>
              <p className="text-blue-600 text-sm mt-1">Initializing AI models (first run may take a moment)...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundRemoverDemo;
