'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors md:flex-row md:gap-2 md:text-sm md:px-4"
      style={{
        color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
        background: isActive ? 'rgba(244, 162, 97, 0.1)' : 'transparent',
      }}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
