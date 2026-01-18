
import React, { useState } from 'react';
import { Settings2, ChevronDown, ChevronUp, FileText, Image as ImageIcon, Sliders, Zap, Gauge } from 'lucide-react';
import { OptimizerSettings, PdfPageOptions, RasterOptions } from '../types';

interface SettingsPanelProps {
  activeTab: string;
  settings: OptimizerSettings;
  onChange: (settings: OptimizerSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ activeTab, settings, onChange }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Determine conversion type
  const isPdfOutput = activeTab.endsWith('-pdf') || activeTab === 'pdf-merge';
  const isSvgOutput = activeTab === 'optimizer' || activeTab.endsWith('-svg');
  // Explicit check for compressor to show more options
  const isCompressor = activeTab === 'image-compressor';
  // General raster output check (includes compressor)
  const isRasterOutput = !isPdfOutput && !isSvgOutput && (activeTab.includes('-') || isCompressor);
  
  const handleSvgChange = (key: keyof OptimizerSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const handlePdfChange = (key: keyof PdfPageOptions, value: any) => {
    onChange({ 
      ...settings, 
      pdfOptions: { ...settings.pdfOptions, [key]: value } 
    });
  };

  const handleRasterChange = (key: keyof RasterOptions, value: any) => {
    onChange({
        ...settings,
        rasterOptions: { ...settings.rasterOptions, [key]: value }
    });
  };

  const toggleMetadata = (checked: boolean) => {
    onChange({ ...settings, removeMetadata: checked });
  };

  return (
    <div className="bg-white border-b border-slate-200 animate-fade-in rounded-xl shadow-sm border mb-6 overflow-hidden">
      
      {/* --- PROMINENT COMPRESSION CONTROLS (ALWAYS VISIBLE) --- */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                    <Gauge className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Compression Level</h3>
                    <p className="text-xs text-slate-500">Balance between file size and quality</p>
                </div>
            </div>

            <div className="flex-1 max-w-lg space-y-4">
                {isSvgOutput ? (
                    // SVG CONTROLS
                    <div className="flex items-center gap-3">
                         <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 w-full">
                            {(['low', 'medium', 'high'] as const).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => handleSvgChange('level', level)}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all capitalize ${
                                        settings.level === level 
                                        ? 'bg-white text-primary-600 shadow-md ring-1 ring-black/5' 
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    // RASTER & PDF CONTROLS (Quality Slider)
                    <div className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image Quality</span>
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                settings.rasterOptions.quality > 0.8 ? 'bg-green-100 text-green-700' : 
                                settings.rasterOptions.quality > 0.5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {Math.round(settings.rasterOptions.quality * 100)}%
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            step="5" 
                            value={settings.rasterOptions.quality * 100}
                            onChange={(e) => handleRasterChange('quality', parseInt(e.target.value) / 100)}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        />
                         <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-medium">
                            <span>Max Compression</span>
                            <span>Best Quality</span>
                        </div>
                    </div>
                )}
                
                {/* For Compressor: Expose Resize and Grayscale immediately */}
                {isCompressor && (
                    <div className="grid grid-cols-2 gap-4">
                        <select 
                            value={settings.rasterOptions.resize}
                            onChange={(e) => handleRasterChange('resize', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
                        >
                            <option value="1">Original Scale</option>
                            <option value="0.75">75% Scale</option>
                            <option value="0.5">50% Scale</option>
                            <option value="0.25">25% Scale</option>
                        </select>

                        <div className="flex items-center px-3 border border-slate-200 rounded-lg bg-white">
                             <input 
                                type="checkbox" 
                                id="comp_grayscale"
                                checked={settings.rasterOptions.grayscale}
                                onChange={(e) => handleRasterChange('grayscale', e.target.checked)}
                                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                            />
                            <label htmlFor="comp_grayscale" className="ml-2 cursor-pointer text-sm text-slate-600 font-medium">
                                Grayscale
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- ADVANCED TOGGLE --- */}
      <button 
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 hover:bg-slate-50 border-t border-slate-100 transition-colors"
      >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{isAdvancedOpen ? 'Hide' : 'Show'} Advanced Settings</span>
          {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* --- ADVANCED SETTINGS CONTENT --- */}
      {isAdvancedOpen && (
        <div className="px-6 pb-6 pt-4 bg-slate-50/50 border-t border-slate-100/50 animate-fade-in">
            
            {/* 1. PDF SPECIFIC SETTINGS */}
            {isPdfOutput && (
                <div className="bg-white rounded-xl p-5 mb-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>PDF Page Configuration</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {/* Page Size */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Page Size</label>
                            <select 
                                value={settings.pdfOptions.pageSize}
                                onChange={(e) => handlePdfChange('pageSize', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
                            >
                                <option value="a4">A4</option>
                                <option value="letter">Letter</option>
                                <option value="original">Fit to Image</option>
                            </select>
                        </div>

                        {/* Orientation */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Orientation</label>
                            <select 
                                value={settings.pdfOptions.orientation}
                                onChange={(e) => handlePdfChange('orientation', e.target.value)}
                                disabled={settings.pdfOptions.pageSize === 'original'}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 focus:bg-white transition-all disabled:opacity-50"
                            >
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>

                         {/* Margin */}
                         <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Margin</label>
                            <select 
                                value={settings.pdfOptions.margin}
                                onChange={(e) => handlePdfChange('margin', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
                            >
                                <option value="none">None</option>
                                <option value="small">Small (10mm)</option>
                                <option value="large">Large (25mm)</option>
                            </select>
                        </div>

                        {/* Alignment */}
                         <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Alignment</label>
                            <select 
                                value={settings.pdfOptions.alignment}
                                onChange={(e) => handlePdfChange('alignment', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
                            >
                                <option value="center">Center</option>
                                <option value="top-left">Top Left</option>
                            </select>
                        </div>
                    </div>

                    {/* Checkbox: Enlarge */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                        <input 
                            type="checkbox" 
                            id="fitToPage"
                            checked={settings.pdfOptions.fitToPage}
                            onChange={(e) => handlePdfChange('fitToPage', e.target.checked)}
                            className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                        />
                        <label htmlFor="fitToPage" className="cursor-pointer text-sm text-slate-600 font-medium">
                            Enlarge small images to fit page
                        </label>
                    </div>
                </div>
            )}

            {/* 2. SVG SPECIFIC SETTINGS */}
            {isSvgOutput && (
                <div className="bg-white rounded-xl p-5 mb-4 border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase">
                                    Coordinate Precision
                                </label>
                                <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-1.5 rounded">
                                    {settings.precision}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="5" 
                                step="1" 
                                value={settings.precision}
                                onChange={(e) => handleSvgChange('precision', parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="md:col-span-2 flex flex-col md:flex-row gap-6 pt-2">
                             <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={settings.removeComments}
                                    onChange={(e) => handleSvgChange('removeComments', e.target.checked)}
                                    className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-600 font-medium group-hover:text-primary-600 transition-colors">Remove Comments</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={settings.mergePaths}
                                    onChange={(e) => handleSvgChange('mergePaths', e.target.checked)}
                                    className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-600 font-medium group-hover:text-primary-600 transition-colors">Merge Paths (Experimental)</span>
                             </label>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. RASTER SPECIFIC SETTINGS (JPG, PNG, WEBP) */}
            {isRasterOutput && !isCompressor && (
                <div className="bg-white rounded-xl p-5 mb-4 border border-slate-200 shadow-sm">
                     <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm">
                        <ImageIcon className="w-4 h-4 text-slate-500" />
                        <span>Output Customization</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                         {/* Resize */}
                         <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Resize Output</label>
                            <select 
                                value={settings.rasterOptions.resize}
                                onChange={(e) => handleRasterChange('resize', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
                            >
                                <option value="1">Original Size (100%)</option>
                                <option value="0.75">75% Scale</option>
                                <option value="0.5">50% Scale</option>
                                <option value="0.25">25% Scale</option>
                            </select>
                         </div>
                    
                        {/* Grayscale */}
                        <div className="flex items-center h-full pt-6">
                             <div className="flex items-center gap-3">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="grayscale"
                                        checked={settings.rasterOptions.grayscale}
                                        onChange={(e) => handleRasterChange('grayscale', e.target.checked)}
                                        className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                                    />
                                </div>
                                <label htmlFor="grayscale" className="cursor-pointer">
                                    <span className="block text-sm font-bold text-slate-700">Convert to Grayscale</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. GLOBAL SETTINGS (Applied to all) */}
            <div className="flex items-start gap-3 mt-4 px-1">
                 <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        id="stripMetadata"
                        checked={settings.removeMetadata}
                        onChange={(e) => toggleMetadata(e.target.checked)}
                        className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                </div>
                <label htmlFor="stripMetadata" className="cursor-pointer">
                    <span className="block text-sm font-bold text-slate-700">Strip Metadata</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Removes EXIF data, profiles, and comments to reduce file size significantly.</span>
                </label>
            </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
