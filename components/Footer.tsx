import React from 'react';
import { Zap, Github, Twitter, Heart } from 'lucide-react';

interface FooterProps {
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onAboutClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick, onAboutClick }) => {
    return (
        <footer className="bg-white border-t border-slate-200 pt-12 pb-8 z-10 relative mt-auto">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-slate-900 rounded-lg">
                                <Zap className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                            <span className="text-xl font-black text-slate-900">Free AI Converter</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                            Secure, client-side file tools for everyone. We believe in privacy-first design where your files never leave your device.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><button onClick={onAboutClick} className="hover:text-primary-600 transition-colors">About Us</button></li>
                            <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition-colors">API Access</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><button onClick={onPrivacyClick} className="hover:text-primary-600 transition-colors">Privacy Policy</button></li>
                            <li><button onClick={onTermsClick} className="hover:text-primary-600 transition-colors">Terms of Service</button></li>
                            <li><a href="#" className="hover:text-primary-600 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} Free AI Converter. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-rose-400 fill-current" />
                        <span>in London by dmsprism</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);