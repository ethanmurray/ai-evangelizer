'use client';

import React, { createContext, useContext } from 'react';

interface OnboardingContextType {
  replayOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  replayOnboarding: () => {},
});

export function OnboardingProvider({
  replayOnboarding,
  children,
}: {
  replayOnboarding: () => void;
  children: React.ReactNode;
}) {
  return (
    <OnboardingContext.Provider value={{ replayOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingActions() {
  return useContext(OnboardingContext);
}
