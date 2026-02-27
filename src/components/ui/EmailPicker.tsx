'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Suggestion {
  email: string;
  name: string;
  isContact: boolean;
}

interface EmailPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  userId?: string;
  required?: boolean;
}

export function EmailPicker({
  value,
  onChange,
  placeholder,
  userId,
  required,
}: EmailPickerProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({ q: query });
        if (userId) params.set('userId', userId);
        const res = await fetch(`/api/users/search?${params}`);
        const data = await res.json();
        setSuggestions(data.users || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setShowDropdown(true);
    if (value.length >= 2) {
      fetchSuggestions(value);
    }
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 200);
  };

  const handleSelect = (email: string) => {
    onChange(email);
    setShowDropdown(false);
    setSuggestions([]);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="email"
        autoComplete="off"
        className="block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
        style={{
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
        }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
      />
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute z-20 w-full mt-1 rounded-lg border shadow-lg max-h-48 overflow-y-auto"
          style={{
            background: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border)',
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s.email}
              type="button"
              className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
              style={{ color: 'var(--color-text)' }}
              onMouseDown={() => handleSelect(s.email)}
            >
              <span className="font-medium">{s.name}</span>
              <span style={{ color: 'var(--color-text-muted)' }}> ({s.email})</span>
              {s.isContact && (
                <span
                  className="ml-2 text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                    opacity: 0.8,
                  }}
                >
                  Contact
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {showDropdown && isLoading && value.length >= 2 && suggestions.length === 0 && (
        <div
          className="absolute z-20 w-full mt-1 rounded-lg border shadow-lg px-3 py-2 text-sm"
          style={{
            background: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          Searching...
        </div>
      )}
    </div>
  );
}
