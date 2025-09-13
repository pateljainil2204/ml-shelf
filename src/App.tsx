import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ModelGrid } from './components/ModelGrid';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const { loading, user } = useAuth();

  const handleShowDashboard = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setCurrentView('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleExploreModels = () => {
    const modelsSection = document.querySelector('#models-section');
    if (modelsSection) {
      modelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (currentView === 'home') {
      setCurrentView('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-text-secondary text-lg font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading MLShelf...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Show connection message if Supabase is not configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-warning/20 to-accent/20 backdrop-blur-sm border border-warning/30 rounded-2xl p-8 mb-6 shadow-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h2 
              className="text-xl font-bold text-warning mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Supabase Connection Required
            </motion.h2>
            <motion.p 
              className="text-text-secondary text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Please click the "Connect to Supabase" button in the top right to set up your database connection.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Header 
        onShowAuth={() => setShowAuth(true)}
        onShowDashboard={handleShowDashboard}
        currentView={currentView}
      />

      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero 
              onShowAuth={() => setShowAuth(true)}
              onExploreModels={handleExploreModels}
            />
            <div id="models-section">
              <ModelGrid />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard onBack={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
      />

      {/* Footer */}
      <motion.footer 
        className="bg-background-card/50 backdrop-blur-sm border-t border-border-primary mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-text-muted text-sm leading-relaxed"
              whileHover={{ color: '#e2e8f0' }}
              transition={{ duration: 0.2 }}
            >
              MLShelf - Tiny ML Models for Everyone. 
              <span className="ml-2 text-primary">Built with React, Tailwind CSS, Framer Motion, and Supabase.</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;