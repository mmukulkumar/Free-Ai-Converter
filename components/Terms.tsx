
import React from 'react';
import { ArrowLeft, FileText, Scale } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
}

const Terms: React.FC<TermsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white px-8 py-10 border-b border-slate-200 relative">
            <button 
                onClick={onBack}
                className="flex items-center text-slate-500 hover:text-primary-600 transition-colors mb-6 font-medium"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to App
            </button>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-slate-900 flex items-center gap-3">
                <FileText className="w-10 h-10 text-primary-600" />
                Terms of Service
            </h1>
            <p className="text-slate-500 text-lg">
                Please read these terms carefully before using Free AI Converter.
            </p>
        </div>

        {/* Content */}
        <div className="px-8 py-10 space-y-8 text-slate-700 leading-relaxed">
            
            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using <strong>Free AI Converter</strong> ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by these terms, please do not use this Service.
                </p>
            </section>

            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">2. Description of Service</h2>
                <p>
                    Free AI Converter provides web-based tools for file conversion, compression, and optimization. 
                    The Service is provided "as is" and is accessible via a web browser. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
                </p>
            </section>

            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">3. User Conduct & File Content</h2>
                <p className="mb-2">You agree NOT to use the Service to:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Upload or convert content that is illegal, harmful, threatening, abusive, or defamatory.</li>
                    <li>Infringe upon the intellectual property rights of others.</li>
                    <li>Attempt to reverse engineer the client-side code or exploit the Service.</li>
                </ul>
                <p className="mt-3 text-sm italic">
                    Note: Since files are processed locally on your device, you retain full responsibility for the content you process. We do not monitor or view your files.
                </p>
            </section>

            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">4. Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by law, Free AI Converter shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                    or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                    <li>Your access to or use of or inability to access or use the Service;</li>
                    <li>Any conduct or content of any third party on the Service;</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">5. Intellectual Property</h2>
                <p>
                    The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Free AI Converter and its licensors.
                </p>
            </section>

            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">6. Termination</h2>
                <p>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </section>

            <section className="border-t border-slate-200 pt-6 mt-8">
                <p className="text-sm text-slate-500">
                    Last Updated: {new Date().toLocaleDateString()}
                </p>
            </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
