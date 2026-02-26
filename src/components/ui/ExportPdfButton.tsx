'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ProfilePdfData } from '@/lib/pdf/generateProfilePdf';

type ExportPdfButtonProps = Omit<ProfilePdfData, never>;

export function ExportPdfButton(props: ExportPdfButtonProps) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const { generateProfilePdf } = await import('@/lib/pdf/generateProfilePdf');
      await generateProfilePdf(props);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      isLoading={exporting}
      loadingText="Generating..."
      style={{
        color: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
      }}
    >
      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Export PDF
    </Button>
  );
}
