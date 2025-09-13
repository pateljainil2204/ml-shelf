import React from 'react';
import { Brain, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
  currentView?: 'home' | 'dashboard';
}

export function Header({ onShowAuth, onShowDashboard, currentView }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">MLShelf</h1>
            <span className="text-sm text-gray-500">Tiny ML Models for Everyone</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {currentView !== 'dashboard' && (
                  <button
                    onClick={onShowDashboard}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                )}
                {currentView !== 'home' && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Explore Models
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onShowAuth}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}