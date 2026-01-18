
import React from 'react';
import { Lock, X, CheckCircle, Zap } from 'lucide-react';

interface LimitModalProps {
  onClose: () => void;
  onSignup: () => void;
  onLogin: () => void;
}

const LimitModal: React.FC<LimitModalProps> = ({ onClose, onSignup, onLogin }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Header Pattern */}
        <div className="h-32 bg-primary-600 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 shadow-lg relative z-10">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="px-8 py-8 text-center">
          <h2 className="text-2xl font-black text-slate-800 mb-2">Free Usage Limit</h2>
          <p className="text-slate-500 mb-6 leading-relaxed text-sm">
             Free users get <span className="font-bold text-slate-800">20 conversion minutes per day</span> for both Web and API use. For most users, a conversion takes less than a minute, allowing up to 20 files per day.
          </p>
          <div className="bg-primary-50 rounded-lg p-3 text-xs text-primary-700 mb-8 border border-primary-100">
             You do not need to create an account to get these benefits on our website.
          </div>

          <div className="space-y-4 mb-8 text-left bg-slate-50 p-5 rounded-xl border border-slate-100">
             <div className="flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-sm font-medium text-slate-700">Up to 20 files/day</span>
             </div>
             <div className="flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-sm font-medium text-slate-700">API Access Available</span>
             </div>
             <div className="flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-sm font-medium text-slate-700">No Watermarks</span>
             </div>
          </div>

          <div className="space-y-3">
            <button 
                onClick={onSignup}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
            >
                Create API Account
            </button>
            <p className="text-xs text-slate-400 font-medium">
                Already have an account? <button onClick={onLogin} className="text-primary-600 hover:text-primary-700 font-bold hover:underline">Log In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitModal;
