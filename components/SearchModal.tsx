
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, ArrowRight } from 'lucide-react';
import { ALL_TABS } from '../utils/formats';
import { ToolType } from '../types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (tool: ToolType) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Auto focus and body lock
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const filteredTools = ALL_TABS.filter(tool =>
        tool.label.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 results

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-slate-100/10 animate-fade-in-up"
            >
                <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-4">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search tools (e.g., 'Compress', 'PDF', 'Remove BG')..."
                        className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 ml-2">
                        <span className="text-[10px]">ESC</span>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredTools.length > 0 ? (
                        <>
                            <div className="text-xs font-semibold text-slate-400 px-3 py-2 uppercase tracking-wider">Results</div>
                            <div className="space-y-1">
                                {filteredTools.map((tool) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => {
                                            onSelect(tool.id as ToolType);
                                            onClose();
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group text-left transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                                <Command className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                    {tool.label}
                                                </div>
                                                <div className="text-xs text-slate-400 capitalize">
                                                    {tool.category} Tool
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            No tools found for "{query}"
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
                    <span><strong>ProTip:</strong> Search for file extensions like 'PDF' or 'SVG'</span>
                    <span>Free AI Converter</span>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
