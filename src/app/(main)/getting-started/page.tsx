'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

const CodeBlock = ({ children }: { children: string }) => (
  <pre
    className="rounded-lg p-3 mt-2 mb-1 text-sm overflow-x-auto"
    style={{
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text)',
    }}
  >
    <code>{children}</code>
  </pre>
);

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code
    className="rounded px-1.5 py-0.5 text-sm"
    style={{
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
    }}
  >
    {children}
  </code>
);

const MAILTO_LINK =
  'mailto:david.friedman@oliverwyman.com,ethan.murray@oliverwyman.com?subject=AI%20Evangelizer%20%E2%80%94%20Repo%20Access%20Request';

export default function GettingStartedPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Getting Started</h1>
        <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
          A step-by-step guide to making your first pull request to this repo using Claude Code.
        </p>
      </div>

      {/* Step 1: Prerequisites */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          1. Prerequisites
        </h2>
        <p className="text-sm mb-2">Make sure you have the following installed:</p>
        <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
          <li><strong style={{ color: 'var(--color-text)' }}>Node.js</strong> (v18 or later) &mdash; <InlineCode>node --version</InlineCode></li>
          <li><strong style={{ color: 'var(--color-text)' }}>Git</strong> &mdash; <InlineCode>git --version</InlineCode></li>
          <li><strong style={{ color: 'var(--color-text)' }}>A GitHub account</strong> &mdash; free at github.com</li>
        </ul>
      </Card>

      {/* Step 2: Get repo access */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          2. Get Repo Access
        </h2>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
          The repository is private. To get collaborator access, email us your GitHub username:
        </p>
        <a
          href={MAILTO_LINK}
          className="inline-block rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-bg)',
          }}
        >
          Email David &amp; Ethan for Access
        </a>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          david.friedman@oliverwyman.com &middot; ethan.murray@oliverwyman.com
        </p>
      </Card>

      {/* Step 3: Set up GitHub CLI */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          3. Set Up the GitHub CLI
        </h2>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
          The GitHub CLI (<InlineCode>gh</InlineCode>) lets you push code and create PRs from the terminal.
        </p>
        <p className="text-sm font-semibold mt-3">Install it:</p>
        <CodeBlock>brew install gh</CodeBlock>
        <p className="text-sm font-semibold mt-3">Log in with your GitHub account:</p>
        <CodeBlock>gh auth login</CodeBlock>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Choose <strong>GitHub.com</strong> &rarr; <strong>HTTPS</strong> &rarr; <strong>Paste an authentication token</strong>.
          You can generate a personal access token at GitHub &rarr; Settings &rarr; Developer settings &rarr; Personal access tokens &rarr; Tokens (classic).
          Make sure to select the <InlineCode>repo</InlineCode> scope.
        </p>
        <p className="text-sm font-semibold mt-3">Then configure Git to use it:</p>
        <CodeBlock>gh auth setup-git</CodeBlock>
      </Card>

      {/* Step 4: Clone the repo */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          4. Clone the Repo
        </h2>
        <CodeBlock>{`git clone https://github.com/ethanmurray/ai-evangelizer.git
cd ai-evangelizer
npm install`}</CodeBlock>
      </Card>

      {/* Step 5: Install Claude Code */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          5. Install Claude Code
        </h2>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Claude Code is Anthropic&apos;s CLI that lets you describe changes in plain English and have Claude implement them for you.
        </p>
        <CodeBlock>npm install -g @anthropic-ai/claude-code</CodeBlock>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Then start it from the project directory:
        </p>
        <CodeBlock>{`cd ai-evangelizer
claude`}</CodeBlock>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          It will walk you through authentication with your Anthropic API key on first run.
        </p>
      </Card>

      {/* Step 6: Run locally */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          6. Run the App Locally
        </h2>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
          The repo includes a pre-configured <InlineCode>.env.example</InlineCode> &mdash; no extra setup needed.
        </p>
        <CodeBlock>{`cp .env.example .env.local
npm run dev`}</CodeBlock>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Open <strong>http://localhost:3000</strong> in your browser. The app will hot-reload as you make changes.
        </p>
      </Card>

      {/* Step 7: Make your first PR */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          7. Make Your First PR with Claude Code
        </h2>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
          With Claude Code running in the project directory, just describe what you want to do. For example:
        </p>
        <CodeBlock>{`> Create a branch and PR that adds a tooltip to the upvote button`}</CodeBlock>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Claude will:
        </p>
        <ol className="text-sm space-y-1 list-decimal list-inside mt-1" style={{ color: 'var(--color-text-muted)' }}>
          <li>Explore the codebase to understand the existing code</li>
          <li>Propose a plan for your approval</li>
          <li>Make the code changes</li>
          <li>Create a branch, commit, push, and open a PR</li>
        </ol>
        <p className="text-sm mt-3" style={{ color: 'var(--color-text-muted)' }}>
          You can review and approve each step along the way. Claude will ask before taking any action that modifies files or runs commands.
        </p>
      </Card>

      {/* Pro tip */}
      <Card>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
          Pro Tip
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          You can ask Claude Code to <strong style={{ color: 'var(--color-text)' }}>&ldquo;read the getting started page and help me through the steps&rdquo;</strong> and
          it will read this page from the source code and walk you through everything interactively.
          It&apos;s like having a pair programmer who already knows the project.
        </p>
      </Card>
    </div>
  );
}
