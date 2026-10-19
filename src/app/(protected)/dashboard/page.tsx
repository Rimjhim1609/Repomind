"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ExternalLink,
  Github,
  GitBranch,
  Copy,
  Check,
  Plus,
  Coins,
  Database,
  GitCommit,
  MessageSquareCode,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode2,
  Terminal,
} from 'lucide-react'
import useProject from '~/hooks/use-project'
import { useSession } from '~/lib/auth-client'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import AskQuestionCard from './ask-question-card'
import CommitLog from './commit-log'
import DeleteButton from './delete-button'
import InviteButton from './invite-button'
import TeamMembers from './team-members'
import RepoHealthCard from './repo-health-card'

const DEMO_REPOSITORIES = [
  {
    name: 'Octocat Hello World',
    url: 'https://github.com/octocat/Hello-World',
    description: 'Minimal starter repository for instant indexing & testing',
  },
  {
    name: 'Shadcn UI',
    url: 'https://github.com/shadcn-ui/ui',
    description: 'Component library built on Tailwind & Radix Primitives',
  },
  {
    name: 'Trpc / Examples',
    url: 'https://github.com/trpc/trpc',
    description: 'End-to-end typesafe client & server RPC architecture',
  },
]

const DashboardPage = () => {
  const { project, projects, isLoading: isProjectsLoading } = useProject()
  const { data: session } = useSession()
  const [copiedClone, setCopiedClone] = useState(false)

  // Fetch live stats for selected project
  const { data: stats } = api.project.getProjectStats.useQuery(
    { projectId: project?.id || '' },
    { enabled: !!project?.id }
  )

  // Fetch user credit balance
  const { data: creditsData } = api.project.getMyCredits.useQuery()

  const handleCopyClone = () => {
    if (project?.repoUrl) {
      navigator.clipboard.writeText(`${project.repoUrl}.git`)
      setCopiedClone(true)
      toast.success("Git clone URL copied")
      setTimeout(() => setCopiedClone(false), 2000)
    }
  }

  // 1. Loading State while checking projects
  if (isProjectsLoading && (!projects || projects.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Synchronizing developer workspace...</p>
      </div>
    )
  }

  // 2. Onboarding Hub when NO projects exist
  if (!project && (!projects || projects.length === 0)) {
    const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Developer'

    return (
      <div className="space-y-8 max-w-6xl mx-auto py-2">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 sm:p-10 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              <span>Group CS077 • RepoMind v2.0 Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-primary via-primary/80 to-purple-600 bg-clip-text text-transparent">{userName}</span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Transform your GitHub repositories into an intelligent developer command center. 
              Index source code with AST parsing, perform 768-dimensional semantic retrieval via Supabase pgvector, 
              and explore your codebase with Gemini 2.0 Flash RAG.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/create">
                <Button className="gap-2 shadow-sm h-10 px-5 font-medium">
                  <Plus className="size-4" />
                  Link Your First Repository
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted/70 px-3 py-2 rounded-lg border">
                <Coins className="size-3.5 text-amber-500" />
                <span>{creditsData?.credits ?? 500} Free Credits Available</span>
              </div>
            </div>
          </div>

          {/* Decorative Background Blob */}
          <div className="absolute -right-12 -top-12 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        </div>

        {/* Quick Demo Repositories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
              <Github className="size-4 text-primary" />
              Quick Connect Public Repositories
            </h2>
            <span className="text-xs text-muted-foreground">Click to link instantly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_REPOSITORIES.map((repo, i) => (
              <Card
                key={i}
                className="group border border-border/70 hover:border-primary/50 transition-all shadow-2xs hover:shadow-sm bg-card/60 backdrop-blur-xs flex flex-col justify-between"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {repo.name}
                    </span>
                    <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                  <div className="pt-2">
                    <Link href={`/create?repo=${encodeURIComponent(repo.url)}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5 font-medium">
                        <Plus className="size-3.5" />
                        Index this repo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Architecture Matrix */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            Core Architecture & Capabilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
              <div className="size-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FileCode2 className="size-5" />
              </div>
              <h3 className="font-semibold text-sm">AST-Level Ingestion</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Recursive AST traversal preserving function scopes, structural dependencies, and language contracts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
              <div className="size-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Database className="size-5" />
              </div>
              <h3 className="font-semibold text-sm">pgvector (768-dim)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gemini embedding vectors stored directly in PostgreSQL with pgvector cosine similarity search.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
              <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Sparkles className="size-5" />
              </div>
              <h3 className="font-semibold text-sm">Hybrid AI RAG</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gemini 2.0 Flash reasoning agent grounded by exact code citations and file references.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
              <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <GitCommit className="size-5" />
              </div>
              <h3 className="font-semibold text-sm">Commit Summaries</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Continuous polling of GitHub commits generating automated change explanations and team insights.
              </p>
            </div>
          </div>
        </div>

        {/* System Telemetry Footer */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>Supabase pgvector: <strong>Connected</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="size-4 text-primary" />
              <span>Gemini 2.0 RAG: <strong>Operational</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Better Auth: <strong>Session Verified</strong></span>
            </div>
          </div>

          <Link href="/create" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
            Get started by linking a repository &rarr;
          </Link>
        </div>
      </div>
    )
  }

  // 3. Active Project Command Center
  return (
    <div className="space-y-6">
      {/* Developer Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-gradient-to-r from-card via-card/80 to-muted/20 shadow-xs backdrop-blur-xs">
        {/* Left: Project & Repo Link */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs border border-primary/20">
            <Github className="size-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                {project?.name}
              </h1>

              {/* Active branch indicator */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <GitBranch className="size-3" />
                <span>main</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Linked to:</span>
              <Link
                href={project?.repoUrl ?? ""}
                target="_blank"
                className="font-mono text-primary/90 hover:text-primary hover:underline inline-flex items-center gap-1"
              >
                {project?.repoUrl}
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Actions & Team */}
        <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
          {/* Quick Clone Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyClone}
            className="h-8 text-xs gap-1.5 font-medium border-border/80 shadow-2xs"
            title="Copy git clone URL"
          >
            {copiedClone ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            {copiedClone ? "Copied" : "Clone URL"}
          </Button>

          <TeamMembers />
          <InviteButton />
          <DeleteButton />
        </div>
      </div>

      {/* Metrics Ribbon (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Source Embeddings */}
        <Card className="border border-border/70 shadow-2xs bg-card/60">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Vector Chunks
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats?.embeddingsCount ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground">pgvector 768-dim</p>
            </div>
            <div className="size-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Database className="size-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Commits Indexed */}
        <Card className="border border-border/70 shadow-2xs bg-card/60">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Commits Tracked
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats?.commitsCount ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground">Live polled & diffed</p>
            </div>
            <div className="size-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <GitCommit className="size-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Q&A Resolved */}
        <Card className="border border-border/70 shadow-2xs bg-card/60">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Questions Saved
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats?.questionsCount ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground">Knowledge base queries</p>
            </div>
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquareCode className="size-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Credits Balance */}
        <Card className="border border-border/70 shadow-2xs bg-card/60">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Credit Balance
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {creditsData?.credits ?? 500}
              </p>
              <Link href="/billing" className="text-[10px] text-primary hover:underline">
                Manage credits &rarr;
              </Link>
            </div>
            <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Coins className="size-4.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Ask Question Card + Repo Health Card */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <AskQuestionCard />
        <RepoHealthCard />
      </div>

      {/* Git Commit Timeline Stream */}
      <div className="pt-2">
        <CommitLog />
      </div>
    </div>
  )
}

export default DashboardPage