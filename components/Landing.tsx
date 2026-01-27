
import React, { useState } from 'react';
import {
    ShieldCheck, Zap, Cpu, Image as ImageIcon, Layers, FileText, ArrowRight,
    Lock, Globe, Eraser, Sparkles, Star, Users, CheckCircle2, ChevronDown,
    Play, Palette, FileImage, Code, Download, Shield, Clock, Infinity as InfinityIcon,
    BarChart3, TrendingUp, Award
} from 'lucide-react';
import { ToolType } from '../types';

interface LandingProps {
    onNavigate: (tool: ToolType) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "Is my data really private?",
            answer: "Yes, 100%. All processing happens directly in your browser using WebAssembly technology. Your files never leave your device - we don't have servers that receive or store your data."
        },
        {
            question: "What file types are supported?",
            answer: "We support a wide range of formats: Images (JPG, PNG, WEBP, GIF, HEIC, BMP, RAW), Documents (PDF, DOCX), Vectors (SVG), and more. Check each tool for specific format support."
        },
        {
            question: "Is there a file size limit?",
            answer: "Free users can process files up to 10MB. Pro users get up to 50MB per file, and Enterprise users have unlimited file sizes. All processing is instant since it's done locally."
        },
        {
            question: "Does it work offline?",
            answer: "Yes! Once the page loads, all conversion tools work completely offline. This makes it perfect for working on planes, in remote areas, or on secure networks."
        },
        {
            question: "How is this different from other converters?",
            answer: "Unlike iLovePDF, CloudConvert, or similar services, we never upload your files to a server. This means faster processing, complete privacy, and no risk of data breaches."
        }
    ];

    const tools = [
        { id: 'image-compressor', name: 'Image Compressor', desc: 'Reduce JPG, PNG, WEBP sizes by up to 90%', icon: ImageIcon, badge: 'Popular' },
        { id: 'bg-remover', name: 'Background Remover', desc: 'AI-powered background removal in seconds', icon: Eraser, badge: 'AI' },
        { id: 'optimizer', name: 'SVG Optimizer', desc: 'Clean and minify SVG vector graphics', icon: Layers, badge: 'Pro' },
        { id: 'png-jpg', name: 'PNG to JPG', desc: 'Convert PNG images to compressed JPG', icon: FileImage },
        { id: 'jpg-png', name: 'JPG to PNG', desc: 'Convert JPG to lossless PNG format', icon: FileImage },
        { id: 'png-svg', name: 'PNG to SVG', desc: 'Vectorize raster images to scalable SVG', icon: Code },
    ];

    return (
        <div className="w-full overflow-x-hidden">
            {/* ===== FULL-WIDTH BLUE HERO SECTION ===== */}
            <section className="w-full min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
                        {/* Left: Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                                </span>
                                <span className="text-sm font-semibold text-white">✨ 100% Free • No Server Uploads</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
                                Convert Any File
                                <br />
                                <span className="text-blue-200">— Instantly &</span>
                                <br />
                                <span className="text-cyan-300">Privately</span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Compress images, remove backgrounds, and convert documents right in your browser. <span className="text-white font-semibold">Your files never leave your device.</span>
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                                <button
                                    onClick={() => onNavigate('image-compressor')}
                                    className="group px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-400/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                >
                                    Start Converting — Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onNavigate('bg-remover')}
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
                                >
                                    <Play className="w-5 h-5" />
                                    See How It Works
                                </button>
                            </div>

                            {/* Trust Stats */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-blue-100/80">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium">5.0 Rating</span>
                                </div>
                                <div className="w-px h-4 bg-white/20"></div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm font-medium">10K+ Users</span>
                                </div>
                                <div className="w-px h-4 bg-white/20"></div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-400" />
                                    <span className="text-sm font-medium">100% Private</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Floating UI Mockups */}
                        <div className="relative hidden lg:flex items-center justify-center">
                            {/* Main Card */}
                            <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md transform rotate-1">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Image Compressor</p>
                                        <p className="text-sm text-slate-500">3 files processed</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">Done</span>
                                    </div>
                                </div>

                                {/* File List */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <FileImage className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">photo-beach.jpg</p>
                                                <p className="text-xs text-slate-400">2.4 MB → 420 KB</p>
                                            </div>
                                        </div>
                                        <span className="text-emerald-500 font-bold text-sm">-82%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <FileImage className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">banner-hero.png</p>
                                                <p className="text-xs text-slate-400">5.1 MB → 890 KB</p>
                                            </div>
                                        </div>
                                        <span className="text-emerald-500 font-bold text-sm">-83%</span>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                    <Download className="w-5 h-5" />
                                    Download All
                                </button>
                            </div>

                            {/* Floating Badge - Top Right */}
                            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl rotate-6 z-10">
                                <p className="text-2xl font-black">-90%</p>
                                <p className="text-xs opacity-80">File Size</p>
                            </div>

                            {/* Floating Badge - Bottom Left */}
                            <div className="absolute -bottom-4 -left-4 bg-white px-4 py-3 rounded-2xl shadow-xl -rotate-3 flex items-center gap-3 z-10">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Privacy</p>
                                    <p className="font-bold text-slate-800 text-sm">100% Local</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Logos Bar */}
                <div className="w-full bg-white/5 backdrop-blur-sm border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <p className="text-center text-sm text-blue-200/70 mb-4">Trusted by professionals worldwide</p>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                            {['Google', 'Microsoft', 'Adobe', 'Shopify', 'Figma', 'Notion', 'Stripe'].map((company) => (
                                <span key={company} className="text-sm md:text-base font-bold text-white/50 hover:text-white/80 transition-colors">{company}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FULL-WIDTH TOOLS SECTION ===== */}
            <section className="w-full py-20 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-4 h-4" />
                            All-in-One Tools
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Everything you need, in one place
                        </h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            A complete suite of file conversion tools, all running securely in your browser
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => onNavigate(tool.id as ToolType)}
                                className="group p-6 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all text-left"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <tool.icon className="w-7 h-7 text-white" />
                                    </div>
                                    {tool.badge && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tool.badge === 'Popular' ? 'bg-orange-100 text-orange-600' :
                                                tool.badge === 'AI' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            {tool.badge}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                                <p className="text-slate-500 mb-4">{tool.desc}</p>
                                <span className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                                    Try it free <ArrowRight className="w-4 h-4 ml-2" />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FULL-WIDTH ALTERNATING FEATURE SECTIONS ===== */}
            <section className="w-full py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                    {/* Feature 1 - Left */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                                <ImageIcon className="w-3 h-3" /> Image Compression
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                                Optimize your images for the web
                            </h3>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Reduce file sizes by up to 90% without visible quality loss. Perfect for web developers and content creators who need fast-loading images.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {['Smart AI compression', 'Batch processing', 'Supports JPG, PNG, WEBP, GIF', 'Download all as ZIP'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => onNavigate('image-compressor')}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                            >
                                Try Image Compressor <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-32 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-blue-200">
                                    <div className="text-center">
                                        <ImageIcon className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                                        <p className="text-blue-600 font-medium">Drop images here</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4"></div>
                                        <p className="text-xs text-slate-500 mt-2">Compressing... 75%</p>
                                    </div>
                                    <span className="text-emerald-500 font-bold">-78%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 - Right */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                            <div className="relative">
                                <div className="h-48 bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl flex items-center justify-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-700 rounded-full flex items-center justify-center">
                                            <Users className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-pink-100 rounded-full opacity-0 animate-ping"></div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    Background Removed!
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
                                <Eraser className="w-3 h-3" /> AI Background Removal
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                                Remove backgrounds with AI
                            </h3>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Our AI-powered tool removes backgrounds from images in seconds. Perfect for product photos, profile pictures, and creative projects.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {['AI-powered edge detection', 'Works with complex images', 'Transparent PNG output', 'No signup required'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => onNavigate('bg-remover')}
                                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                            >
                                Try Background Remover <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FULL-WIDTH STATS SECTION ===== */}
            <section className="w-full py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                            Trusted by creators worldwide
                        </h2>
                        <p className="text-lg text-slate-500">Join thousands who trust our secure file tools</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '10M+', label: 'Files Processed', icon: FileImage, color: 'from-blue-500 to-blue-600' },
                            { value: '50K+', label: 'Happy Users', icon: Users, color: 'from-emerald-500 to-teal-600' },
                            { value: '99.9%', label: 'Uptime', icon: TrendingUp, color: 'from-purple-500 to-indigo-600' },
                            { value: '0 bytes', label: 'Data Stored', icon: Shield, color: 'from-orange-500 to-red-600' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FAQ SECTION ===== */}
            <section className="w-full py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-600 text-sm font-bold uppercase tracking-wider mb-4">
                            FAQ
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            Frequently asked questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <span className="font-bold text-slate-800">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === index && (
                                    <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FULL-WIDTH BLUE CTA SECTION ===== */}
            <section className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 md:py-28 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto">
                        Join thousands of users who trust our secure, fast, and private file conversion tools.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('image-compressor')}
                            className="group px-10 py-5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-400/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            Start Converting — Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => onNavigate('bg-remover')}
                            className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
                        >
                            View All Tools
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-blue-100/80">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>100% free to use</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>No signup needed</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
