import React from 'react';
import { ArrowLeft, ShieldCheck, Zap, Globe, Heart, Lock, ServerOff } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-primary-600 transition-colors mb-8 font-medium group"
        >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to App
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Hero Header */}
          <div className="bg-slate-900 px-8 py-16 text-white relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute top-[-50%] right-[-20%] w-[80%] h-[200%] bg-primary-600/20 rotate-12 blur-3xl"></div>
                  <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
                    <Heart className="w-8 h-8 text-rose-400" fill="currentColor" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                    About Free AI Converter
                </h1>
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                    We are redefining online file tools by prioritizing your privacy. 
                    Powerful conversion, compression, and optimization—running entirely in your browser.
                </p>
              </div>
          </div>

          {/* Main Content */}
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Mission Section */}
            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary-600" />
                    Our Mission
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                    In a world where data privacy is constantly under threat, we believe your files should remain yours. 
                    Most online converters upload your documents to remote servers, creating potential security risks. 
                    <strong>Free AI Converter</strong> was built to solve this problem. Our mission is to provide professional-grade 
                    file manipulation tools that are free, accessible, and most importantly, <strong>100% private</strong>.
                </p>
            </section>

            {/* The Privacy Promise */}
            <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    The Zero-Upload Promise
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <ServerOff className="w-5 h-5 text-slate-500" />
                            No Server Storage
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            We do not store, view, or process your files on our servers. 
                            Unlike traditional tools, our technology runs locally on your device using WebAssembly. 
                            When you "upload" a file, it never actually leaves your computer.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-slate-500" />
                            End-to-End Privacy
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Whether you are converting sensitive legal PDF documents, personal photos, or proprietary vector graphics, 
                            you can trust that your data remains confidential. It processes in your browser memory and is wiped when you close the tab.
                        </p>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    Powered by Modern Web Tech
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                    We leverage cutting-edge browser technologies like <strong>WebAssembly (Wasm)</strong> and <strong>Service Workers</strong> to bring desktop-class performance to the web.
                    This allows us to offer features like:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                        "Instant Image Compression",
                        "Vector (SVG) Optimization",
                        "PDF Generation & Manipulation",
                        "Background Removal (AI)",
                        "Offline Capability",
                        "Batch Processing"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Contact / Footer */}
            <section className="border-t border-slate-100 pt-8 mt-8">
                <p className="text-slate-500 text-center">
                    Have questions or suggestions? We'd love to hear from you.<br/>
                    <a href="mailto:support@freeaiconverter.com" className="text-primary-600 font-bold hover:underline">Contact Support</a>
                </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;