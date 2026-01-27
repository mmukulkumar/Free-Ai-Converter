
import React from 'react';
import { ToolType } from '../types';
import { ShieldCheck, Zap, UserX, Lock, Globe, Settings, MousePointerClick, Download, FileUp, Sparkles } from 'lucide-react';
import SocialShareButtons from './SocialShareButtons';

interface InfoSectionProps {
    tool: ToolType;
    onNavigatePrivacy: () => void;
    onNavigateTerms: () => void;
}

// Helper to get tool display name
const getToolDisplayName = (tool: ToolType): string => {
    switch (tool) {
        case 'image-compressor': return 'Image Compressor';
        case 'bg-remover': return 'Background Remover';
        case 'optimizer': return 'SVG Optimizer';
        default:
            const parts = tool.split('-');
            if (parts.length === 2) {
                return `${parts[0].toUpperCase()} to ${parts[1].toUpperCase()} Converter`;
            }
            return 'File Converter';
    }
};

// Helper to get tool description
const getToolDescription = (tool: ToolType): string => {
    switch (tool) {
        case 'image-compressor': return 'Free image compression tool - reduce file size up to 90% without quality loss';
        case 'bg-remover': return 'AI-powered background remover - instant results, 100% private';
        case 'optimizer': return 'SVG optimizer - clean code and smaller file sizes';
        default:
            const parts = tool.split('-');
            if (parts.length === 2) {
                return `Convert ${parts[0].toUpperCase()} to ${parts[1].toUpperCase()} for free - secure client-side conversion`;
            }
            return 'Free online file converter with 100% privacy';
    }
};

const InfoSection: React.FC<InfoSectionProps> = ({ tool, onNavigatePrivacy, onNavigateTerms }) => {
    const content = getContentForTool(tool);
    const toolName = getToolDisplayName(tool);
    const toolDescription = getToolDescription(tool);

    return (
        <div className="mt-20 max-w-5xl mx-auto px-4 text-slate-700 animate-fade-in-up delay-200">

            {/* Share Section */}
            <div className="mb-12 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Love this tool?</h3>
                    <p className="text-sm text-slate-500">Share it with your friends and colleagues!</p>
                </div>
                <SocialShareButtons toolName={toolName} toolDescription={toolDescription} />
            </div>

            {/* Main SEO Content */}
            <div className="prose prose-slate max-w-none">
                {content}
            </div>

            {/* Trust Signals / Key Benefits */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200">
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">Maximum Security</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Your files are processed locally within your browser. We never upload your sensitive data to any server, ensuring 100% privacy.
                    </p>
                </div>

                <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-4">
                        <UserX className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">No Signup Required</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Start converting immediately. No registration, no email required, and no hidden subscriptions. Just free, instant access.
                    </p>
                </div>

                <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full mb-4">
                        <Zap className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">Free AI Converter</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Powered by advanced logic to deliver the best quality-to-size ratio. Enjoy unlimited potential with our robust web tools.
                    </p>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-16 border-t border-slate-200 pt-8 pb-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        <p>&copy; {new Date().getFullYear()} Free AI Converter. Secure Client-Side Processing.</p>
                    </div>
                    <div className="flex items-center gap-6 font-medium">
                        <button
                            onClick={onNavigatePrivacy}
                            className="hover:text-primary-600 transition-colors"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={onNavigateTerms}
                            className="hover:text-primary-600 transition-colors"
                        >
                            Terms & Conditions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;


const getContentForTool = (tool: ToolType) => {
    const wrapperClass = "space-y-6 text-base md:text-lg leading-relaxed text-slate-600";
    const h2Class = "text-3xl md:text-4xl font-extrabold mb-8 text-slate-800 tracking-tight text-center md:text-left";
    const h3Class = "text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2";
    const stepListClass = "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6";
    const stepItemClass = "bg-slate-50 border border-slate-100 p-4 rounded-xl flex gap-3 items-start";
    const stepNumClass = "flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold mt-0.5";

    // Helper for generic tools
    const getGenericContent = () => {
        const parts = tool.split('-');
        if (parts.length === 2) {
            const from = parts[0].toUpperCase();
            const to = parts[1].toUpperCase();
            return (
                <>
                    <h2 className={h2Class}>Convert {from} to {to} - Free AI Converter</h2>
                    <div className={wrapperClass}>
                        <p>
                            Experience the fastest way to convert <strong>{from} files to {to} format</strong> with our <strong>Free AI Converter</strong>.
                            Designed for efficiency and privacy, this tool operates entirely in your browser, ensuring maximum security for your media and documents.
                        </p>

                        <h3 className={h3Class}><MousePointerClick className="w-5 h-5 text-blue-500" /> How to convert {from} to {to}?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Upload File</strong>
                                    <span className="text-sm text-slate-500">Drag and drop your {from} file or click the upload button.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Auto-Process</strong>
                                    <span className="text-sm text-slate-500">The tool automatically converts it to {to} instantly.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download</strong>
                                    <span className="text-sm text-slate-500">Click the download button to save your new {to} file.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}><Zap className="w-5 h-5 text-primary-600" /> Key Features</h3>
                        <ul className="list-disc pl-5 space-y-2 marker:text-primary-500">
                            <li><strong>Maximum Security:</strong> Unlike other online converters, we do not upload your {from} files to the cloud. Everything happens on your device.</li>
                            <li><strong>No Signup Required:</strong> You don't need to create an account or provide an email address. It's completely free and anonymous.</li>
                            <li><strong>High Quality Output:</strong> Our smart conversion engine ensures your {to} files retain the best possible quality.</li>
                        </ul>
                    </div>
                </>
            );
        }
        return null;
    };

    switch (tool) {
        case 'bg-remover':
            return (
                <>
                    <h2 className={h2Class}>Free AI Background Remover - Instant & Secure</h2>
                    <div className={wrapperClass}>
                        <p className="text-lg">
                            Remove backgrounds from images instantly with our <strong>AI-powered removal tool</strong>.
                            Perfect for e-commerce product photos, logos, and profile pictures.
                            The AI automatically detects the subject and creates a transparent PNG in seconds.
                        </p>

                        <h3 className={h3Class}><Sparkles className="w-5 h-5 text-purple-600" /> How to remove backgrounds?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Upload Image</strong>
                                    <span className="text-sm text-slate-500">Select any JPG, PNG, or WEBP image.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">AI Processing</strong>
                                    <span className="text-sm text-slate-500">Our advanced AI model analyzes the image and segments the subject locally in your browser.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download PNG</strong>
                                    <span className="text-sm text-slate-500">Get your clean, transparent image instantly.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}><Lock className="w-5 h-5 text-green-600" /> 100% Client-Side Privacy</h3>
                        <p>
                            Unlike other background removal services that require you to upload your personal photos to their servers, our tool runs <strong>entirely on your device</strong> using WebAssembly. Your photos never leave your computer.
                        </p>
                    </div>
                </>
            );

        case 'image-compressor':
            return (
                <>
                    <h2 className={h2Class}>Free AI Image Compressor - Reduce File Size Securely</h2>
                    <div className={wrapperClass}>
                        <p className="text-lg">
                            Optimize your digital assets with the ultimate <strong>Free AI Converter</strong> for images.
                            Reduce file sizes of JPG, PNG, WEBP, BMP, and GIF images by up to 90% without visible quality loss.
                            Best of all, it works locally on your device for <strong>maximum security</strong>.
                        </p>

                        <h3 className={h3Class}><Settings className="w-5 h-5 text-slate-700" /> How to use the Image Compressor</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Select Images</strong>
                                    <span className="text-sm text-slate-500">Upload JPG, PNG, WEBP, BMP, or GIF images.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Adjust Settings</strong>
                                    <span className="text-sm text-slate-500">Use the sliders to adjust Quality, Size, or Grayscale mode.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Compress</strong>
                                    <span className="text-sm text-slate-500">Click the button to process. The AI will optimize the files locally.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>4</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Save Files</strong>
                                    <span className="text-sm text-slate-500">Download individually.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}><Lock className="w-5 h-5 text-green-600" /> Secure & Private Compression</h3>
                        <p>
                            Privacy is our priority. Most online compressors upload your photos to their servers, creating a privacy risk.
                            Our tool is different—it runs the compression algorithm directly in your web browser.
                            Your personal photos, documents, and designs never leave your computer.
                        </p>
                    </div>
                </>
            );

        case 'png-webp':
            return (
                <>
                    <h2 className={h2Class}>Convert PNG to WEBP - Next-Gen Compression</h2>
                    <div className={wrapperClass}>
                        <p>
                            Transform your PNG images into the modern <strong>WEBP format</strong>.
                            WEBP offers superior compression compared to PNG while maintaining transparency and high quality, making your websites load faster.
                        </p>

                        <h3 className={h3Class}>How to convert PNG to WEBP?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Upload PNG</strong>
                                    <span className="text-sm text-slate-500">Drag and drop your .png files into the tool.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Set Quality</strong>
                                    <span className="text-sm text-slate-500">Optionally adjust quality settings (default is High).</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Convert</strong>
                                    <span className="text-sm text-slate-500">The browser converts the image to WEBP instantly.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>4</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download</strong>
                                    <span className="text-sm text-slate-500">Save the new, lighter .webp file.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}><Zap className="w-5 h-5 text-primary-600" /> Why convert to WEBP?</h3>
                        <p>
                            Google's WEBP format is typically 26% smaller than PNGs.
                            By converting, you save bandwidth and improve SEO scores without losing transparency or visual clarity.
                        </p>
                    </div>
                </>
            );

        case 'png-bmp':
            return (
                <>
                    <h2 className={h2Class}>Convert PNG to BMP - Lossless Bitmap Conversion</h2>
                    <div className={wrapperClass}>
                        <p>
                            Need a raw bitmap file? Convert your <strong>PNG images to BMP</strong> format instantly.
                            BMP files are uncompressed raster images, perfect for legacy software or specific printing requirements that need exact pixel data without compression artifacts.
                        </p>

                        <h3 className={h3Class}>How to convert PNG to BMP?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Upload PNG</strong>
                                    <span className="text-sm text-slate-500">Select your .png file from your device.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Processing</strong>
                                    <span className="text-sm text-slate-500">We decode the PNG and save it as a Bitmap (BMP).</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download</strong>
                                    <span className="text-sm text-slate-500">Get your .bmp file immediately.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}>Secure & Private</h3>
                        <p>
                            Conversion happens entirely in your browser. Your images are never uploaded to a server, ensuring 100% privacy for your files.
                        </p>
                    </div>
                </>
            );

        case 'webp-bmp':
            return (
                <>
                    <h2 className={h2Class}>Convert WEBP to BMP - Free Online Tool</h2>
                    <div className={wrapperClass}>
                        <p>
                            Convert your <strong>WEBP images to BMP</strong> (Bitmap) format instantly.
                            While WEBP is efficient for the web, BMP is widely compatible with legacy Windows software and simple image editors.
                        </p>

                        <h3 className={h3Class}>How to convert WEBP to BMP?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Upload WEBP</strong>
                                    <span className="text-sm text-slate-500">Drag and drop your .webp file here.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Processing</strong>
                                    <span className="text-sm text-slate-500">Our tool decodes the WEBP and re-encodes it as a Bitmap.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download BMP</strong>
                                    <span className="text-sm text-slate-500">Save your new .bmp file to your computer.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}>Why conversion matters?</h3>
                        <p>
                            Bitmap files are uncompressed and pixel-perfect, making them ideal for simple editing tasks where compression artifacts must be avoided, or for use in older systems that don't support modern web formats.
                        </p>
                    </div>
                </>
            );

        case 'svg-png':
            return (
                <>
                    <h2 className={h2Class}>Convert SVG to PNG - Secure High-Resolution Tool</h2>
                    <div className={wrapperClass}>
                        <p>
                            Need to turn vector graphics into raster images? Our <strong>Free AI Converter</strong> effortlessly transforms SVG files into transparent PNGs.
                            Perfect for social media, email signatures, and platforms that don't support vector files.
                        </p>

                        <h3 className={h3Class}>How to convert SVG to PNG</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Upload SVG</strong>
                                    <span className="text-sm text-slate-500">Drag your .svg file into the drop zone.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Configure Output</strong>
                                    <span className="text-sm text-slate-500">Optionally adjust scaling (e.g. 2x, 4x) for higher resolution.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download PNG</strong>
                                    <span className="text-sm text-slate-500">Save your high-quality transparent PNG instantly.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}>Maximum Security Guarantee</h3>
                        <p>
                            We prioritize your data security. This tool renders your SVG code into an image directly in your browser's memory.
                            <strong>No signup required</strong> and no server uploads mean your proprietary designs remain confidential.
                        </p>
                    </div>
                </>
            );

        case 'png-svg':
            return (
                <>
                    <h2 className={h2Class}>Free PNG to SVG Converter - Vectorize Images Locally</h2>
                    <div className={wrapperClass}>
                        <p>
                            Convert raster images to scalable vectors with our <strong>Free AI Converter</strong>.
                            Turn pixel-based PNGs into clean SVG paths for infinite scalability.
                            This tool is completely free and requires <strong>no signup</strong>.
                        </p>

                        <h3 className={h3Class}>How to vectorize an image?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Select Raster Image</strong>
                                    <span className="text-sm text-slate-500">Upload a black and white or simple logo (PNG/JPG).</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Processing</strong>
                                    <span className="text-sm text-slate-500">The tool traces edges and creates vector paths automatically.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download Vector</strong>
                                    <span className="text-sm text-slate-500">Download your new scalable SVG file.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}>How it works securely</h3>
                        <p>
                            Unlike standard converters that process files on remote servers, our proprietary client-side engine traces your image directly on your device.
                            This provides <strong>maximum security</strong> for your logos and illustrations.
                        </p>
                    </div>
                </>
            );

        case 'optimizer':
            return (
                <>
                    <h2 className={h2Class}>Free SVG Optimizer - Clean Code, Smaller Size</h2>
                    <div className={wrapperClass}>
                        <p>
                            Reduce the size of your vector files by removing unnecessary metadata, comments, and redundant code.
                            Our <strong>Free AI Converter</strong> optimizes your SVGs for faster web loading speeds.
                        </p>

                        <h3 className={h3Class}>How to optimize SVG files?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Add SVGs</strong>
                                    <span className="text-sm text-slate-500">Upload one or multiple SVG files.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Select Level</strong>
                                    <span className="text-sm text-slate-500">Choose Low, Medium, or High optimization in settings.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Refine</strong>
                                    <span className="text-sm text-slate-500">Toggle "Remove Comments" or "Precision" for specific needs.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>4</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Get File</strong>
                                    <span className="text-sm text-slate-500">Download the minified file with reduced file size.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}>Secure Optimization</h3>
                        <p>
                            Your code is your intellectual property. Our optimizer parses and minifies SVG XML directly in your browser.
                            With <strong>maximum security</strong> and <strong>no signup required</strong>, it's the safest way to streamline your graphics workflow.
                        </p>
                    </div>
                </>
            );

        case 'jpg-pdf':
        case 'png-pdf':
            return (
                <>
                    <h2 className={h2Class}>Convert Images to PDF - Free & Private</h2>
                    <div className={wrapperClass}>
                        <p>
                            Combine your photos into a professional document with our <strong>Free AI Converter</strong>.
                            Convert JPG, PNG, or HEIC images into a single, shareable PDF file in seconds.
                        </p>

                        <h3 className={h3Class}>Instructions</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Select Photos</strong>
                                    <span className="text-sm text-slate-500">Upload the images you want to include in the PDF.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Page Settings</strong>
                                    <span className="text-sm text-slate-500">Set page size (A4, Letter) and orientation in settings.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Convert</strong>
                                    <span className="text-sm text-slate-500">Click convert to generate the document.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>4</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Download PDF</strong>
                                    <span className="text-sm text-slate-500">Save the final PDF document to your device.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}>No Signup, Total Privacy</h3>
                        <p>
                            Generating PDFs often involves sensitive documents like contracts or ID cards.
                            Our tool offers <strong>maximum security</strong> by generating the PDF file locally on your computer using advanced browser technologies.
                            Your documents never touch a cloud server.
                        </p>
                    </div>
                </>
            );

        default:
            const generic = getGenericContent();
            if (generic) return generic;

            return (
                <>
                    <h2 className={h2Class}>Free AI File Converter - Secure & Unlimited</h2>
                    <div className={wrapperClass}>
                        <p>
                            Welcome to the most secure <strong>Free AI Converter</strong> on the web.
                            Whether you are compressing images, converting documents, or optimizing code, our tools are designed to work
                            completely offline in your browser after the initial load.
                        </p>

                        <h3 className={h3Class}>How to use this tool?</h3>
                        <div className={stepListClass}>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>1</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Upload</strong>
                                    <span className="text-sm text-slate-500">Select the files you wish to process.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>2</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Configure</strong>
                                    <span className="text-sm text-slate-500">Open settings to adjust specific parameters if needed.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>3</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Convert</strong>
                                    <span className="text-sm text-slate-500">The tool processes files instantly in your browser.</span>
                                </div>
                            </div>
                            <div className={stepItemClass}>
                                <div className={stepNumClass}>4</div>
                                <div>
                                    <strong className="block text-slate-800 text-sm mb-1">Save</strong>
                                    <span className="text-sm text-slate-500">Download your processed files immediately.</span>
                                </div>
                            </div>
                        </div>

                        <h3 className={h3Class}>Why choose us?</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Maximum Security:</strong> Zero server uploads. Your files stay yours.</li>
                            <li><strong>No Signup Required:</strong> No barriers to entry. Just secure, fast conversions.</li>
                            <li><strong>Universal Compatibility:</strong> Works on all modern devices and browsers.</li>
                        </ul>
                    </div>
                </>
            );
    }
};
