'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { NavItem } from './NavItem';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { AboutModal } from '@/components/ui/AboutModal';
import { PointsReferenceModal } from '@/components/ui/PointsReferenceModal';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { OnboardingWizard } from '@/components/ui/OnboardingWizard';
import { OnboardingProvider } from '@/lib/onboarding/OnboardingContext';
import { useOnboarding } from '@/hooks/useOnboarding';

const DashboardIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const LibraryIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const LeaderboardIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228M18.75 4.236V2.721M16.27 9.728l-.855.855a7.481 7.481 0 00-6.83 0l-.855-.855m8.54 0a7.531 7.531 0 01-3.27 2.693M7.73 9.728a7.531 7.531 0 003.27 2.693m0 0a7.5 7.5 0 002 0" />
  </svg>
);

const ProfileIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const FeedIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
  </svg>
);

const GettingStartedIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTheme();
  const { user } = useAuth();
  const [showAbout, setShowAbout] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const { showOnboarding, completeOnboarding, replayOnboarding } = useOnboarding(user?.id);

  const navItems = [
    { href: '/dashboard', label: t.concepts.dashboard, icon: <DashboardIcon /> },
    { href: '/library', label: t.concepts.library, icon: <LibraryIcon /> },
    { href: '/feed', label: t.concepts.activityFeed, icon: <FeedIcon /> },
    { href: '/leaderboard', label: t.concepts.leaderboard, icon: <LeaderboardIcon /> },
    { href: '/profile', label: t.concepts.profile, icon: <ProfileIcon /> },
    { href: '/getting-started', label: 'Getting Started', icon: <GettingStartedIcon /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:flex-col md:w-56 md:fixed md:inset-y-0 border-r"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="p-4 border-b flex items-start justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h1 className="text-lg font-bold animate-flicker" style={{ color: 'var(--color-text-heading)' }}>
              {t.appName}
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {t.tagline}
            </p>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start font-semibold about-button-styled"
            onClick={() => setShowPoints(true)}
            style={{
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              borderWidth: '2px',
              backgroundColor: 'rgba(244, 162, 97, 0.1)',
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            Points Guide
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start font-semibold about-button-styled"
            onClick={() => setShowAbout(true)}
            style={{
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              borderWidth: '2px',
              backgroundColor: 'rgba(244, 162, 97, 0.1)',
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            {t.concepts.about}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start font-semibold about-button-styled"
            onClick={replayOnboarding}
            style={{
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              borderWidth: '2px',
              backgroundColor: 'rgba(244, 162, 97, 0.1)',
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
            {t.microcopy.replayTour}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0">
        <OnboardingProvider replayOnboarding={replayOnboarding}>
          {children}
        </OnboardingProvider>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 border-t flex justify-around py-2 z-50"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title={t.microcopy.aboutTitle}
        content={t.microcopy.aboutContent}
      />

      <PointsReferenceModal
        isOpen={showPoints}
        onClose={() => setShowPoints(false)}
      />

      <OnboardingWizard
        isOpen={showOnboarding}
        onComplete={completeOnboarding}
      />
    </div>
  );
}
