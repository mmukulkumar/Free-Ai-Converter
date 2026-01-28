
import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Zap, Globe, Lock, Cpu, Command } from 'lucide-react';

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const categories = [
        {
            title: "Security & Privacy",
            icon: ShieldCheck,
            questions: [
                {
                    q: "Is my data really 100% private?",
                    a: "Yes. Unlike other converters, we process files entirely within your browser using WebAssembly. Your files never leave your device and are never uploaded to any server."
                },
                {
                    q: "Can I use this tool offline?",
                    a: "Absolutely. Once the page loads, our PWA (Progressive Web App) technology allows all tools to function without an internet connection."
                },
                {
                    q: "Do you store any logs of my files?",
                    a: "No. Since we don't have a backend server processing your files, it's technically impossible for us to log or store your content."
                },
                {
                    q: "Is this compliant with GDPR/CCPA?",
                    a: "Yes. Because we don't collect, process, or store personal data on our servers, we satisfy the strict privacy requirements of GDPR and CCPA."
                },
                {
                    q: "Is it safe for confidential business documents?",
                    a: "Yes. This is the safest way to convert sensitive documents (like legal PDFs or financial records) because they remain physically on your machine."
                }
            ]
        },
        {
            title: "Image Intelligence",
            icon: Zap,
            questions: [
                {
                    q: "How does the AI Background Remover work?",
                    a: "We use a quantized neural network that runs directly in your browser's GPU/CPU. It identifies the subject and creates a precise alpha mask in milliseconds."
                },
                {
                    q: "Does image compression reduce quality?",
                    a: "Our smart lossy compression reduces file size by up to 90% while maintaining visual fidelity unseen to the naked eye. We also offer lossless options."
                },
                {
                    q: "What image formats are supported?",
                    a: "We support processing for JPG, PNG, WEBP, AVIF, GIF, and TIFF. You can convert between these formats instantly."
                },
                {
                    q: "Can I batch process multiple images?",
                    a: "Yes! Our engine creates a parallel worker thread for each image, allowing you to bulk compress or convert dozens of files simultaneously."
                },
                {
                    q: "How do I optimize SVG files?",
                    a: "Our SVG optimizer strips unnecessary metadata, comments, and redundant paths, reducing vector file sizes by up to 60% for web use."
                }
            ]
        },
        {
            title: "Technical & Performance",
            icon: Cpu,
            questions: [
                {
                    q: "What is WebAssembly (WASM)?",
                    a: "WASM is a binary instruction format that allows code to run at near-native speed in web browsers. It's the engine behind our lightning-fast performance."
                },
                {
                    q: "Why is this faster than cloud converters?",
                    a: "Cloud converters require uploading and downloading files. We eliminate network latency completely by processing data locally."
                },
                {
                    q: "Does it work on mobile devices?",
                    a: "Yes, our interface is fully responsive. Modern smartphones are powerful enough to run our AI models smoothly."
                },
                {
                    q: "What are the browser requirements?",
                    a: "We recommend the latest versions of Chrome, Edge, Firefox, or Safari for the best experience with WebAssembly and multithreading support."
                }
            ]
        },
        {
            title: "Usage & Limits",
            icon: Command,
            questions: [
                {
                    q: "Is standard usage really free?",
                    a: "Yes, the core features are free to use. We offer Pro plans for power users needing higher batch limits and advanced AI models."
                },
                {
                    q: "What is the file size limit?",
                    a: "Free users can process files up to 2GB. Pro users effectively have no limit other than their device's memory."
                },
                {
                    q: "How do I install this as an app?",
                    a: "On Chrome/Edge, click the 'Install' icon in the address bar. On iOS, tap Share > Add to Home Screen."
                },
                {
                    q: "Can I cancel my subscription anytime?",
                    a: "Yes, you can manage your subscription directly from the dashboard and cancel instantly with no hidden fees."
                },
                {
                    q: "Do you offer API access?",
                    a: "Currently we are a client-side tool. An API for server-side processing is in development for Enterprise partners."
                }
            ]
        }
    ];

    return (
        <section className="py-24 relative z-10">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                        Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">Knowledge Base</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Technical details about our secure, client-side technology.
                    </p>
                </div>

                <div className="grid gap-12">
                    {categories.map((category, catIndex) => (
                        <div key={catIndex} className="bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm transition-colors duration-500 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                    <category.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{category.title}</h3>
                            </div>

                            <div className="space-y-4">
                                {category.questions.map((item, i) => {
                                    const globalIndex = catIndex * 100 + i; // Unique ID
                                    const isOpen = openIndex === globalIndex;

                                    return (
                                        <div key={i} itemScope itemType="https://schema.org/Question" className="border-b border-slate-200 dark:border-slate-800 last:border-0 pb-4 last:pb-0">
                                            <button
                                                onClick={() => toggleFaq(globalIndex)}
                                                className="w-full flex items-start justify-between text-left group py-2"
                                            >
                                                <span itemProp="name" className={`font-bold text-lg transition-colors ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                                                    {item.q}
                                                </span>
                                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 mt-1 flex-shrink-0 ${isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
                                            </button>

                                            <div
                                                itemScope
                                                itemType="https://schema.org/Answer"
                                                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}
                                            >
                                                <div className="overflow-hidden">
                                                    <p itemProp="text" className="text-slate-600 dark:text-slate-400 leading-relaxed pr-8">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
