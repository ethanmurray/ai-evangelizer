'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { fetchUserPointsBreakdown } from '@/lib/data/points';
import { POINTS_CONFIG, formatPoints, type PointsBreakdown } from '@/lib/points';
import { useTheme } from '@/lib/theme';

interface PointsReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PointsReferenceModal({ isOpen, onClose }: PointsReferenceModalProps) {
  const { user } = useAuth();
  const { t } = useTheme();
  const [userPoints, setUserPoints] = useState<PointsBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      setIsLoading(true);
      fetchUserPointsBreakdown(user.id)
        .then(setUserPoints)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-lg p-6"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-heading)' }}>
            Points Guide
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* How to Earn Points */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-heading)' }}>
            How to Earn Points
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded" style={{ background: 'var(--color-bg-surface)' }}>
              <div>
                <div className="font-medium">{t.concepts.step1}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Mark a {t.concepts.useCase.toLowerCase()} as learned
                </div>
              </div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                +{POINTS_CONFIG.learned} point
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded" style={{ background: 'var(--color-bg-surface)' }}>
              <div>
                <div className="font-medium">{t.concepts.step2}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Apply the {t.concepts.useCase.toLowerCase()} in practice
                </div>
              </div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                +{POINTS_CONFIG.applied} points
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded" style={{ background: 'var(--color-bg-surface)' }}>
              <div>
                <div className="font-medium">{t.concepts.step3}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Share with colleagues
                </div>
              </div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                +{POINTS_CONFIG.shared} points
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded" style={{ background: 'var(--color-bg-surface)' }}>
              <div>
                <div className="font-medium">Extra Shares</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Each additional share beyond 2
                </div>
              </div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                +{POINTS_CONFIG.extraShare} point each
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded" style={{ background: 'var(--color-bg-surface)' }}>
              <div>
                <div className="font-medium">Submit a {t.concepts.useCase}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Contribute new content
                </div>
              </div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                +{POINTS_CONFIG.submitted} points
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded" style={{ background: 'var(--color-bg-surface)' }}>
              <div>
                <div className="font-medium">Teach Someone</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  When someone credits you for teaching them
                </div>
              </div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                +{POINTS_CONFIG.teaching} point
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded" style={{ background: 'var(--color-bg-surface)' }}>
              <div>
                <div className="font-medium">Go Viral</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  When {POINTS_CONFIG.viralThreshold}+ people share your submission
                </div>
              </div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                +{POINTS_CONFIG.viralBonus} bonus
              </div>
            </div>
          </div>
        </div>

        {/* User's Points Breakdown */}
        {user && (
          <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-heading)' }}>
              Your Points
            </h3>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
              </div>
            ) : userPoints ? (
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {t.concepts.step1} ({userPoints.details?.learnedCount || 0} {t.concepts.useCasePlural.toLowerCase()})
                  </span>
                  <span className="font-medium">{userPoints.learned}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {t.concepts.step2} ({userPoints.details?.appliedCount || 0} {t.concepts.useCasePlural.toLowerCase()})
                  </span>
                  <span className="font-medium">{userPoints.applied}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {t.concepts.step3} ({userPoints.details?.sharedCount || 0} {t.concepts.useCasePlural.toLowerCase()})
                  </span>
                  <span className="font-medium">{userPoints.shared}</span>
                </div>
                {userPoints.submitted > 0 && (
                  <div className="flex justify-between py-1">
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Submitted ({userPoints.details?.submittedCount || 0} {t.concepts.useCasePlural.toLowerCase()})
                    </span>
                    <span className="font-medium">{userPoints.submitted}</span>
                  </div>
                )}
                {(userPoints.teaching || 0) > 0 && (
                  <div className="flex justify-between py-1">
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Teaching ({userPoints.details?.teachingCount || 0} credits)
                    </span>
                    <span className="font-medium">{userPoints.teaching}</span>
                  </div>
                )}
                {userPoints.bonuses > 0 && (
                  <div className="flex justify-between py-1">
                    <span style={{ color: 'var(--color-text-muted)' }}>Viral bonuses</span>
                    <span className="font-medium">{userPoints.bonuses}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 mt-2 border-t font-bold text-lg" style={{ borderColor: 'var(--color-border)' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatPoints(userPoints.total)}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>Start earning points by learning {t.concepts.useCasePlural.toLowerCase()}!</p>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}