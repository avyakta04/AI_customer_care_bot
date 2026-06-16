import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Firebase Auth integration point:
    // await createUserWithEmailAndPassword(auth, email, password);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Initialize Core</h2>
        <p className="text-white/50 text-sm">Join the next generation of AI customer intelligence.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-4">
          {/* Name Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-secondary-neon transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Full Name"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-secondary/50 focus:bg-white/[0.05] outline-none transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-secondary-neon transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Operational Email"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-secondary/50 focus:bg-white/[0.05] outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-secondary-neon transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Create Access Key"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-secondary/50 focus:bg-white/[0.05] outline-none transition-all"
            />
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="px-1 space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/40">
                <span>Security Level</span>
                <span className={strength > 75 ? 'text-emerald-400' : strength > 40 ? 'text-amber-400' : 'text-red-400'}>
                  {strength > 75 ? 'Quantum Secure' : strength > 40 ? 'Standard' : 'Weak Point'}
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${strength}%` }}
                   className={`h-full ${strength > 75 ? 'bg-emerald-500' : strength > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 px-1 mt-6">
           <div className="pt-1">
             <input type="checkbox" required className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary-neon focus:ring-primary-neon ring-offset-slate-950" />
           </div>
           <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-wider">
             I authorize the processing of my ECHOMIND profiles and agree to the <span className="text-white/60 font-bold">Protocol Stability Agreement</span>.
           </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-secondary py-4 rounded-xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-secondary/20 hover:bg-secondary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              Sync ECHOMIND Interface 
              <UserPlus className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-white/40 text-xs">
          Already synced?{' '}
          <Link to="/login" className="text-primary-neon font-bold hover:underline underline-offset-4">
            Authorize Existing Session
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
