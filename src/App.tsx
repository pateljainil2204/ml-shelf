import React, { useState } from 'react';
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
    // Optionally redirect to dashboard after successful auth
    if (currentView === 'home') {
      setCurrentView('dashboard');
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MLShelf...</p>
        </div>
      </div>
    );
  }

  // Show connection message if Supabase is not configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Supabase Connection Required</h2>
            <p className="text-yellow-700 text-sm">
              Please click the "Connect to Supabase" button in the top right to set up your database connection.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onShowAuth={() => setShowAuth(true)}
        onShowDashboard={handleShowDashboard}
        currentView={currentView}
      />

      {currentView === 'home' ? (
        <>
          <Hero 
            onShowAuth={() => setShowAuth(true)}
            onExploreModels={handleExploreModels}
          />
          <div id="models-section">
            <ModelGrid />
          </div>
        </>
      ) : (
        <Dashboard onBack={handleBackToHome} />
      )}

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              MLShelf - Tiny ML Models for Everyone. 
              <span className="ml-2">Built with React, Tailwind CSS, and Supabase.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;