'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { Comment } from '@/lib/data/comments';
import { Card } from './Card';
import { Button } from './Button';

interface PlaybookSectionProps {
  steps: Comment[];
  canAddStep: boolean;
  currentUserId?: string;
  onAddStep?: (content: string) => void;
  onDeleteStep?: (commentId: string) => void;
}

export function PlaybookSection({
  steps,
  canAddStep,
  currentUserId,
  onAddStep,
  onDeleteStep,
}: PlaybookSectionProps) {
  const { t } = useTheme();
  const [newStep, setNewStep] = useState('');

  const handleAdd = () => {
    if (!newStep.trim() || !onAddStep) return;
    onAddStep(newStep.trim());
    setNewStep('');
  };

  return (
    <Card>
      <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
        {t.concepts.playbook}
      </h2>

      {steps.length === 0 ? (
        <p className="text-sm py-2" style={{ color: 'var(--color-text-muted)' }}>
          {t.microcopy.noPlaybook}
        </p>
      ) : (
        <ol className="space-y-2">
          {steps.map((step, idx) => (
            <li key={step.id} className="flex gap-2">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {step.content}
                </p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    by {step.author_name}
                  </span>
                  {currentUserId === step.author_id && onDeleteStep && (
                    <button
                      className="text-[10px]"
                      style={{ color: 'var(--color-error)' }}
                      onClick={() => onDeleteStep(step.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {canAddStep && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg border px-2 py-1 text-sm"
            style={{
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
            placeholder="Add a step..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} disabled={!newStep.trim()}>
            Add
          </Button>
        </div>
      )}
    </Card>
  );
}
