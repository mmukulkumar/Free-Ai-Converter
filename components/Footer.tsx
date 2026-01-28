import React from 'react';
import { Zap, Github, Twitter, Heart } from 'lucide-react';

interface FooterProps {
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onAboutClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick, onAboutClick }) => {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 pt-12 pb-8 z-10 relative mt-auto transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-slate-900 dark:bg-primary-600 rounded-lg">
                                <Zap className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                            <span className="text-xl font-black text-slate-900 dark:text-white">Free AI Converter</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
                            Secure, client-side file tools for everyone. We believe in privacy-first design where your files never leave your device.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-blue-400 dark:hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><button onClick={onAboutClick} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</button></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">API Access</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><button onClick={onPrivacyClick} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</button></li>
                            <li><button onClick={onTermsClick} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</button></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        © {new Date().getFullYear()} Free AI Converter. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
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