
import React, { useState, useRef } from 'react';
import {
    ChevronDown, Search, Menu, X, Zap, User, LogOut,
    Image as ImageIcon, FileText, Video, Music, Box, Camera,
    Sparkles, Layers, Grid, ArrowRight, Cpu, Eraser,
    BookOpen, Info, Rocket, ShieldCheck, LayoutDashboard, Shield, Settings
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { MENU_CATEGORIES } from '../utils/formats';
import { ToolType } from '../types';

interface HeaderProps {
    activeTab: ToolType;
    onTabChange: (id: ToolType) => void;
    isAuthenticated: boolean;
    user: { name: string; email: string } | null;
    name: string;
    email: string;
    isAdmin?: boolean;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogoutClick: () => void;
    onHomeClick: () => void;
    onAboutClick: () => void;
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onPromoteClick: () => void;
    onDashboardClick?: () => void;
    onAdminClick?: () => void;
    onSearchClick: () => void;
}

const getToolSlug = (tool: ToolType): string => {
    if (tool === 'image-compressor') return 'compress-image';
    if (tool === 'bg-remover') return 'remove-background';
    if (tool === 'optimizer') return 'svg-optimizer';
    return tool.replace('-', '-to-');
};

const Header: React.FC<HeaderProps> = ({
    activeTab,
    onTabChange,
    isAuthenticated,
    user,
    isAdmin = false,
    onLoginClick,
    onSignupClick,
    onLogoutClick,
    onHomeClick,
    onAboutClick,
    onPrivacyClick,
    onTermsClick,
    onPromoteClick,
    onDashboardClick,
    onAdminClick,
    onSearchClick
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const toggleMobileCategory = (title: string) => {
        setMobileCategoryOpen(mobileCategoryOpen === title ? null : title);
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsMegaMenuOpen(true);
    };

    const handleResourcesEnter = () => {
        setResourcesOpen(true);
    };

    const handleResourcesLeave = () => {
        setResourcesOpen(false);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsMegaMenuOpen(false);
        }, 150);
    };

    return (
        <header className="sticky top-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                <div className="flex justify-between items-center h-16 md:h-20">

                    {/* Logo - Futuristic Gradient */}
                    <div
                        className="flex-shrink-0 flex items-center cursor-pointer group"
                        onClick={onHomeClick}
                    >
                        <div className="relative p-1.5 md:p-2 mr-1.5 md:mr-2">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl p-1 md:p-1.5 shadow-sm border border-slate-100">
                                <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary-600" fill="currentColor" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-lg md:text-2xl font-black tracking-tight text-slate-900 leading-none">
                                Free<span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">AI</span>
                            </div>
                            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] leading-none mt-0.5 md:mt-1 pl-0.5">Converter</span>
                        </div>
                    </div>

                    {/* Desktop Navigation - Pill Design */}
                    <nav className="hidden lg:flex items-center justify-center">
                        <div className="flex items-center p-1 bg-slate-100/50 rounded-full border border-white/50 backdrop-blur-md shadow-inner gap-0.5">

                            {/* Mega Menu Trigger */}
                            <div
                                className="relative px-3 py-2 rounded-full cursor-pointer transition-all hover:bg-white hover:shadow-sm group"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
                                    <Grid className="w-4 h-4" />
                                    <span>Tools</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`} />
                                </div>
                            </div>

                            {/* Resources Dropdown */}
                            <div
                                className="relative px-3 py-2 rounded-full cursor-pointer transition-all hover:bg-white hover:shadow-sm group"
                                onMouseEnter={handleResourcesEnter}
                                onMouseLeave={handleResourcesLeave}
                            >
                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 group-hover:text-primary-600 transition-colors">
                                    <BookOpen className="w-4 h-4" />
                                    <span>Resources</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${resourcesOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`} />
                                </div>

                                {/* Dropdown Menu */}
                                <div className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-hidden z-20 transition-all duration-300 origin-top ${resourcesOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'} ring-1 ring-black/5`}>
                                    <div className="p-1">
                                        <button
                                            onClick={() => { onAboutClick(); setResourcesOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg transition-colors"
                                        >
                                            <Info className="w-4 h-4" />
                                            About Us
                                        </button>
                                        <button
                                            onClick={() => { onPrivacyClick(); setResourcesOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg transition-colors"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Privacy Policy
                                        </button>
                                        <button
                                            onClick={() => { onTermsClick(); setResourcesOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg transition-colors"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Terms & Conditions
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onPromoteClick}
                                className="px-3 py-2 rounded-full text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-1.5"
                            >
                                <Rocket className="w-4 h-4" />
                                <span>Promote</span>
                            </button>
                        </div>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        <button
                            onClick={onSearchClick}
                            className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <ThemeToggle />

                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 px-1.5 py-1.5 pr-3 rounded-full bg-white border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all group"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <User className="w-3.5 h-3.5 text-primary-600" />
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 max-w-[80px] truncate group-hover:text-primary-600 transition-colors">{user.name}</span>
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-52 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-hidden z-20 animate-fade-in-up ring-1 ring-black/5">
                                        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                                        </div>
                                        <div className="p-1.5 space-y-0.5">
                                            <button
                                                onClick={() => {
                                                    onDashboardClick?.();
                                                    setUserDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                My Dashboard
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDashboardClick?.();
                                                    setUserDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => {
                                                        onAdminClick?.();
                                                        setUserDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                    Admin Dashboard
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-1.5 border-t border-slate-100">
                                            <button
                                                onClick={() => {
                                                    onLogoutClick();
                                                    setUserDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onLoginClick}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={onSignupClick}
                                    className="relative group px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-full overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transition-all hover:-translate-y-0.5"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        Sign Up <ArrowRight className="w-3 h-3" />
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* --- MEGA MENU (Desktop) - Compact Grid --- */}
                <div
                    className={`absolute top-full left-0 w-full lg:block hidden pt-2 transition-all duration-300 transform origin-top ${isMegaMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-200/50 p-5 ring-1 ring-slate-900/5">
                        {/* Quick Access Row */}
                        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Quick Access:</span>
                            <a
                                href="/compress-image"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTabChange('image-compressor');
                                    setIsMegaMenuOpen(false);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                                <ImageIcon className="w-3 h-3" /> Compressor
                            </a>
                            <a
                                href="/remove-background"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTabChange('bg-remover');
                                    setIsMegaMenuOpen(false);
                                }}
                                className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-full text-xs font-bold hover:border-primary-300 hover:text-primary-600 transition-all flex items-center gap-1.5"
                            >
                                <Eraser className="w-3 h-3" /> BG Remover
                            </a>
                            <a
                                href="/svg-optimizer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTabChange('optimizer');
                                    setIsMegaMenuOpen(false);
                                }}
                                className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-full text-xs font-bold hover:border-primary-300 hover:text-primary-600 transition-all flex items-center gap-1.5"
                            >
                                <Layers className="w-3 h-3" /> SVG Optimizer
                            </a>
                        </div>

                        {/* Categories Grid - 6 columns */}
                        <div className="grid grid-cols-6 gap-4">
                            {MENU_CATEGORIES.map((category) => {
                                const Icon = getCategoryIcon(category.title);
                                // Limit items shown in mega menu for compact view
                                const displayItems = category.items.filter(item => item.id !== 'bg-remover').slice(0, 5);
                                const hasMore = category.items.length > 5;

                                return (
                                    <div key={category.title} className="space-y-2">
                                        <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100">
                                            <Icon className="w-3.5 h-3.5 text-primary-500" />
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{category.title}</h4>
                                        </div>
                                        <ul className="space-y-0.5">
                                            {displayItems.map((item) => (
                                                <li key={item.id}>
                                                    <a
                                                        href={`/${getToolSlug(item.id)}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            onTabChange(item.id);
                                                            setIsMegaMenuOpen(false);
                                                        }}
                                                        className={`block px-2 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'}`}
                                                    >
                                                        {item.label}
                                                    </a>
                                                </li>
                                            ))}
                                            {hasMore && (
                                                <li>
                                                    <span className="block px-2 py-1 text-xs text-slate-400 font-medium">
                                                        +{category.items.length - 5} more
                                                    </span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* Mobile Menu Overlay - Redesigned */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="absolute right-0 top-0 h-[100dvh] w-[90%] max-w-[340px] bg-white shadow-2xl flex flex-col animate-fade-in-right">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    onHomeClick();
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <div className="p-1.5 bg-primary-50 rounded-lg"><Zap className="w-5 h-5 text-primary-600" fill="currentColor" /></div>
                                <span className="font-black text-lg text-slate-900 tracking-tight">FreeAI</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Quick Actions */}
                            <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-primary-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Popular Tools</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            onTabChange('image-compressor');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <ImageIcon className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">Compress</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onTabChange('bg-remover');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Eraser className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">BG Remove</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onTabChange('optimizer');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Layers className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">SVG Opt</span>
                                    </button>
                                </div>
                            </div>

                            {/* Categories - Compact Accordion */}
                            <div className="p-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">All Tools</p>
                                <div className="space-y-2">
                                    {MENU_CATEGORIES.map((category) => (
                                        <div key={category.title} className="bg-slate-50 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleMobileCategory(category.title)}
                                                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100 transition-colors"
                                            >
                                                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                    {React.createElement(getCategoryIcon(category.title), { className: "w-4 h-4 text-primary-500" })}
                                                    {category.title}
                                                    <span className="text-xs font-normal text-slate-400">({category.items.length})</span>
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileCategoryOpen === category.title ? 'rotate-180' : ''}`} />
                                            </button>

                                            {mobileCategoryOpen === category.title && (
                                                <div className="px-3 pb-3 grid grid-cols-2 gap-1.5">
                                                    {category.items.map((item) => (
                                                        <button
                                                            key={item.label}
                                                            onClick={() => {
                                                                onTabChange(item.id);
                                                                setMobileMenuOpen(false);
                                                            }}
                                                            className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === item.id ? 'text-primary-700 bg-primary-100' : 'text-slate-600 bg-white hover:text-primary-600'}`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="p-4 pt-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Resources</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => { onAboutClick(); setMobileMenuOpen(false); }}
                                        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <Info className="w-4 h-4 text-slate-400" /> About
                                    </button>
                                    <button
                                        onClick={() => { onPromoteClick(); setMobileMenuOpen(false); }}
                                        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <Rocket className="w-4 h-4 text-slate-400" /> Promote
                                    </button>
                                    <button
                                        onClick={() => { onPrivacyClick(); setMobileMenuOpen(false); }}
                                        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <ShieldCheck className="w-4 h-4 text-slate-400" /> Privacy
                                    </button>
                                    <button
                                        onClick={() => { onTermsClick(); setMobileMenuOpen(false); }}
                                        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 text-slate-400" /> Terms
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Auth Buttons */}
                        <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                            {isAuthenticated && user ? (
                                <div className="space-y-2">
                                    <div className="px-3 py-2 bg-slate-50 rounded-xl flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-400 font-medium">Signed in</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            onLogoutClick();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full py-2.5 border border-red-100 text-red-600 rounded-xl font-bold text-sm bg-red-50 hover:bg-red-100 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            onLoginClick();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full py-2.5 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => {
                                            onSignupClick();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

// Helper for Category Icons in Mega Menu
const getCategoryIcon = (title: string) => {
    switch (title) {
        case 'Image': return ImageIcon;
        case 'Vector': return Layers;
        case 'Document': return FileText;
        case 'Video': return Video;
        case 'Audio': return Music;
        case 'Tools': return Cpu;
        default: return Box;
    }
}

export default React.memo(Header);
