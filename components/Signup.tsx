
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Zap, ArrowLeft, CheckCircle } from 'lucide-react';

interface SignupProps {
  onSignup: (name: string, email: string) => void;
  onNavigateLogin: () => void;
  onBack: () => void;
  onNavigateTerms: () => void;
  onNavigatePrivacy: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onNavigateLogin, onBack, onNavigateTerms, onNavigatePrivacy }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSignup(name, email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
       {/* Decorative Background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-100 blur-[120px] opacity-40"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-100 blur-[120px] opacity-40"></div>
        </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <button onClick={onBack} className="absolute -left-16 top-0 hidden sm:flex items-center text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>

        <div className="flex justify-center">
             <div className="p-3 bg-primary-600 rounded-xl shadow-lg shadow-primary-500/30">
               <Zap className="w-8 h-8 text-white" fill="currentColor" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <button onClick={onNavigateLogin} className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 transition-shadow"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 transition-shadow"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 transition-shadow"
                  placeholder="Min 8 characters"
                />
              </div>
            </div>

            <div className="flex items-start">
               <div className="flex items-center h-5">
                 <input
                   id="terms"
                   name="terms"
                   type="checkbox"
                   required
                   className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                 />
               </div>
               <div className="ml-3 text-sm">
                 <label htmlFor="terms" className="font-medium text-slate-700">
                   I agree to the <button type="button" onClick={onNavigateTerms} className="text-primary-600 hover:text-primary-500 underline">Terms</button> and <button type="button" onClick={onNavigatePrivacy} className="text-primary-600 hover:text-primary-500 underline">Privacy Policy</button>
                 </label>
               </div>
             </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
            
          <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex">
                      <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                          <h3 className="text-sm font-medium text-slate-800">Free Account Benefits</h3>
                          <div className="mt-2 text-sm text-slate-500">
                              <ul className="list-disc pl-5 space-y-1">
                                  <li>Unlimited file conversions</li>
                                  <li>Priority processing speed</li>
                                  <li>Batch processing up to 50 files</li>
                                  <li>No ads</li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
