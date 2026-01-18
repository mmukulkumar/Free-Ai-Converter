
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, Zap, Image, FileText, Video, Music, Camera, Box, PenTool } from 'lucide-react';
import { TabItem, ToolType } from '../types';

interface ToolSelectorProps {
  activeTab: ToolType;
  tabs: TabItem[];
  onTabChange: (id: ToolType) => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ activeTab, tabs, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTool = tabs.find(t => t.id === activeTab);
  const activeLabel = activeTool?.label || 'Select Tool';
  const ActiveIcon = getCategoryIcon(activeTool?.category);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTabs = tabs.filter(tab => 
    tab.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tabs by category
  const groupedTabs = filteredTabs.reduce((acc, tab) => {
    const cat = tab.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tab);
    return acc;
  }, {} as Record<string, TabItem[]>);

  // Category sort order
  const categoryOrder = [
      'vector', 
      'image', 
      'document', 
      'video', 
      'audio', 
      'raw', 
      'other'
  ];
  
  const sortedCategories = Object.keys(groupedTabs).sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <div className="relative w-full border-b border-slate-100 bg-slate-50/50 p-4 rounded-t-3xl" ref={dropdownRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-500">Current Tool:</label>
        </div>
        
        <div className="relative flex-1 md:max-w-md">
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-medium hover:border-primary-300 hover:ring-2 hover:ring-primary-100 transition-all active:scale-[0.99] group"
            >
            <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500 group-hover:text-primary-600 group-hover:bg-primary-50'}`}>
                    <ActiveIcon className="w-4 h-4" />
                </div>
                <span className="text-base truncate">{activeLabel}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-fade-in-up origin-top ring-1 ring-black/5">
                <div className="p-3 border-b border-slate-50 bg-slate-50/30">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search tools..." 
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary-300 focus:ring-2 focus:ring-primary-100 text-slate-700 outline-none transition-all placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                </div>
                
                <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
                    {sortedCategories.map(cat => (
                        <div key={cat} className="py-2">
                            <div className="px-3 py-1.5 mb-1 flex items-center gap-2 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                                {React.createElement(getCategoryIcon(cat), { className: "w-3 h-3 text-slate-400" })}
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{getCategoryLabel(cat)}</span>
                            </div>
                            <div className="px-2">
                                {groupedTabs[cat].map(tab => (
                                    <button
                                            key={tab.id}
                                            onClick={() => {
                                                onTabChange(tab.id);
                                                setIsOpen(false);
                                                setSearchTerm('');
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${
                                                activeTab === tab.id 
                                                ? 'bg-primary-50 text-primary-700 font-semibold' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                                            }`}
                                    >
                                        <span>{tab.label}</span>
                                        <div className="flex items-center gap-2">
                                            {tab.isNew && activeTab !== tab.id && (
                                                <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">New</span>
                                            )}
                                            {activeTab === tab.id && <Check className="w-4 h-4 text-primary-600" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    {sortedCategories.length === 0 && (
                        <div className="px-4 py-8 text-center">
                            <p className="text-slate-400 text-sm font-medium">No tools found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Helper for Icons
const getCategoryIcon = (category?: string) => {
    switch(category) {
        case 'vector': return Zap;
        case 'image': return Image;
        case 'document': return FileText;
        case 'video': return Video;
        case 'audio': return Music;
        case 'raw': return Camera;
        default: return Box;
    }
}

const getCategoryLabel = (category: string) => {
     switch(category) {
        case 'vector': return 'Vector & SVG';
        case 'image': return 'Image Tools';
        case 'document': return 'PDF & Docs';
        case 'video': return 'Video Tools';
        case 'audio': return 'Audio Tools';
        case 'raw': return 'Raw Camera';
        default: return 'Other Tools';
    }
}

export default ToolSelector;
