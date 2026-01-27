
import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { Loader2, Check, Zap } from 'lucide-react';
import DropZone from './components/DropZone';
import FileList from './components/FileList';
import InfoSection from './components/InfoSection';
import ToolSelector from './components/ToolSelector';
import SettingsPanel from './components/SettingsPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimatedTitle from './components/AnimatedTitle';
import GridLoader from './components/GridLoader';
import Landing from './components/Landing';
import { formatBytes } from './utils/optimizer';
import { OptimizedFile, ToolType, OptimizerSettings } from './types';
import { ALL_TABS } from './utils/formats';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HorizontalBannerAd, BetweenSectionAd, FooterBannerAd } from './components/ads/AdSlot';

const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const LimitModal = lazy(() => import('./components/LimitModal'));
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const PromoteApp = lazy(() => import('./components/PromoteApp'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const AuthModal = lazy(() => import('./components/auth/AuthModal'));
const UserDashboard = lazy(() => import('./components/dashboard/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const PricingModal = lazy(() => import('./components/subscription/PricingModal'));

const FREE_LIMIT = 20;

type ViewState = 'landing' | 'home' | 'login' | 'signup' | 'privacy' | 'terms' | 'promote' | 'about' | 'dashboard' | 'admin';
type UserState = { name: string; email: string } | null;

// --- SEO & Routing Helpers ---
const getToolSlug = (tool: ToolType): string => {
  if (tool === 'image-compressor') return 'compress-image';
  if (tool === 'bg-remover') return 'remove-background';
  if (tool === 'optimizer') return 'svg-optimizer';
  return tool.replace('-', '-to-');
};

const getToolFromSlug = (slug: string): ToolType | null => {
  if (slug === 'compress-image') return 'image-compressor';
  if (slug === 'remove-background') return 'bg-remover';
  if (slug === 'svg-optimizer') return 'optimizer';
  if (slug.includes('-to-')) return slug.replace('-to-', '-') as ToolType;
  return null;
};

const getSeoMetadata = (view: ViewState, tool: ToolType) => {
  if (view === 'landing') return {
    title: 'Free AI Converter | Secure Client-Side File Tools',
    description: 'Optimize images, remove backgrounds, and convert documents securely in your browser. No server uploads, 100% private.'
  };
  if (view === 'login') return { title: 'Login - Free AI Converter', description: 'Login to your account.' };
  if (view === 'signup') return { title: 'Sign Up - Free AI Converter', description: 'Create a free account.' };
  if (view === 'privacy') return { title: 'Privacy Policy - Free AI Converter', description: 'Our commitment to your privacy.' };
  if (view === 'terms') return { title: 'Terms of Service - Free AI Converter', description: 'Terms and conditions.' };
  if (view === 'about') return { title: 'About Us - Free AI Converter', description: 'About Free AI Converter.' };
  if (view === 'promote') return { title: 'Promote - Free AI Converter', description: 'Promote our app.' };

  if (view === 'home') {
    switch (tool) {
      case 'image-compressor': return { title: 'Free Image Compressor - Optimize JPG, PNG, WEBP', description: 'Compress images online without losing quality. Client-side compression ensures your photos never leave your device.' };
      case 'bg-remover': return { title: 'Free Background Remover - AI Powered', description: 'Remove image backgrounds instantly with AI. 100% free and private running locally in your browser.' };
      case 'optimizer': return { title: 'SVG Optimizer - Minify Vector Graphics', description: 'Optimize SVG files for web. Clean up code and reduce file size securely.' };
      default:
        const parts = tool.split('-');
        if (parts.length === 2) {
          return {
            title: `Convert ${parts[0].toUpperCase()} to ${parts[1].toUpperCase()} - Free Tool`,
            description: `Free online ${parts[0].toUpperCase()} to ${parts[1].toUpperCase()} converter. Secure client-side conversion.`
          };
        }
        return { title: 'Free AI Converter Tool', description: 'Secure online file conversion tool.' };
    }
  }
  return { title: 'Free AI Converter', description: 'Secure client-side file tools.' };
};

const App: React.FC = () => {
  // Get auth state from context
  const { user: authUser, profile, session, isLoading: authLoading, signOut } = useAuth();

  // Derive isAuthenticated and user from auth context
  const isAuthenticated = !!session;
  const user: UserState = authUser ? {
    name: profile?.full_name || authUser.email?.split('@')[0] || 'User',
    email: authUser.email || ''
  } : null;
  const isAdmin = profile?.role === 'admin';

  // App Routing State
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [usageCount, setUsageCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // New Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Existing App State
  const [activeTab, setActiveTab] = useState<ToolType>('image-compressor');
  const [files, setFiles] = useState<OptimizedFile[]>([]);

  // State for Optimizer Settings
  const [optimizerSettings, setOptimizerSettings] = useState<OptimizerSettings>({
    // SVG Defaults
    level: 'medium',
    precision: 2,
    removeComments: true,
    removeMetadata: true,
    mergePaths: false,

    // PDF Defaults
    pdfOptions: {
      pageSize: 'a4',
      orientation: 'portrait',
      margin: 'none',
      alignment: 'center',
      fitToPage: true
    },

    // Raster Defaults
    rasterOptions: {
      quality: 0.8, // Default to 80% quality for good compression
      resize: 1,
      grayscale: false
    }
  });

  // Load usage count from local storage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('usageCount');
    if (savedCount) {
      setUsageCount(parseInt(savedCount, 10));
    }
  }, []);

  // --- Routing Logic ---
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1); // remove leading slash

      if (path === '' || path === 'home') {
        setCurrentView('landing');
        return;
      }

      if (['login', 'signup', 'privacy', 'terms', 'promote', 'about', 'dashboard', 'admin'].includes(path)) {
        setCurrentView(path as ViewState);
        return;
      }

      const tool = getToolFromSlug(path);
      if (tool) {
        setActiveTab(tool);
        setCurrentView('home');
      } else {
        // 404 fallback to landing
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial check

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- SEO & URL Sync ---
  useEffect(() => {
    // 1. Update URL
    let path = '/';
    if (currentView !== 'landing') {
      if (currentView === 'home') {
        path = '/' + getToolSlug(activeTab);
      } else {
        path = '/' + currentView;
      }
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }

    // 2. Update Meta Tags
    const seo = getSeoMetadata(currentView, activeTab);
    document.title = seo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // 3. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', window.location.href);

    // 4. Favicon (Dynamic)
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>`;
  }, [currentView, activeTab]);

  // Configure accepted files based on active tool
  const getAcceptedExtensions = useCallback((tool: ToolType): string[] => {
    if (tool === 'image-compressor' || tool === 'bg-remover') {
      return ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.heic', '.heif'];
    }
    if (tool === 'optimizer') return ['.svg'];
    const parts = tool.split('-');
    if (parts.length === 2) {
      return [`.${parts[0]}`];
    }
    return ['.svg']; // Default fallback
  }, []);

  const acceptedExtensions = useMemo(() => getAcceptedExtensions(activeTab), [activeTab, getAcceptedExtensions]);

  const handleClear = useCallback(() => {
    setFiles(prev => {
      prev.forEach(f => {
        if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
        if (f.originalBlobUrl) URL.revokeObjectURL(f.originalBlobUrl);
      });
      return [];
    });
  }, []);

  const handleTabChange = useCallback((id: ToolType) => {
    setActiveTab(id);
    handleClear(); // Clean up existing files and blobs
    setCurrentView('home'); // Switch to tool view when a tab is selected
  }, [handleClear]);

  const handleHomeClick = useCallback(() => {
    setCurrentView('landing');
  }, []);

  // Auth Handlers - Auth state is now managed by AuthContext
  const handleLogin = useCallback((_email: string) => {
    // Auth state is managed by AuthContext, just navigate
    setCurrentView('landing');
    setShowLimitModal(false);
  }, []);

  const handleSignup = useCallback((_name: string, _email: string) => {
    // Auth state is managed by AuthContext, just navigate  
    setCurrentView('landing');
    setShowLimitModal(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut();
    setCurrentView('landing');
  }, [signOut]);

  // Helper to get extension per file (for compressor) or per tool (for converters)
  const getTargetExtension = (tool: ToolType, fileName: string) => {
    if (tool === 'bg-remover') return 'png';

    if (tool === 'image-compressor') {
      const ext = fileName.split('.').pop()?.toLowerCase();
      // If browser usually can't encode heic/raw/bmp/gif directly back to source, we default to jpg/png
      if (ext === 'heic' || ext === 'heif') return 'jpg';
      if (ext === 'bmp') return 'jpg'; // Compress BMP to JPG by default
      if (ext === 'gif') return 'png'; // Compress static GIF to PNG
      return ext || 'jpg';
    }
    if (tool === 'optimizer') return 'svg';
    const parts = tool.split('-');
    return parts.length > 1 ? parts[1] : 'file';
  };

  // Handle new files added - add to queue with limit check
  const handleFilesAdded = useCallback((newFiles: File[]) => {

    // LIMIT CHECK LOGIC
    if (!isAuthenticated) {
      if (usageCount >= FREE_LIMIT) {
        setShowLimitModal(true);
        return;
      }

      // If adding these files exceeds the limit
      const remaining = FREE_LIMIT - usageCount;
      if (newFiles.length > remaining) {
        setShowLimitModal(true);
        return;
      }

      const newCount = usageCount + newFiles.length;
      setUsageCount(newCount);
      localStorage.setItem('usageCount', newCount.toString());
    }

    const newOptimizedFiles: OptimizedFile[] = newFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      originalName: f.name,
      originalSize: f.size,
      optimizedSize: 0,
      optimizedContent: '',
      status: 'PENDING',
      originalBlobUrl: URL.createObjectURL(f),
      outputExtension: getTargetExtension(activeTab, f.name),
      rawFile: f
    }));

    setFiles(prev => [...prev, ...newOptimizedFiles]);
  }, [isAuthenticated, usageCount, activeTab]);

  // Process a single file
  const processFile = useCallback(async (id: string, file: File) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'PROCESSING' } : f));

    try {
      const { convertFile } = await import('./utils/converters');
      // Pass the current optimizerSettings to convertFile
      const { content, extension } = await convertFile(file, activeTab, optimizerSettings);

      let blob: Blob;
      let contentToStore: string | Blob;
      let size = 0;

      if (content instanceof Blob) {
        blob = content;
        contentToStore = content;
        size = content.size;
      } else {
        blob = new Blob([content], { type: 'image/svg+xml' });
        contentToStore = content;
        size = blob.size;
      }

      const url = URL.createObjectURL(blob);

      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            status: 'COMPLETED',
            optimizedContent: contentToStore,
            optimizedSize: size,
            blobUrl: url,
            outputExtension: extension,
            rawFile: undefined
          };
        }
        return f;
      }));
    } catch (error) {
      console.error("Error processing file", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'ERROR',
        rawFile: undefined,
        errorMessage: errorMessage
      } : f));
    }
  }, [activeTab, optimizerSettings]);

  // NEW: Manual Conversion Trigger
  const handleConvertFiles = useCallback(() => {
    const pendingFiles = files.filter(f => f.status === 'PENDING');

    // Trigger processing for all pending files
    // Since this is client-side, we can just loop them. 
    // In a heavier app, we might want a concurrency queue, but for 5-10 files, this is fine.
    pendingFiles.forEach(f => {
      if (f.rawFile) {
        processFile(f.id, f.rawFile);
      }
    });
  }, [files, processFile]);

  const completedCount = files.filter(f => f.status === 'COMPLETED').length;
  const pendingCount = files.filter(f => f.status === 'PENDING').length;
  const processingCount = files.filter(f => f.status === 'PROCESSING').length;

  const totalOriginalSize = files.reduce((acc, f) => f.status === 'COMPLETED' ? acc + f.originalSize : acc, 0);
  const totalOptimizedSize = files.reduce((acc, f) => f.status === 'COMPLETED' ? acc + f.optimizedSize : acc, 0);
  const totalSaved = totalOriginalSize - totalOptimizedSize;
  const savingsPercent = totalOriginalSize > 0 ? (totalSaved / totalOriginalSize) * 100 : 0;

  const getHeroTitle = () => {
    if (activeTab === 'image-compressor') {
      return (
        <div className="flex flex-col items-center animate-fade-in">
          <span className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
            Image <AnimatedTitle text="Compressor" className="text-primary-600" />
          </span>
          <span className="text-lg text-slate-500 font-medium">Reduce file size while maintaining quality</span>
        </div>
      );
    }
    if (activeTab === 'bg-remover') {
      return (
        <div className="flex flex-col items-center animate-fade-in">
          <span className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
            Background <AnimatedTitle text="Remover" className="text-primary-600" />
          </span>
          <span className="text-lg text-slate-500 font-medium">Remove image backgrounds automatically with AI</span>
        </div>
      );
    }
    const parts = activeTab.split('-');
    if (parts.length === 2) {
      return (
        <div className="flex items-center justify-center gap-2 md:gap-3 animate-fade-in flex-wrap">
          <span className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tight">{parts[0]}</span>
          <span className="text-xl md:text-2xl font-medium text-slate-400">to</span>
          <AnimatedTitle
            text={parts[1]}
            className="text-primary-600"
            containerClass="text-3xl md:text-5xl font-black uppercase tracking-tight"
          />
          <span className="w-full text-center text-lg text-slate-500 font-medium mt-2">Converter</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center animate-fade-in">
        <span className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
          SVG <AnimatedTitle text="Optimizer" className="text-primary-600" />
        </span>
        <span className="text-lg text-slate-500 font-medium">Compress vectors without quality loss</span>
      </div>
    );
  };

  // View Routing
  if (currentView === 'privacy') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <Privacy onBack={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  if (currentView === 'promote') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <PromoteApp onBack={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  if (currentView === 'terms') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <Terms onBack={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  if (currentView === 'about') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <AboutUs onBack={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  if (currentView === 'login') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <Login
          onLogin={handleLogin}
          onNavigateSignup={() => setCurrentView('signup')}
          onBack={() => setCurrentView('landing')}
        />
      </Suspense>
    );
  }

  if (currentView === 'signup') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <Signup
          onSignup={handleSignup}
          onNavigateLogin={() => setCurrentView('login')}
          onBack={() => setCurrentView('landing')}
          onNavigateTerms={() => setCurrentView('terms')}
          onNavigatePrivacy={() => setCurrentView('privacy')}
        />
      </Suspense>
    );
  }

  // User Dashboard
  if (currentView === 'dashboard') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <UserDashboard
          onNavigateHome={() => setCurrentView('landing')}
          onOpenPricing={() => setShowPricingModal(true)}
        />
      </Suspense>
    );
  }

  // Admin Dashboard
  if (currentView === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GridLoader /></div>}>
        <AdminDashboard onNavigateHome={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100 blur-[120px] opacity-40"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-blue-100 blur-[100px] opacity-40"></div>
      </div>

      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isAuthenticated={isAuthenticated}
        user={user}
        isAdmin={isAdmin}
        onLoginClick={() => setCurrentView('login')}
        onSignupClick={() => setCurrentView('signup')}
        onLogoutClick={handleLogout}
        onHomeClick={handleHomeClick}
        onAboutClick={() => setCurrentView('about')}
        onPrivacyClick={() => setCurrentView('privacy')}
        onTermsClick={() => setCurrentView('terms')}
        onPromoteClick={() => setCurrentView('promote')}
        onDashboardClick={() => setCurrentView('dashboard')}
        onAdminClick={() => setCurrentView('admin')}
      />

      {/* Limit Modal */}
      <Suspense fallback={null}>
        {showLimitModal && (
          <LimitModal
            onClose={() => setShowLimitModal(false)}
            onSignup={() => {
              setShowLimitModal(false);
              setCurrentView('signup');
            }}
            onLogin={() => {
              setShowLimitModal(false);
              setCurrentView('login');
            }}
          />
        )}
      </Suspense>

      {/* Auth Modal */}
      <Suspense fallback={null}>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authModalMode}
          />
        )}
      </Suspense>

      {/* Pricing Modal */}
      <Suspense fallback={null}>
        {showPricingModal && (
          <PricingModal
            isOpen={showPricingModal}
            onClose={() => setShowPricingModal(false)}
          />
        )}
      </Suspense>

      <main className={`flex-1 w-full z-10 relative ${currentView === 'landing' ? '' : 'max-w-6xl mx-auto px-4 py-8 md:py-16'}`}>

        {currentView === 'landing' ? (
          <Landing onNavigate={handleTabChange} />
        ) : (
          <>
            {/* Hero / Instructions */}
            <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
              <div className="mb-6 flex justify-center">
                {getHeroTitle()}
              </div>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                Secure, client-side processing. Files never leave your browser.
              </p>
              {!isAuthenticated && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-slate-500">
                  <span>Free Plan: {Math.max(0, FREE_LIMIT - usageCount)} conversions remaining</span>
                </div>
              )}
            </div>

            {/* Main Interface Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-fade-in-up delay-75 relative">

              <ToolSelector
                activeTab={activeTab}
                tabs={ALL_TABS}
                onTabChange={handleTabChange}
              />

              {/* Workspace Area */}
              <div className="p-6 md:p-8 min-h-[400px]">

                {/* 1. SETTINGS PANEL (Exposed Compression) */}
                <SettingsPanel
                  activeTab={activeTab}
                  settings={optimizerSettings}
                  onChange={setOptimizerSettings}
                />

                {/* 2. DROP ZONE */}
                <DropZone
                  onFilesAdded={handleFilesAdded}
                  onClear={handleClear}
                  hasFiles={files.length > 0}
                  acceptedExtensions={acceptedExtensions}
                />

                {/* 3. CONVERT BUTTON & STATUS */}
                {pendingCount > 0 && (
                  <div className="mt-8 flex justify-center animate-fade-in">
                    <button
                      onClick={handleConvertFiles}
                      disabled={processingCount > 0}
                      className={`
                                        relative group flex items-center gap-3 px-10 py-4 rounded-full font-black text-base uppercase tracking-wider shadow-xl transition-all hover:-translate-y-1 active:scale-95
                                        ${processingCount > 0
                          ? 'bg-slate-300 text-white cursor-wait pr-6 pl-6'
                          : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-500/40 hover:shadow-primary-500/60'
                        }
                                    `}
                    >
                      {processingCount > 0 ? (
                        <>
                          <div className="mr-2 transform scale-75 origin-right">
                            <GridLoader />
                          </div>
                          <span className="ml-1">
                            {activeTab === 'image-compressor' ? 'Compressing...' :
                              activeTab === 'bg-remover' ? 'Removing Background...' : 'Converting...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6 fill-current" />
                          <span>
                            {activeTab === 'image-compressor' ? `Compress ${pendingCount} Files` :
                              activeTab === 'bg-remover' ? `Process ${pendingCount} Images` : `Convert ${pendingCount} Files`}
                          </span>
                          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold border-2 border-white">
                            {pendingCount}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Batch Status Alert / Queue Info */}
                {(completedCount > 0 || processingCount > 0) && (
                  <div className="mt-8 mb-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in shadow-sm">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                      <div className={`p-2.5 rounded-full flex-shrink-0 ${processingCount > 0 ? 'bg-primary-50 text-primary-600' : 'bg-green-50 text-green-600'}`}>
                        {processingCount > 0 ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Check className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800">
                          {processingCount > 0
                            ? `Processing batch... (${processingCount} active)`
                            : 'Batch Processing Complete'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>Completed {completedCount} files.</span>
                          {savingsPercent > 0 && (
                            <span className="inline-flex items-center text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                              Saved {formatBytes(totalSaved)} ({savingsPercent.toFixed(1)}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <FileList files={files} />
              </div>
            </div>

            {/* SEO / Info Content / Footer */}
            <InfoSection
              tool={activeTab}
              onNavigatePrivacy={() => setCurrentView('privacy')}
              onNavigateTerms={() => setCurrentView('terms')}
            />
          </>
        )}

      </main>

      <Footer
        onPrivacyClick={() => setCurrentView('privacy')}
        onTermsClick={() => setCurrentView('terms')}
        onAboutClick={() => setCurrentView('about')}
      />
    </div>
  );
};

// Wrapped App with AuthProvider
const AppWithAuth: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
