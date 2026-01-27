
import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link2, Check, MessageCircle } from 'lucide-react';

interface SocialShareButtonsProps {
    toolName: string;
    toolDescription?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ toolName, toolDescription }) => {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out ${toolName} - ${toolDescription || 'Free online file converter with 100% privacy!'} via @FreeAIConverter`;

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const openShareWindow = (url: string) => {
        window.open(url, '_blank', 'width=600,height=400,scrollbars=yes');
    };

    return (
        <div className="relative">
            {/* Share Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
                    transition-all duration-300 
                    ${isOpen
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600 shadow-sm hover:shadow-md'
                    }
                `}
            >
                <Share2 className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-45' : 'group-hover:scale-110'}`} />
                <span>Share This Tool</span>
            </button>

            {/* Share Options Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-3 p-4 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 min-w-[280px] z-50 animate-fade-in">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Share via</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* Twitter/X */}
                        <button
                            onClick={() => openShareWindow(shareLinks.twitter)}
                            className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-500 transition-all group"
                        >
                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Twitter className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold">Twitter</span>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => openShareWindow(shareLinks.facebook)}
                            className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all group"
                        >
                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Facebook className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold">Facebook</span>
                        </button>

                        {/* LinkedIn */}
                        <button
                            onClick={() => openShareWindow(shareLinks.linkedin)}
                            className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-all group"
                        >
                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Linkedin className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold">LinkedIn</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                            onClick={() => openShareWindow(shareLinks.whatsapp)}
                            className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-600 transition-all group"
                        >
                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold">WhatsApp</span>
                        </button>
                    </div>

                    {/* Copy Link */}
                    <div className="pt-3 border-t border-slate-100">
                        <button
                            onClick={handleCopyLink}
                            className={`
                                w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-sm
                                transition-all duration-300
                                ${copied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }
                            `}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Link Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Link2 className="w-4 h-4" />
                                    <span>Copy Link</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default SocialShareButtons;
