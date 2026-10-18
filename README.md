# RepoMind — Frontend Application

> **AI-Powered Developer Collaboration & Repository Intelligence Platform**  
> Extracted and updated from [Rimjhim1609/RepoMind](https://github.com/Rimjhim1609/RepoMind).  
> All branding and references have been updated from GitChat to **RepoMind**.

---

## 🚀 Overview

**RepoMind** is an AI-powered SaaS platform designed to enhance developer productivity and repository intelligence. It combines automated code documentation, semantic code search, intelligent commit summaries, real-time meeting transcription, and collaborative chat.

This package contains the **complete frontend codebase** of RepoMind, including all UI components, pages, hooks, themes, layouts, and interactive panels.

---

## ✨ Features & Pages

- **Landing Page (`/`)**:
  - Hero section introducing RepoMind with quick call-to-actions.
  - Interactive Features showcase with AI capabilities.
  - How-It-Works step-by-step breakdown.
  - Responsive Navbar and Footer with dark/light mode toggle.
- **Authentication (`/sign-in`, `/sign-up`, `/sync-user`)**:
  - Seamless authentication flows powered by Clerk.
- **Dashboard (`/dashboard`)**:
  - Linked GitHub repository card with live status.
  - Team members management, invite dialog, and project deletion modal.
  - **Ask RepoMind Card**: AI-powered Q&A interface with markdown rendering and code references.
  - Repository Health metrics card.
  - Commit Logs and activity feed.
  - Meeting overview cards.
- **Interactive Code Generator & Editor (`/code`)**:
  - Multi-language syntax highlighting code editor.
  - AI-assisted code generation streaming via Google Gemini.
  - Multiple file tabs, terminal view, copy, and export capabilities.
- **Meeting Transcription & Rooms (`/meetings`)**:
  - Audio meeting upload with Supabase storage.
  - Real-time video/audio meeting room integration with Stream SDK.
  - In-meeting chat and issue tracking.
- **Team Chat (`/chat`)**:
  - Real-time channel and direct messaging interface powered by Stream Chat.
- **Q&A Archive (`/qa`)**:
  - Searchable list of previously asked repository questions and AI answers.
- **Billing & Credits (`/billing`)**:
  - Credit balance display, tier sliders, purchase history, and Stripe checkout.
- **Project Creation (`/create`)**:
  - Guided repository linking workflow.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS + CSS Variables
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Theme**: `next-themes` (Dark/Light mode support)
- **Data Fetching / State**: TanStack React Query + tRPC Client
- **Authentication**: Clerk Next.js SDK
- **Rich Text & Syntax**: React Markdown, UIW Markdown Editor & Preview, React Syntax Highlighter
- **Real-Time Video & Chat**: Stream Chat React & Stream Video React SDK

---

## 📁 Directory Structure

```plaintext
Repomind/
├── public/                 # Static assets (favicons, svg illustrations)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (protected)/    # Protected application routes (Sidebar layout)
│   │   │   ├── billing/    # Billing & credits purchase UI
│   │   │   ├── chat/       # Real-time Stream chat page
│   │   │   ├── code/       # AI code editor & generator
│   │   │   ├── create/     # Link GitHub repository page
│   │   │   ├── dashboard/  # Main analytics & Q&A dashboard
│   │   │   ├── join/       # Invite link handler
│   │   │   ├── meetings/   # Meeting transcription & Stream video room
│   │   │   ├── qa/         # Q&A history & detail views
│   │   │   ├── app-sidebar.tsx # Main application sidebar
│   │   │   └── layout.tsx  # Protected layout with header & user button
│   │   ├── components/     # Landing page components (Hero, Features, Navbar, Footer, etc.)
│   │   ├── sign-in/        # Clerk Sign-In page
│   │   ├── sign-up/        # Clerk Sign-Up page
│   │   ├── sync-user/      # User synchronization handler
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Public landing page
│   ├── components/
│   │   └── ui/             # 45+ shadcn/ui components (buttons, dialogs, forms, etc.)
│   ├── hooks/              # Custom React hooks (useProject, useMobile, useToast, etc.)
│   ├── lib/                # Utility helpers (cn, utils, supabase client, etc.)
│   ├── styles/             # Global Tailwind stylesheet
│   └── trpc/               # tRPC client & React Query integration
├── .env.example            # Environment variables template
├── components.json         # shadcn/ui configuration
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts (name: "repomind")
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚦 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` using `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your API keys (Clerk, Google Gemini, Stream, Supabase, etc.) as needed.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view RepoMind.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🔄 Changes Made

- **Extracted Frontend**: Separated the frontend components, pages, styles, hooks, and static assets into a clean, standalone directory.
- **Rebranding**: Updated all UI labels, metadata titles, logos, header texts, card descriptions, local storage keys, and documentation from "GitChat" to **RepoMind**.
- **Package Configuration**: Updated `package.json` project name to `repomind` and decoupled standalone frontend execution.
- **Environment Configuration**: Set optional database validation in `env.js` and added `.env.example` for immediate frontend development.
