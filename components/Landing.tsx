
import React from 'react';
import { ShieldCheck, Zap, Cpu, Image as ImageIcon, Layers, FileText, ArrowRight, Lock, Eye, Globe, Eraser } from 'lucide-react';
import { ToolType } from '../types';
import AnimatedTitle from './AnimatedTitle';

interface LandingProps {
  onNavigate: (tool: ToolType) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full z-0 pointer-events-none">
             <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 animate-pulse-slow"></div>
             <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-primary-200 rounded-full blur-[100px] opacity-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 mb-8 shadow-sm">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                v2.0 Now Live with Client-Side Processing
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                The Secure <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                     <AnimatedTitle text="AI_Converter" />
                </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                Optimize images, vectorize bitmaps, and convert documents directly in your browser. <strong className="text-slate-700 font-semibold">No server uploads, zero privacy risk.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                    href="/compress-image"
                    onClick={(e) => { e.preventDefault(); onNavigate('image-compressor'); }}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                >
                    <ImageIcon className="w-5 h-5" />
                    Compress Images
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                    href="/svg-optimizer"
                    onClick={(e) => { e.preventDefault(); onNavigate('optimizer'); }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg shadow-lg shadow-slate-200/50 hover:border-primary-200 hover:text-primary-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    <Layers className="w-5 h-5" />
                    SVG Tools
                </a>
            </div>
        </div>
      </section>

      {/* Primary Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Tool Card 1 */}
             <a 
                href="/compress-image"
                onClick={(e) => { e.preventDefault(); onNavigate('image-compressor'); }}
                className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-primary-100 transition-all cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <ImageIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">Image Compressor</h3>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        Intelligent AI compression for JPG, PNG, WEBP, and GIF. Reduce file size by up to 90% without visible quality loss.
                    </p>
                    <span className="inline-flex items-center font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                        Try Compressor <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                </div>
             </a>

             {/* Tool Card 2 - Background Remover */}
             <a 
                href="/remove-background"
                onClick={(e) => { e.preventDefault(); onNavigate('bg-remover'); }}
                className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-rose-100 transition-all cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Eraser className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-rose-600 transition-colors">Background Remover</h3>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        Instantly remove backgrounds from images. Powered by smart edge detection running locally in your browser.
                    </p>
                    <span className="inline-flex items-center font-bold text-rose-600 group-hover:translate-x-2 transition-transform">
                        Remove Background <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                </div>
             </a>

             {/* Tool Card 3 */}
             <a 
                href="/svg-optimizer"
                onClick={(e) => { e.preventDefault(); onNavigate('optimizer'); }}
                className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-purple-100 transition-all cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Layers className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">SVG Suite</h3>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        The ultimate toolkit for vectors. Optimize SVG code, convert bitmaps to vectors (PNG to SVG), or rasterize vectors (SVG to PNG).
                    </p>
                    <span className="inline-flex items-center font-bold text-purple-600 group-hover:translate-x-2 transition-transform">
                        Open SVG Tools <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                </div>
             </a>

             {/* Tool Card 4 */}
             <a 
                href="/pdf-to-docx"
                onClick={(e) => { e.preventDefault(); onNavigate('pdf-docx'); }}
                className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-emerald-100 transition-all cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">Document Converter</h3>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        Securely convert PDF to Word, Images to PDF, and more. Handle sensitive contracts and papers locally.
                    </p>
                    <span className="inline-flex items-center font-bold text-emerald-600 group-hover:translate-x-2 transition-transform">
                        Convert Docs <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                </div>
             </a>
         </div>
      </section>

      {/* Security & Features Banner */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[200%] bg-slate-800/30 rotate-12"></div>
         </div>

         <div className="max-w-6xl mx-auto px-4 relative z-10">
             <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-black mb-6">Why run-time security matters</h2>
                 <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                     Traditional converters upload your files to a cloud server. We don't.
                     Our engine runs entirely in your browser using WebAssembly.
                 </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="flex flex-col items-center text-center">
                     <div className="p-4 bg-slate-800 rounded-2xl mb-6 ring-1 ring-slate-700 shadow-lg shadow-black/20">
                         <ShieldCheck className="w-8 h-8 text-emerald-400" />
                     </div>
                     <h3 className="text-xl font-bold mb-3">100% Private</h3>
                     <p className="text-slate-400 leading-relaxed">
                         Your data never leaves your device. Perfect for sensitive legal documents, personal photos, and proprietary designs.
                     </p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                     <div className="p-4 bg-slate-800 rounded-2xl mb-6 ring-1 ring-slate-700 shadow-lg shadow-black/20">
                         <Zap className="w-8 h-8 text-yellow-400" />
                     </div>
                     <h3 className="text-xl font-bold mb-3">Blazing Fast</h3>
                     <p className="text-slate-400 leading-relaxed">
                         Zero upload time. Zero download time. Conversion happens instantly using your device's processing power.
                     </p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                     <div className="p-4 bg-slate-800 rounded-2xl mb-6 ring-1 ring-slate-700 shadow-lg shadow-black/20">
                         <Cpu className="w-8 h-8 text-purple-400" />
                     </div>
                     <h3 className="text-xl font-bold mb-3">Unlimited & Offline</h3>
                     <p className="text-slate-400 leading-relaxed">
                         Once loaded, the app works offline. No data caps, no server queues, and no "pro tier" for basic speed.
                     </p>
                 </div>
             </div>
         </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="flex-1 space-y-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
                          Use Cases
                      </div>
                      <h2 className="text-4xl font-black text-slate-900">Designed for modern workflow</h2>
                      
                      <div className="space-y-6">
                          <div className="flex gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
                                  <Globe className="w-6 h-6" />
                              </div>
                              <div>
                                  <h4 className="text-lg font-bold text-slate-800">Web Developers</h4>
                                  <p className="text-slate-500 mt-1">
                                      Optimize assets for Core Web Vitals. Convert heavy PNGs to WEBP and minify SVGs for faster load times.
                                  </p>
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
                                  <Eye className="w-6 h-6" />
                              </div>
                              <div>
                                  <h4 className="text-lg font-bold text-slate-800">Designers</h4>
                                  <p className="text-slate-500 mt-1">
                                      Quickly rasterize vectors for previews or vectorise sketches. Clean up exported SVGs from Illustrator/Figma.
                                  </p>
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
                                  <Lock className="w-6 h-6" />
                              </div>
                              <div>
                                  <h4 className="text-lg font-bold text-slate-800">Enterprise</h4>
                                  <p className="text-slate-500 mt-1">
                                      Handle NDAs and internal documents safely without needing complex on-premise software.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 w-full relative">
                       {/* Abstract Interface Preview */}
                       <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                           <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                               <div className="w-12 h-12 rounded-lg bg-slate-100 animate-pulse"></div>
                               <div className="space-y-2">
                                   <div className="w-32 h-4 bg-slate-100 rounded animate-pulse"></div>
                                   <div className="w-20 h-3 bg-slate-50 rounded animate-pulse"></div>
                               </div>
                           </div>
                           <div className="space-y-3">
                               <div className="h-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 font-medium text-sm">
                                   Drag & Drop Interface
                               </div>
                               <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                                   <div className="h-full bg-primary-500 w-3/4"></div>
                               </div>
                               <div className="flex justify-between text-xs text-slate-400 font-bold">
                                   <span>Processing...</span>
                                   <span className="text-primary-600">75%</span>
                               </div>
                           </div>
                           
                           {/* Floating Badge */}
                           <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
                               <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                                   <ShieldCheck className="w-5 h-5" />
                               </div>
                               <div>
                                   <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                                   <p className="text-sm font-bold text-slate-800">Client-Side Secure</p>
                               </div>
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
