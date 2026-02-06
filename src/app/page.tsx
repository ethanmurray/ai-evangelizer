'use client';

import { useState } from 'react';
import { useUser, useAuthContext } from '@/lib/auth';
import { AuthForm, UserProfile } from '@/components/auth';
import { Button } from '@/components/ui';

interface WelcomeScreenProps {
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
}

function WelcomeScreen({ showAuth, setShowAuth }: WelcomeScreenProps) {
  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <AuthForm onSuccess={() => {}} />

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowAuth(false)}
              className="text-sm"
            >
              ← Back to Welcome
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="text-center space-y-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            AI Evangelizer Leaderboard
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track badges, climb the ranks, and celebrate achievements in AI evangelism
          </p>

          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Join our community of AI advocates and see how you stack up against your peers
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => setShowAuth(true)}
            className="text-lg px-8 py-4"
          >
            Get Started - It's Free! 🚀
          </Button>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            No passwords required • Just your name and email
          </p>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
              Leaderboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              See where you rank among AI evangelizers and track your progress over time
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎖️</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
              Achievement Badges
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Earn badges for various activities like presentations, mentoring, and innovation
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
              Impact Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Track your influence and see the real impact of your AI evangelism efforts
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Trusted by AI advocates at
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500 space-x-4">
            <span>🏢 Enterprise Teams</span>
            <span>•</span>
            <span>🎓 Academic Institutions</span>
            <span>•</span>
            <span>🚀 Startups</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const { user, fullName } = useUser();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              AI Evangelizer Leaderboard
            </h1>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.firstName}! 👋
              </span>
              <UserProfile onLogout={() => {}} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            <UserProfile showFullProfile className="sticky top-8" />
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Welcome to your dashboard, {fullName}! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You're now part of the AI Evangelizer community. Here's what you can do:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🏆 Check Your Rank
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    See where you stand on the leaderboard
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                    🎖️ Earn Badges
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Complete activities to unlock achievements
                  </p>
                </div>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                🏆 Leaderboard
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Leaderboard feature coming soon!</p>
                <p className="text-sm mt-2">We're working on bringing you comprehensive rankings.</p>
              </div>
            </div>

            {/* Badges Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                🎖️ Your Badges
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No badges earned yet</p>
                <p className="text-sm mt-2">Start evangelizing AI to earn your first badge!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [showAuth, setShowAuth] = useState(false);

  // Only show global loading state on initial page load, not during auth operations
  // When showAuth is true, AuthForm handles its own loading states
  if (isLoading && !showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <WelcomeScreen showAuth={showAuth} setShowAuth={setShowAuth} />;
}
