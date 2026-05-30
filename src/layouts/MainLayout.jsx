import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NeuralBackground from '../components/NeuralBackground';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (isAuth !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-slate-200 relative overflow-hidden">
      <NeuralBackground />
      <Sidebar />
      <Navbar />
      
      <main className="pl-72 pt-20 min-h-screen relative z-10">
        <div className="p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Futuristic Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>
    </div>
  );
};

export default MainLayout;
