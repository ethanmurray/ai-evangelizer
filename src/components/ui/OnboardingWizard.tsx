'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme';
import { Button } from './Button';
import { ProgressSteps } from './ProgressSteps';
import { POINTS_CONFIG } from '@/lib/points';

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

function StepWelcome() {
  const { t } = useTheme();
  return (
    <div className="text-center space-y-3">
      <h2
        className="text-2xl font-bold animate-flicker"
        style={{ color: 'var(--color-text-heading)' }}
      >
        {t.microcopy.onboardingWelcomeTitle}
      </h2>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {t.microcopy.onboardingWelcomeBody}
      </p>
    </div>
  );
}

function StepProgression() {
  const { t } = useTheme();
  return (
    <div className="space-y-4">
      <h2
        className="text-xl font-bold text-center"
        style={{ color: 'var(--color-text-heading)' }}
      >
        {t.microcopy.onboardingProgressTitle}
      </h2>
      <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
        {t.microcopy.onboardingProgressBody}
      </p>

      {/* Live demo of progress bars */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: 'var(--color-bg-elevated)' }}
      >
        <div className="space-y-3">
          {[
            { num: 1, label: t.concepts.step1, desc: t.microcopy.onboardingProgressStep1Desc, done: true },
            { num: 2, label: t.concepts.step2, desc: t.microcopy.onboardingProgressStep2Desc, done: false },
            { num: 3, label: t.concepts.step3, desc: t.microcopy.onboardingProgressStep3Desc, done: false },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{
                  background: step.done ? 'var(--color-success)' : 'var(--color-border)',
                  color: step.done ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                {step.done ? '\u2713' : step.num}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  {step.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Compact progress bar demo */}
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
            Your progress will look like this:
          </p>
          <ProgressSteps seenAt="2024-01-01" doneAt={null} shareCount={0} compact />
        </div>
      </div>
    </div>
  );
}

function StepPoints() {
  const { t } = useTheme();
  const pointRows = [
    { label: t.concepts.step1, points: POINTS_CONFIG.learned },
    { label: t.concepts.step2, points: POINTS_CONFIG.applied },
    { label: t.concepts.step3, points: POINTS_CONFIG.shared },
    { label: `Submit a new ${t.concepts.useCase.toLowerCase()}`, points: POINTS_CONFIG.submitted },
  ];

  return (
    <div className="space-y-4">
      <h2
        className="text-xl font-bold text-center"
        style={{ color: 'var(--color-text-heading)' }}
      >
        {t.microcopy.onboardingPointsTitle}
      </h2>
      <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
        {t.microcopy.onboardingPointsBody}
      </p>

      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: 'var(--color-bg-elevated)' }}
      >
        {pointRows.map((row) => (
          <div key={row.label} className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>
              {row.label}
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              +{row.points} {row.points === 1 ? 'pt' : 'pts'}
            </span>
          </div>
        ))}
      </div>

      {t.ranks.length >= 2 && (
        <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
          Start as <strong>{t.ranks[0].name}</strong> and climb to{' '}
          <strong>{t.ranks[t.ranks.length - 1].name}</strong>
        </p>
      )}
    </div>
  );
}

function StepGetStarted({ onComplete }: { onComplete: () => void }) {
  const { t } = useTheme();
  const router = useRouter();

  const handleCta = () => {
    onComplete();
    router.push('/library');
  };

  return (
    <div className="text-center space-y-4">
      <h2
        className="text-xl font-bold"
        style={{ color: 'var(--color-text-heading)' }}
      >
        {t.microcopy.onboardingGetStartedTitle}
      </h2>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {t.microcopy.onboardingGetStartedBody}
      </p>
      <Button variant="primary" size="lg" onClick={handleCta}>
        {t.microcopy.onboardingGetStartedCta}
      </Button>
    </div>
  );
}

export function OnboardingWizard({ isOpen, onComplete }: OnboardingWizardProps) {
  const { t } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onComplete();
    },
    [onComplete]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Reset step when reopened (for replay)
  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onComplete}
    >
      <div
        className="onboarding-panel w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg border p-6 space-y-5"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step indicator dots */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background:
                  i === currentStep ? 'var(--color-primary)' : 'var(--color-border)',
                transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Step content */}
        {currentStep === 0 && <StepWelcome />}
        {currentStep === 1 && <StepProgression />}
        {currentStep === 2 && <StepPoints />}
        {currentStep === 3 && <StepGetStarted onComplete={onComplete} />}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={onComplete}
            className="text-sm underline"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t.microcopy.onboardingSkip}
          </button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                {t.microcopy.onboardingBack}
              </Button>
            )}
            {!isLastStep && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStep((s) => s + 1)}
              >
                {t.microcopy.onboardingNext}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
