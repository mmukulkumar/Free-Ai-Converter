import React, { useState } from 'react';
import { ArrowLeft, Rocket, CheckCircle, Send, Globe, Smartphone, Mail, User, DollarSign } from 'lucide-react';

interface PromoteAppProps {
  onBack: () => void;
}

const PromoteApp: React.FC<PromoteAppProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    appName: '',
    appUrl: '',
    category: 'productivity',
    contactName: '',
    email: '',
    budget: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Application Received!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thanks for submitting <strong>{formData.appName}</strong>. Our team will review your application and get back to you at <strong>{formData.email}</strong> within 24-48 hours.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-primary-600 transition-colors mb-8 font-medium group"
        >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to App
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 px-8 py-12 text-white relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute top-[-50%] right-[-20%] w-[80%] h-[200%] bg-primary-600/20 rotate-12 blur-3xl"></div>
                  <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
                    <Rocket className="w-8 h-8 text-primary-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                    Promote Your App
                </h1>
                <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
                    Reach thousands of users daily. Submit your tool to be featured on our platform and grow your audience.
                </p>
              </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: App Details */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary-600" />
                        App Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">App Name</label>
                            <input 
                                type="text" 
                                name="appName"
                                required
                                value={formData.appName}
                                onChange={handleChange}
                                placeholder="e.g. Super Converter"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            >
                                <option value="productivity">Productivity</option>
                                <option value="design">Design & Graphics</option>
                                <option value="developer">Developer Tools</option>
                                <option value="utilities">Utilities</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">App URL / Store Link</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="url" 
                                name="appUrl"
                                required
                                value={formData.appUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Short Description</label>
                        <textarea 
                            name="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your app's main features and value proposition..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Section 2: Contact Info */}
                <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-600" />
                        Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Name</label>
                            <input 
                                type="text" 
                                name="contactName"
                                required
                                value={formData.contactName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Budget (Optional)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select 
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none"
                            >
                                <option value="">Select a budget range...</option>
                                <option value="under_500">Under $500</option>
                                <option value="500_2000">$500 - $2,000</option>
                                <option value="2000_5000">$2,000 - $5,000</option>
                                <option value="5000_plus">$5,000+</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary-500/30 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            'Submitting...'
                        ) : (
                            <>
                                Submit Application <Send className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteApp;