
import React from 'react';
import { ShieldCheck, Zap, Cpu, Image as ImageIcon, Layers, FileText, ArrowRight, Lock, Eye, Globe, Eraser, Sparkles, Star, Users, CheckCircle2, Play } from 'lucide-react';
import { ToolType } from '../types';
import AnimatedTitle from './AnimatedTitle';
import PixelAnimation from './PixelAnimation';

interface LandingProps {
    onNavigate: (tool: ToolType) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
    return (
        <div className="animate-fade-in pb-20">
            {/* Hero Section - Premium Redesign */}
            <section className="relative pt-8 pb-32 lg:pt-12 lg:pb-40 overflow-hidden">
                {/* Animated Mesh Gradient Background */}
                <div className="absolute inset-0 mesh-gradient"></div>

                {/* Animated Blobs */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-primary-400/30 to-purple-500/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-primary-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>

                {/* Pixel Animation Background */}
                <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                    <PixelAnimation />
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute top-20 left-[10%] w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-xl animate-float opacity-80 flex items-center justify-center rotate-12">
                    <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-40 right-[15%] w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl animate-float-slow opacity-80 flex items-center justify-center -rotate-12" style={{ animationDelay: '1s' }}>
                    <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="absolute bottom-32 left-[8%] w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-xl animate-float opacity-70 flex items-center justify-center rotate-6" style={{ animationDelay: '2s' }}>
                    <Eraser className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-48 right-[12%] w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl animate-float-reverse opacity-75 flex items-center justify-center -rotate-6">
                    <Layers className="w-8 h-8 text-white" />
                </div>

                {/* Orbiting Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none hidden lg:block">
                    <div className="absolute w-4 h-4 bg-primary-500 rounded-full animate-orbit opacity-40" style={{ animationDuration: '15s' }}></div>
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full animate-orbit opacity-40" style={{ animationDuration: '20s', animationDelay: '-5s' }}></div>
                    <div className="absolute w-5 h-5 bg-pink-500 rounded-full animate-orbit opacity-30" style={{ animationDuration: '25s', animationDelay: '-10s' }}></div>
                </div>

                {/* Main Hero Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    {/* Version Badge */}
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-primary-100/50 mb-10 shadow-lg shadow-primary-500/10 animate-glow">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-bold text-slate-700">v2.0 Now Live</span>
                        <span className="h-4 w-px bg-slate-300"></span>
                        <span className="text-sm font-medium text-slate-500">100% Client-Side Processing</span>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8">
                        <span className="text-slate-900">The Secure</span>
                        <br />
                        <span className="gradient-text-animated inline-block">
                            <AnimatedTitle text="AI_Converter" />
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Optimize images, vectorize bitmaps, remove backgrounds, and convert documents
                        <strong className="text-slate-800 font-semibold"> directly in your browser</strong>.
                        <br className="hidden md:block" />
                        <span className="inline-flex items-center gap-2 mt-2">
                            <Lock className="w-5 h-5 text-primary-600" />
                            <span className="text-primary-600 font-semibold">No server uploads, zero privacy risk.</span>
                        </span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
                        <a
                            href="/compress-image"
                            onClick={(e) => { e.preventDefault(); onNavigate('image-compressor'); }}
                            className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 btn-shimmer"
                        >
                            <ImageIcon className="w-6 h-6" />
                            <span>Compress Images</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="/svg-optimizer"
                            onClick={(e) => { e.preventDefault(); onNavigate('optimizer'); }}
                            className="group w-full sm:w-auto px-10 py-5 glass rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-slate-700 hover:text-primary-600"
                        >
                            <Layers className="w-6 h-6" />
                            <span>SVG Tools</span>
                        </a>
                        <a
                            href="/remove-background"
                            onClick={(e) => { e.preventDefault(); onNavigate('bg-remover'); }}
                            className="group w-full sm:w-auto px-10 py-5 glass rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-slate-700 hover:text-rose-600"
                        >
                            <Eraser className="w-6 h-6" />
                            <span>Remove BG</span>
                        </a>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <span className="text-sm font-semibold">10K+ Happy Users</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <span className="text-sm font-semibold">5.0 Rating</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-semibold">100% Private</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-semibold">Instant Processing</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Primary Tools Grid */}
            <section className="max-w-6xl mx-auto px-4 mb-24">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-4 h-4" />
                        Powerful Tools
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900">Everything You Need</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tool Card 1 - Image Compressor */}
                    <a
                        href="/compress-image"
                        onClick={(e) => { e.preventDefault(); onNavigate('image-compressor'); }}
                        className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all cursor-pointer relative overflow-hidden card-3d"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-125"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-50 rounded-tr-full -ml-5 -mb-5 opacity-50"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">Image Compressor</h3>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">Popular</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Intelligent AI compression for JPG, PNG, WEBP, and GIF. Reduce file size by up to 90% without visible quality loss.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                                    Try Compressor <ArrowRight className="w-4 h-4 ml-2" />
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Free Forever</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Tool Card 2 - Background Remover */}
                    <a
                        href="/remove-background"
                        onClick={(e) => { e.preventDefault(); onNavigate('bg-remover'); }}
                        className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-rose-200/50 transition-all cursor-pointer relative overflow-hidden card-3d"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-100 to-rose-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-125"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-rose-50 rounded-tr-full -ml-5 -mb-5 opacity-50"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                                <Eraser className="w-8 h-8" />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-2xl font-black text-slate-800 group-hover:text-rose-600 transition-colors">Background Remover</h3>
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-xs font-bold">AI Powered</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Instantly remove backgrounds from images with AI. Smart edge detection running 100% locally in your browser.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center font-bold text-rose-600 group-hover:translate-x-2 transition-transform">
                                    Remove Background <ArrowRight className="w-4 h-4 ml-2" />
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>No Limits</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Tool Card 3 - SVG Suite */}
                    <a
                        href="/svg-optimizer"
                        onClick={(e) => { e.preventDefault(); onNavigate('optimizer'); }}
                        className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all cursor-pointer relative overflow-hidden card-3d"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-125"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-50 rounded-tr-full -ml-5 -mb-5 opacity-50"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <Layers className="w-8 h-8" />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-2xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">SVG Suite</h3>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">Pro Tools</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                The ultimate toolkit for vectors. Optimize SVG code, convert bitmaps to vectors (PNG to SVG), or rasterize vectors.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center font-bold text-purple-600 group-hover:translate-x-2 transition-transform">
                                    Open SVG Tools <ArrowRight className="w-4 h-4 ml-2" />
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Unlimited</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Tool Card 4 - Document Converter */}
                    <a
                        href="/pdf-to-docx"
                        onClick={(e) => { e.preventDefault(); onNavigate('pdf-docx'); }}
                        className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all cursor-pointer relative overflow-hidden card-3d"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-125"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-50 rounded-tr-full -ml-5 -mb-5 opacity-50"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">Document Converter</h3>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">Secure</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Safely convert PDF to Word, Images to PDF, and more. Handle sensitive contracts and documents locally.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center font-bold text-emerald-600 group-hover:translate-x-2 transition-transform">
                                    Convert Docs <ArrowRight className="w-4 h-4 ml-2" />
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>100% Private</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </section>

            {/* Security & Features Banner */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[200%] bg-gradient-to-r from-primary-600/10 to-purple-600/10 rotate-12 blur-3xl"></div>
                    <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[150%] bg-gradient-to-l from-blue-600/10 to-primary-600/10 -rotate-12 blur-3xl"></div>
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Security First
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Why run-time security matters</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Traditional converters upload your files to a cloud server. <span className="text-white font-semibold">We don't.</span>
                            <br />Our engine runs entirely in your browser using WebAssembly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                            <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">100% Private</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Your data never leaves your device. Perfect for sensitive legal documents, personal photos, and proprietary designs.
                            </p>
                        </div>
                        <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                            <div className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                <Zap className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">Blazing Fast</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Zero upload time. Zero download time. Conversion happens instantly using your device's processing power.
                            </p>
                        </div>
                        <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                            <div className="p-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                <Cpu className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">Unlimited & Offline</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Once loaded, the app works offline. No data caps, no server queues, and no "pro tier" for basic speed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-24 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-bold uppercase tracking-wider">
                                <Globe className="w-4 h-4" />
                                Use Cases
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                Designed for<br />
                                <span className="gradient-text">modern workflow</span>
                            </h2>

                            <div className="space-y-6">
                                <div className="flex gap-5 p-5 rounded-2xl bg-white shadow-lg shadow-slate-100 border border-slate-100 hover:shadow-xl transition-shadow">
                                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 mb-1">Web Developers</h4>
                                        <p className="text-slate-500">
                                            Optimize assets for Core Web Vitals. Convert heavy PNGs to WEBP and minify SVGs for faster load times.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 p-5 rounded-2xl bg-white shadow-lg shadow-slate-100 border border-slate-100 hover:shadow-xl transition-shadow">
                                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                                        <Eye className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 mb-1">Designers</h4>
                                        <p className="text-slate-500">
                                            Quickly rasterize vectors for previews or vectorise sketches. Clean up exported SVGs from Illustrator/Figma.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 p-5 rounded-2xl bg-white shadow-lg shadow-slate-100 border border-slate-100 hover:shadow-xl transition-shadow">
                                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                                        <Lock className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 mb-1">Enterprise</h4>
                                        <p className="text-slate-500">
                                            Handle NDAs and internal documents safely without needing complex on-premise software.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            {/* Abstract Interface Preview */}
                            <div className="relative rounded-3xl bg-white shadow-2xl border border-slate-100 p-8 rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600"></div>
                                    <div className="space-y-2">
                                        <div className="w-36 h-4 bg-slate-100 rounded-lg"></div>
                                        <div className="w-24 h-3 bg-slate-50 rounded-lg"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-20 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-semibold">
                                        <Play className="w-5 h-5 mr-2" />
                                        Drag & Drop Interface
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full w-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary-500 to-purple-600 w-3/4 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400 font-bold">
                                        <span>Processing...</span>
                                        <span className="text-primary-600">75%</span>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white p-3 rounded-xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Status</p>
                                        <p className="text-base font-black text-slate-800">Client-Side Secure</p>
                                    </div>
                                </div>

                                {/* Stats Badge */}
                                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary-500 to-purple-600 text-white p-4 rounded-2xl shadow-xl">
                                    <p className="text-2xl font-black">-90%</p>
                                    <p className="text-xs opacity-80">File Size</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
