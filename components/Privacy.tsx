
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <button 
                onClick={onBack}
                className="flex items-center text-slate-300 hover:text-white transition-colors mb-6 font-medium"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to App
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
                Privacy Policy
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg">
                Your privacy is our architectural priority. We process files locally on your device.
            </p>
        </div>

        {/* Content */}
        <div className="px-8 py-10 space-y-8 text-slate-700 leading-relaxed">
            
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ServerOff className="w-5 h-5 text-primary-600" />
                    1. Core Privacy Principle: Client-Side Processing
                </h2>
                <p className="mb-4">
                    Unlike traditional online converters, <strong>Free AI Converter</strong> operates almost entirely client-side. 
                    This means your files (images, documents, audio, video) are processed strictly within your web browser's memory using WebAssembly and JavaScript technologies.
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm text-emerald-800 font-medium flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                        We do <strong>not</strong> upload your files to any remote server for processing. 
                        Your sensitive data never leaves your device during the conversion process.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. Data Collection & Usage</h2>
                <p className="mb-2">We practice strict data minimization. We only collect the following:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>
                        <strong>Essential Functional Data:</strong> We use LocalStorage to store your free usage count (e.g., "5 conversions remaining") to manage the free tier limits.
                    </li>
                    <li>
                        <strong>Account Information (If you sign up):</strong> If you choose to create an account, we store your name and email address solely for authentication and account management purposes.
                    </li>
                    <li>
                        <strong>Analytics:</strong> We may use anonymous, aggregated analytics to understand which tools are most popular. No personally identifiable information (PII) is attached to this data.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">3. GDPR Compliance (General Data Protection Regulation)</h2>
                <p className="mb-4">
                    If you are accessing this tool from the European Economic Area (EEA), you have specific rights regarding your personal data:
                </p>
                <ul className="grid gap-4 md:grid-cols-2">
                    <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <strong className="block text-slate-900 mb-1">Right to Access</strong>
                        <span className="text-sm">You have the right to request copies of your personal data (name/email).</span>
                    </li>
                    <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <strong className="block text-slate-900 mb-1">Right to Erasure</strong>
                        <span className="text-sm">You can request that we delete your account and associated data at any time.</span>
                    </li>
                    <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <strong className="block text-slate-900 mb-1">Data Portability</strong>
                        <span className="text-sm">You have the right to request that we transfer your account data to another organization.</span>
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">4. Cookies & Local Storage</h2>
                <p>
                    We use "Local Storage" (a modern alternative to cookies) to maintain your login session and track free usage limits. 
                    These are strictly necessary for the application to function. We do not use third-party tracking cookies for advertising purposes.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">5. Security</h2>
                <p>
                    Because we do not store your converted files, the risk of data breach regarding your documents is virtually eliminated. 
                    Account data is transmitted over secure SSL/TLS encryption.
                </p>
            </section>

            <section className="border-t border-slate-100 pt-6 mt-8">
                <p className="text-sm text-slate-500">
                    Last Updated: {new Date().toLocaleDateString()} <br />
                    Contact: support@freeaiconverter.com
                </p>
            </section>
        </div>
      </div>
    </div>
  );
};

// Helper Icon
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Privacy;
