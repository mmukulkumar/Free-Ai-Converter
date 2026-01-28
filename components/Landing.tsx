
import React, { useState, useEffect, useRef } from 'react';
import {
    ShieldCheck, Zap, Image as ImageIcon, Layers, FileText, ArrowRight,
    Lock, Globe, Eraser, Sparkles, Star, Users, CheckCircle2, ChevronDown,
    Play, Palette, FileImage, Code, Download, Shield, Clock, Infinity as InfinityIcon,
    Cpu, Command, Zap as ZapIcon
} from 'lucide-react';
import { ToolType } from '../types';
import FaqSection from './FaqSection';

interface LandingProps {
    onNavigate: (tool: ToolType) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
    // Optimized mouse movement using refs to avoid re-renders
    const spotlightRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;

        const handleMouseMove = (e: MouseEvent) => {
            if (spotlightRef.current && containerRef.current) {
                // Use requestAnimationFrame to sync with screen refresh rate
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(() => {
                    if (!spotlightRef.current || !containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(99,102,241,0.15), transparent 40%)`;
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const tools = [
        { id: 'image-compressor', name: 'Image Compressor', desc: 'Intelligent lossy & lossless compression', icon: ImageIcon, badge: 'Popular', color: 'text-blue-400' },
        { id: 'bg-remover', name: 'BG Remover', desc: 'Neural network background removal', icon: Eraser, badge: 'AI Power', color: 'text-rose-400' },
        { id: 'optimizer', name: 'SVG Optimizer', desc: 'Vector minification engine', icon: Layers, badge: 'Dev Tool', color: 'text-purple-400' },
        { id: 'pdf-docx', name: 'PDF Converter', desc: 'Secure document transformation', icon: FileText, color: 'text-emerald-400' },
        { id: 'png-svg', name: 'Vectorize', desc: 'Bitmap to SVG tracer', icon: Code, color: 'text-amber-400' },
        { id: 'jpg-png', name: 'Format Switch', desc: 'Universal image converter', icon: FileImage, color: 'text-cyan-400' },
    ];

    return (
        <div ref={containerRef} className="min-h-screen relative overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 pointer-events-none transition-colors duration-500" />

            {/* Spotlight Gradient */}
            <div
                ref={spotlightRef}
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-20"
                style={{
                    background: 'radial-gradient(600px circle at 50% 50%, rgba(99,102,241,0.15), transparent 40%)' // Default fallback
                }}
            />

            {/* Blob Animations (CSS only, lightweight - Reduced blur for performance) */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob" style={{ animationDelay: '4s' }} />

            {/* ===== MAIN CONTENT ===== */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">

                {/* HERO SECTION */}
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
                        <Sparkles className="w-3 h-3" />
                        Next-Generation AI Engine
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Transform Files with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 text-glow">
                            Intelligent Speed
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Experience the world's most advanced client-side file processor.
                        Optimization, conversion, and AI editing—running 100% locally on your device.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={() => onNavigate('image-compressor')}
                            className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] flex items-center justify-center gap-3"
                        >
                            <Zap className="w-5 h-5 fill-current" />
                            Launch Accelerator
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => onNavigate('bg-remover')}
                            className="px-8 py-4 glass-card hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3"
                        >
                            <Cpu className="w-5 h-5" />
                            AI Tools Suite
                        </button>
                    </div>
                </div>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-32 auto-rows-[minmax(180px,auto)]">

                    {/* Feature 1: Privacy (Large) */}
                    <div className="col-span-1 md:col-span-4 glass-card p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <ShieldCheck className="w-48 h-48 text-emerald-500 -mr-10 -mt-10" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <Lock className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Zero-Trust Privacy</h3>
                                <p className="text-slate-400 max-w-md">Our WebAssembly core ensures your data never leaves your browser sandbox. No server uploads, ever.</p>
                            </div>
                            <div className="mt-8 flex items-center gap-4 text-emerald-400 bg-emerald-500/10 w-fit px-4 py-2 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>SOC2 Compliant Architecture</span>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Stats */}
                    <div className="col-span-1 md:col-span-2 glass-card p-8 rounded-3xl flex flex-col justify-center items-center text-center group hover:bg-slate-800/80 transition-colors">
                        <div className="mb-4 relative">
                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <Users className="w-16 h-16 text-blue-400 relative z-10" />
                        </div>
                        <h4 className="text-4xl font-black text-white mb-1">10M+</h4>
                        <p className="text-slate-400 font-medium">Files Processed</p>
                    </div>

                    {/* Feature 3: Speed */}
                    <div className="col-span-1 md:col-span-2 glass-card p-8 rounded-3xl group">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6">
                            <ZapIcon className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Instant Scale</h3>
                        <p className="text-slate-400 text-sm">GPU-accelerated processing handles thousands of files in parallel.</p>
                    </div>

                    {/* Feature 4: AI Power */}
                    <div className="col-span-1 md:col-span-2 glass-card p-8 rounded-3xl group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 relative z-10">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">AI Neural Engine</h3>
                        <p className="text-slate-400 text-sm relative z-10">Smart background removal and image enhancement algorithms.</p>
                    </div>

                    {/* Feature 5: Offline */}
                    <div className="col-span-1 md:col-span-2 glass-card p-8 rounded-3xl group">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6">
                            <InfinityIcon className="w-6 h-6 text-pink-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Offline Ready</h3>
                        <p className="text-slate-400 text-sm">PWA capability allows full functionality without internet.</p>
                    </div>
                </div>

                {/* TOOLS GRID */}
                <div className="mb-32">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-white">Powerful Tools</h2>
                        <button onClick={() => onNavigate('image-compressor')} className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 transition-colors">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => onNavigate(tool.id as ToolType)}
                                className="glass-card glass-card-hover p-6 rounded-2xl text-left group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <tool.icon className="w-24 h-24 rotate-12" />
                                </div>

                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${tool.color}`}>
                                        <tool.icon className="w-6 h-6" />
                                    </div>
                                    {tool.badge && (
                                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-slate-800 border border-slate-700 ${tool.color}`}>
                                            {tool.badge}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors relative z-10">{tool.name}</h3>
                                <p className="text-slate-400 text-sm relative z-10">{tool.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* SEO & COMPARE SECTION */}
                <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Why professionals switch to <span className="text-indigo-400">Local Processing</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Security', desc: 'No risk of data breaches. Files stay on your OS.', icon: Shield },
                                { title: 'Speed', desc: 'Zero network latency. Instant manipulation of DOM blobs.', icon: Zap },
                                { title: 'Reliability', desc: 'Works in air-gapped environments and flights.', icon: Command }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                                        <item.icon className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Abstract Tech Visual */}
                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[100px] opacity-20" />
                        <div className="glass-card p-1 rounded-3xl relative z-10">
                            <div className="bg-slate-950 rounded-[22px] p-6 lg:p-10 border border-white/5">
                                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                    <div>
                                        <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">Performance Benchmark</div>
                                        <div className="text-2xl font-bold text-white">Conversion Latency</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-emerald-400">0.05s</div>
                                        <div className="text-xs text-emerald-500/70 font-mono">AVG TIME</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-white font-medium">Local AI (Ours)</span>
                                            <span className="text-emerald-400 font-mono">50ms</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[5%] bg-emerald-500 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Cloud Competitor A</span>
                                            <span className="text-slate-500 font-mono">1200ms</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[60%] bg-slate-700 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Cloud Competitor B</span>
                                            <span className="text-slate-500 font-mono">3500ms</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[90%] bg-slate-700 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRUST LOGOS */}
                <div className="border-t border-white/5 pt-16 text-center">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-8">Trusted by developers at</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple text logos for aesthetic clean look */}
                        {['Vercel', 'Stripe', 'Supabase', 'OpenAI', 'Figma'].map(name => (
                            <span key={name} className="text-xl font-bold text-white">{name}</span>
                        ))}
                    </div>
                </div>

                {/* FAQ SECTION */}
                <div className="border-t border-white/5 mt-24">
                    <FaqSection />
                </div>
            </div>


            {/* SEO Footnote (Hidden visual, visible to crawlers) */}
            <div className="sr-only">
                <h2>Free Online Image Compressor</h2>
                <h2>Remove Background from Image Free</h2>
                <h2>Convert PDF to Word Securely</h2>
                <h2>SVG Optimizer for Web Developers</h2>
                <p>Best free tool to compress JPG, PNG, WEBP images. AI background removal tool. Client-side PDF converter.</p>
            </div>
        </div >
    );
};

export default Landing;
