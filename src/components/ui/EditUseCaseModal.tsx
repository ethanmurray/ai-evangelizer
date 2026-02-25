'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { LabelSelector } from './LabelSelector';

interface EditUseCaseModalProps {
  isOpen: boolean;
  useCase: {
    id: string;
    title: string;
    description: string;
    resources: string | null;
    labels: string[];
  };
  onSave: (updates: { title: string; description: string; resources: string; labels: string[] }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  modalTitle: string;
  titleLabel: string;
  descriptionLabel: string;
  resourcesLabel: string;
  saveButtonText: string;
  cancelButtonText: string;
}

export function EditUseCaseModal({
  isOpen,
  useCase,
  onSave,
  onCancel,
  isSaving,
  modalTitle,
  titleLabel,
  descriptionLabel,
  resourcesLabel,
  saveButtonText,
  cancelButtonText,
}: EditUseCaseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resources, setResources] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && useCase) {
      setTitle(useCase.title);
      setDescription(useCase.description);
      setResources(useCase.resources || '');
      setLabels(useCase.labels || []);
    }
  }, [isOpen, useCase]);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      await onSave({ title: title.trim(), description: description.trim(), resources: resources.trim(), labels });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-lg border p-6 space-y-4"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
          {modalTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {titleLabel}
            </label>
            <Input
              ref={titleInputRef}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {descriptionLabel}
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              required
              disabled={isSaving}
              rows={4}
            />
          </div>

          <div>
            <label
              htmlFor="resources"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {resourcesLabel} (optional)
            </label>
            <Textarea
              id="resources"
              value={resources}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResources(e.target.value)}
              disabled={isSaving}
              rows={3}
            />
          </div>

          <LabelSelector
            selectedLabels={labels}
            onChange={setLabels}
            disabled={isSaving}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
            >
              {cancelButtonText}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!title.trim() || !description.trim() || isSaving}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              {saveButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}