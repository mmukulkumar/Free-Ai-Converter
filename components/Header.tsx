
import React, { useState, useRef } from 'react';
import { 
    ChevronDown, Search, Menu, X, Zap, User, LogOut, 
    Image as ImageIcon, FileText, Video, Music, Box, Camera, 
    Sparkles, Layers, Grid, ArrowRight, Cpu, Eraser,
    BookOpen, Info, Rocket, ShieldCheck
} from 'lucide-react';
import { MENU_CATEGORIES } from '../utils/formats';
import { ToolType } from '../types';

interface HeaderProps {
  activeTab: ToolType;
  onTabChange: (id: ToolType) => void;
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
  onAboutClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onPromoteClick: () => void;
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
  onLoginClick, 
  onSignupClick, 
  onLogoutClick,
  onHomeClick,
  onAboutClick,
  onPrivacyClick,
  onTermsClick,
  onPromoteClick
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
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - Futuristic Gradient */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group" 
            onClick={onHomeClick}
          >
            <div className="relative p-2 mr-2">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
               <div className="relative bg-white rounded-xl p-1.5 shadow-sm border border-slate-100">
                  <Zap className="w-6 h-6 text-primary-600" fill="currentColor" />
               </div>
            </div>
            <div className="flex flex-col">
                <div className="text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-none">
                    Free<span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">AI</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-1 pl-0.5">Converter</span>
            </div>
          </div>

          {/* Desktop Navigation - Pill Design */}
          <nav className="hidden lg:flex items-center justify-center">
            <div className="flex items-center p-1.5 bg-slate-100/50 rounded-full border border-white/50 backdrop-blur-md shadow-inner gap-1">
                
                {/* Mega Menu Trigger */}
                <div 
                    className="relative px-4 py-2 rounded-full cursor-pointer transition-all hover:bg-white hover:shadow-sm group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
                        <Grid className="w-4 h-4" />
                        <span>Explore Tools</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`} />
                    </div>
                </div>
                
                {/* Resources Dropdown */}
                <div 
                    className="relative px-4 py-2 rounded-full cursor-pointer transition-all hover:bg-white hover:shadow-sm group"
                    onMouseEnter={handleResourcesEnter}
                    onMouseLeave={handleResourcesLeave}
                >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 group-hover:text-primary-600 transition-colors">
                        <BookOpen className="w-4 h-4" />
                        <span>Resources</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${resourcesOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`} />
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-52 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden z-20 transition-all duration-300 origin-top ${resourcesOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'} ring-1 ring-black/5`}>
                        <div className="p-1.5">
                            <button 
                                onClick={() => { onAboutClick(); setResourcesOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-colors"
                            >
                                <Info className="w-4 h-4" />
                                About Us
                            </button>
                            <button 
                                onClick={() => { onPrivacyClick(); setResourcesOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-colors"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Privacy Policy
                            </button>
                            <button 
                                onClick={() => { onTermsClick(); setResourcesOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Terms & Conditions
                            </button>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onPromoteClick}
                    className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2"
                >
                    <Rocket className="w-4 h-4" />
                    <span>Promote App</span>
                </button>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
             <div className="relative hidden xl:block group">
                 <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2.5 bg-slate-100/50 border border-transparent rounded-full text-sm font-medium text-slate-700 w-40 focus:w-64 transition-all focus:ring-2 focus:ring-primary-100 focus:bg-white focus:border-primary-200 placeholder:text-slate-400 group-hover:bg-white group-hover:shadow-sm"
                 />
                 <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-primary-500" />
             </div>
             
             {isAuthenticated && user ? (
                 <div className="relative">
                    <button 
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center gap-2 px-1.5 py-1.5 pr-4 rounded-full bg-white border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <User className="w-4 h-4 text-primary-600" />
                            </div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate group-hover:text-primary-600 transition-colors">{user.name}</span>
                    </button>
                    
                    {userDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden z-20 animate-fade-in-up ring-1 ring-black/5">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <button 
                                    onClick={() => {
                                        onLogoutClick();
                                        setUserDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Log In
                    </button>
                    <button 
                        onClick={onSignupClick}
                        className="relative group px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transition-all hover:-translate-y-0.5"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
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

        {/* --- MEGA MENU --- */}
        <div 
            className={`absolute top-[90%] left-0 w-full lg:block hidden pt-4 transition-all duration-300 transform origin-top ${isMegaMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-6 ring-1 ring-slate-900/5">
                <div className="grid grid-cols-4 gap-8">
                    {/* Left Column: Highlight */}
                    <div className="col-span-1 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-[60px] opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        
                        <div>
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-primary-600 relative z-10">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 relative z-10">Popular<br/>Tools</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6 relative z-10">
                                Secure, client-side conversion. No server uploads.
                            </p>
                        </div>
                        
                        <div className="space-y-2 relative z-10">
                            <a 
                                href="/compress-image"
                                onClick={() => {
                                    onTabChange('image-compressor');
                                    setIsMegaMenuOpen(false);
                                }}
                                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <ImageIcon className="w-4 h-4" /> Compressor
                            </a>
                            <a 
                                href="/remove-background"
                                onClick={() => {
                                    onTabChange('bg-remover');
                                    setIsMegaMenuOpen(false);
                                }}
                                className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-primary-300 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Eraser className="w-4 h-4" /> BG Remover
                            </a>
                            <a 
                                href="/svg-optimizer"
                                onClick={() => {
                                    onTabChange('optimizer');
                                    setIsMegaMenuOpen(false);
                                }}
                                className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-primary-300 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Layers className="w-4 h-4" /> SVG Optimizer
                            </a>
                        </div>
                    </div>

                    {/* Right Columns: Categories */}
                    <div className="col-span-3 grid grid-cols-3 gap-8">
                        {MENU_CATEGORIES.map((category, idx) => {
                             const Icon = getCategoryIcon(category.title);
                             return (
                                <div key={category.title} className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <Icon className="w-4 h-4 text-primary-500" />
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{category.title}</h4>
                                    </div>
                                    <ul className="space-y-1">
                                        {category.items.filter(item => item.id !== 'bg-remover').map((item) => (
                                            <li key={item.id}>
                                                <a
                                                    href={`/${getToolSlug(item.id)}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onTabChange(item.id);
                                                        setIsMegaMenuOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all group flex items-center justify-between ${activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'}`}
                                                >
                                                    <span>{item.label}</span>
                                                    {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             );
                        })}
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="absolute right-0 top-0 h-[100dvh] w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-fade-in-right">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
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
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                    <div className="mb-6 relative">
                        <input 
                            type="text" 
                            placeholder="Search tools..." 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* Categories Accordion */}
                    <div className="space-y-3 mb-6">
                        {MENU_CATEGORIES.map((category) => (
                            <div key={category.title} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                                <button 
                                    onClick={() => toggleMobileCategory(category.title)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <span className="text-sm font-bold text-slate-800 flex items-center gap-3">
                                        {React.createElement(getCategoryIcon(category.title), { className: "w-4 h-4 text-primary-500" })}
                                        {category.title}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileCategoryOpen === category.title ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {mobileCategoryOpen === category.title && (
                                    <div className="px-2 pb-2 pt-0 bg-slate-50/50 border-t border-slate-100">
                                        {category.items.map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => {
                                                    onTabChange(item.id);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${activeTab === item.id ? 'text-primary-700 bg-primary-50/50' : 'text-slate-600 hover:text-primary-600'}`}
                                            >
                                                {item.label}
                                                {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => {
                            onPromoteClick();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 bg-white border border-slate-200 text-slate-700 hover:border-primary-300 hover:text-primary-600 rounded-xl font-bold mb-6 shadow-sm flex items-center gap-3 transition-all"
                    >
                        <Rocket className="w-4 h-4 text-slate-400" /> Promote App
                    </button>

                    {/* Resources at Bottom */}
                    <div className="mb-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Resources</div>
                        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                             <button 
                                onClick={() => { onAboutClick(); setMobileMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-3 border-b border-slate-50 transition-colors"
                            >
                                <Info className="w-4 h-4 text-slate-400" /> About Us
                            </button>
                            <button 
                                onClick={() => { onPrivacyClick(); setMobileMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-3 border-b border-slate-50 transition-colors"
                            >
                                <ShieldCheck className="w-4 h-4 text-slate-400" /> Privacy Policy
                            </button>
                            <button 
                                onClick={() => { onTermsClick(); setMobileMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-3 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-slate-400" /> Terms & Conditions
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-white space-y-3">
                    {isAuthenticated && user ? (
                         <div className="space-y-3">
                             <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Signed in</p>
                                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                </div>
                             </div>
                             <button 
                                onClick={() => {
                                    onLogoutClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full py-3.5 border border-red-100 text-red-600 rounded-xl font-bold bg-red-50 hover:bg-red-100 transition-colors"
                            >
                                Sign Out
                            </button>
                         </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => {
                                    onLoginClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full py-3.5 border border-slate-200 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                            >
                                Log In
                            </button>
                            <button 
                                onClick={() => {
                                    onSignupClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors shadow-lg shadow-slate-900/20"
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
    switch(title) {
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
