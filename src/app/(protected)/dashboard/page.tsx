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
  FileCode2,
  MessageSquareCode,
  FolderGit2,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import useProject from '~/hooks/use-project'
import { useSession } from '~/lib/auth-client'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
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
  const { project, projects, projectId, setProjectId, isLoading: isProjectsLoading } = useProject()
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

  // Loading state
  if (isProjectsLoading && (!projects || projects.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
        <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Synchronizing workspace...</p>
      </div>
    )
  }

  const hasProjects = projects && projects.length > 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. Welcome Section */}
      <div className="rounded-xl border border-border/70 bg-card/70 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Your codebase, understood.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect your repository, ask questions in natural language, and explore your code with AI-powered insights.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link href="/create">
              <Button className="gap-2 shadow-xs font-medium h-9 px-4">
                <Plus className="size-4" />
                <span>Link Repository</span>
              </Button>
            </Link>

            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 border border-border/60 px-3 py-1.5 rounded-lg font-medium">
              <Coins className="size-3.5 text-amber-500/80" />
              <span>{creditsData?.credits ?? 500} credits available</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Summary Cards (Up to three) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Connected Repositories */}
        <Card className="border border-border/70 bg-card/70 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Connected Repositories
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {projects?.length ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {projects?.length === 1 ? '1 active workspace' : `${projects?.length ?? 0} active workspaces`}
              </p>
            </div>
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FolderGit2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Indexed Files */}
        <Card className="border border-border/70 bg-card/70 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Indexed Files
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {project ? (stats?.embeddingsCount ?? 0) : 0}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {project ? 'Vectorized code chunks' : 'No repository active'}
              </p>
            </div>
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileCode2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Saved Answers */}
        <Card className="border border-border/70 bg-card/70 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Saved Answers
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {project ? (stats?.questionsCount ?? 0) : 0}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {project ? 'Knowledge base solutions' : 'No repository active'}
              </p>
            </div>
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageSquareCode className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Repository Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Github className="size-4 text-primary" />
            Connected Repositories
          </h2>
          {hasProjects && (
            <Link href="/create" className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1">
              <Plus className="size-3" />
              <span>Add another</span>
            </Link>
          )}
        </div>

        {hasProjects ? (
          <div className="space-y-3">
            {/* Active Repository Card */}
            <div className="p-4 rounded-xl border border-border/70 bg-card/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Github className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {project?.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <GitBranch className="size-2.5" />
                      <span>main</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Link
                      href={project?.repoUrl ?? ""}
                      target="_blank"
                      className="font-mono hover:text-foreground hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                      {project?.repoUrl}
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Active Repository Actions */}
              <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyClone}
                  className="h-8 text-xs gap-1.5 font-medium border-border/70"
                  title="Copy git clone URL"
                >
                  {copiedClone ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  {copiedClone ? "Copied" : "Clone URL"}
                </Button>
                <TeamMembers />
                <InviteButton />
                <DeleteButton />
              </div>
            </div>

            {/* Other Connected Repositories (if more than 1) */}
            {projects.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs text-muted-foreground mr-1">Switch workspace:</span>
                {projects.map((p) => {
                  const isActive = p.id === projectId
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProjectId(p.id)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        isActive
                          ? 'bg-primary/10 border-primary text-primary font-medium'
                          : 'bg-card/50 border-border/70 text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      {p.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Empty Repository State */
          <div className="rounded-xl border border-dashed border-border/80 bg-card/40 p-8 text-center space-y-3">
            <div className="mx-auto size-10 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
              <FolderGit2 className="size-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="text-sm font-semibold text-foreground">No repositories connected</p>
              <p className="text-xs text-muted-foreground">
                Connect your GitHub repository to index code and start querying your codebase.
              </p>
            </div>
            <Link href="/create" className="inline-block pt-1">
              <Button size="sm" className="gap-1.5 text-xs font-medium">
                <Plus className="size-3.5" />
                Link Your First Repository
              </Button>
            </Link>
          </div>
        )}

        {/* Secondary Sample Repositories (Reduced Prominence) */}
        {!hasProjects && (
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Sample repositories for quick testing
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEMO_REPOSITORIES.map((repo, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/60 bg-card/40 p-3 flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">{repo.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {repo.description}
                    </p>
                  </div>
                  <Link href={`/create?repo=${encodeURIComponent(repo.url)}`}>
                    <Button variant="outline" size="sm" className="w-full text-[11px] h-7 gap-1 border-border/60">
                      <Plus className="size-3" />
                      Index sample
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Main Q&A Entry Point & Repo Health */}
      {hasProjects ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <AskQuestionCard />
          <RepoHealthCard />
        </div>
      ) : (
        <Card className="border border-border/70 bg-card/60 p-6 text-center space-y-2">
          <h3 className="text-base font-semibold text-foreground">Ask your codebase</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Once a repository is linked, you can ask questions regarding authentication, data flow, API routes, and architecture.
          </p>
        </Card>
      )}

      {/* 5. Recent Activity Stream */}
      {hasProjects && (
        <div className="pt-1">
          <CommitLog />
        </div>
      )}

      {/* 6. System Status Footer */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Database: <strong className="text-foreground/90 font-medium">Connected</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>AI Reasoning: <strong className="text-foreground/90 font-medium">Operational</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Session: <strong className="text-foreground/90 font-medium">Verified</strong></span>
          </div>
        </div>

        {hasProjects && (
          <Link href="/qa" className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-[11px]">
            Explore Q&A history &rarr;
          </Link>
        )}
      </div>
    </div>
  )
}

export default DashboardPage