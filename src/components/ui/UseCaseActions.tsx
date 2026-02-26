'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme';
import { deleteUseCase, updateUseCase, type UseCaseWithProgress } from '@/lib/data/use-cases';
import { hasUpvoted } from '@/lib/data/upvotes';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { UpvoteButton } from '@/components/ui/UpvoteButton';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { EditUseCaseModal } from '@/components/ui/EditUseCaseModal';

interface UseCaseActionsProps {
  useCase: UseCaseWithProgress;
  userId: string | undefined;
  useCaseId: string;
  onRefresh: () => void;
}

export function UseCaseActions({
  useCase,
  userId,
  useCaseId,
  onRefresh,
}: UseCaseActionsProps) {
  const { t } = useTheme();
  const router = useRouter();

  const [upvoted, setUpvoted] = useState<boolean | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (userId && useCaseId) {
      hasUpvoted(userId, useCaseId).then(setUpvoted);
    }
  }, [userId, useCaseId]);

  const handleEdit = useCallback(async (updates: { title: string; description: string; resources: string; labels: string[] }) => {
    setIsEditing(true);
    setEditError('');
    setEditSuccess('');
    try {
      await updateUseCase(useCaseId, updates);
      setEditSuccess(t.microcopy.editSuccess);
      setShowEditModal(false);
      onRefresh();
      setTimeout(() => setEditSuccess(''), 3000);
    } catch (err: any) {
      setEditError(err.message || t.microcopy.editError);
    } finally {
      setIsEditing(false);
    }
  }, [useCaseId, t, onRefresh]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteUseCase(useCaseId);
      router.push('/library');
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete');
      setIsDeleting(false);
    }
  }, [useCaseId, router]);

  return (
    <>
      {/* Upvote + edit + delete */}
      <div className="flex items-center gap-4">
        {userId && upvoted !== null && (
          <UpvoteButton
            userId={userId}
            useCaseId={useCaseId}
            initialUpvoted={upvoted}
            initialCount={useCase.upvote_count || 0}
            onToggle={() => onRefresh()}
          />
        )}
        {userId && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              {t.concepts.edit} {t.concepts.useCase}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              style={{ color: 'var(--color-error)' }}
            >
              {t.concepts.delete} {t.concepts.useCase}
            </Button>
          </>
        )}
      </div>

      {editSuccess && (
        <Alert variant="success">{editSuccess}</Alert>
      )}

      {editError && (
        <Alert variant="error">{editError}</Alert>
      )}

      {deleteError && (
        <Alert variant="error">{deleteError}</Alert>
      )}

      <EditUseCaseModal
        isOpen={showEditModal}
        useCase={useCase}
        onSave={handleEdit}
        onCancel={() => setShowEditModal(false)}
        isSaving={isEditing}
        modalTitle={t.microcopy.editTitle}
        titleLabel={t.microcopy.editTitleLabel}
        descriptionLabel={t.microcopy.editDescriptionLabel}
        resourcesLabel={t.microcopy.editResourcesLabel}
        saveButtonText={t.concepts.save}
        cancelButtonText={t.concepts.cancel}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title={useCase.title}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
        confirmTitle={t.microcopy.deleteConfirmTitle}
        confirmBody={t.microcopy.deleteConfirmBody}
        confirmPlaceholder={t.microcopy.deleteConfirmPlaceholder}
        confirmButtonText={t.microcopy.deleteConfirmButton}
      />
    </>
  );
}
