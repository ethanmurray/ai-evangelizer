'use client';

import { useState } from 'react';

const FLAVORS = [
  { id: 'hello-world', label: 'Hello World', desc: 'Plain text, no links or buttons' },
  { id: 'magic-link-no-links', label: 'Magic Link (no links)', desc: 'Looks like the real email but with no clickable links' },
  { id: 'david-to-ethan', label: 'David to Ethan', desc: 'Casual internal email with a plain text link' },
];

export default function TestEmailPage() {
  const [status, setStatus] = useState<Record<string, string>>({});

  const send = async (flavor: string) => {
    setStatus((s) => ({ ...s, [flavor]: 'sending...' }));
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'ethan.murray@oliverwyman.com', flavor }),
      });
      const data = await res.json();
      setStatus((s) => ({ ...s, [flavor]: data.success ? 'Sent!' : `Error: ${data.error}` }));
    } catch (err: any) {
      setStatus((s) => ({ ...s, [flavor]: `Error: ${err.message}` }));
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Email Deliverability Test</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Sending to: <strong>ethan.murray@oliverwyman.com</strong>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FLAVORS.map((f) => (
          <div
            key={f.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{f.label}</strong>
              <div style={{ color: '#888', fontSize: 14 }}>{f.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {status[f.id] && (
                <span style={{ fontSize: 13, color: status[f.id].startsWith('Error') ? 'red' : '#666' }}>
                  {status[f.id]}
                </span>
              )}
              <button
                onClick={() => send(f.id)}
                disabled={status[f.id] === 'sending...'}
                style={{
                  background: '#e76f51',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
