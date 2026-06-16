import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Firebase Auth integration point:
    // await sendPasswordResetEmail(auth, email);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Access Recovery</h2>
        <p className="text-white/50 text-sm">Initiate secure bypass for lost credentials.</p>
      </div>

      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.div
            key="request"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <form onSubmit={handleReset} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent-neon transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Linked Operational Email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-accent/50 focus:bg-white/[0.05] outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                 <ShieldAlert className="w-5 h-5 text-accent-neon flex-shrink-0" />
                 <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-wider">
                   A temporal access link will be dispatched to your encrypted mailbox for secure verification.
                 </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-neon py-4 rounded-xl text-slate-950 font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-accent-neon/20 hover:bg-accent-neon/90 hover:shadow-accent-neon/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full"
                  />
                ) : (
                  <>
                    Request Recovery Sync 
                    <RefreshCw className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-20 h-20 bg-accent-neon/10 border border-accent-neon/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", damping: 10, stiffness: 100 }}
               >
                 <CheckCircle className="w-10 h-10 text-accent-neon" />
               </motion.div>
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-accent-neon/20 rounded-full"
               />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Recovery Sync Optimized</h3>
            <p className="text-white/50 text-sm mb-10 px-4">
              A secure verification link has been dispatched to <span className="text-white font-bold">{email}</span>. Please verify within 15 minutes.
            </p>
            <button
               onClick={() => setIsSent(false)}
               className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors"
            >
              Didn't receive link? Redispatch
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 text-center border-t border-white/5 pt-8">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-white/40 text-xs hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Abort Recovery & Return to Authorization
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
