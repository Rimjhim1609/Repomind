"use client"

import {
  Check,
  Copy,
  ExternalLink,
  GitCommit,
  Search,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import useProject from '~/hooks/use-project'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

const CommitLog = () => {
  const { projectId, project } = useProject()
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: commits, error, isLoading } = api.project.getCommits.useQuery(
    { projectId },
    {
      enabled: !!project?.repoUrl,
    }
  )

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    toast.success("Commit hash copied")
    setTimeout(() => setCopiedHash(null), 2000)
  }

  if (!project?.repoUrl) {
    return (
      <div className="text-sm text-muted-foreground p-6 text-center border rounded-lg bg-card">
        No project selected. Link a repository to view git commits.
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
        Error loading commits: {error.message}
      </div>
    )
  }

  const sortedCommits = commits
    ? [...commits].sort(
        (a, b) => new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime()
      )
    : []

  const filteredCommits = sortedCommits.filter(
    (c) =>
      c.commitMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.commitAuthorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="border border-border/80 shadow-sm bg-gradient-to-b from-card to-card/60">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <GitCommit className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Commit Intelligence</CardTitle>
              <p className="text-xs text-muted-foreground">
                Automated AI diff summaries for indexed commits
              </p>
            </div>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium text-muted-foreground border">
              {sortedCommits.length} commits
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search commit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs bg-background/60"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-sm">Fetching and synchronizing commits...</span>
          </div>
        )}

        {!isLoading && sortedCommits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <GitCommit className="size-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No commits indexed yet</p>
            <p className="text-xs mt-1">Commits will appear automatically as they are polled from GitHub.</p>
          </div>
        )}

        {!isLoading && sortedCommits.length > 0 && filteredCommits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No commits matching &quot;{searchTerm}&quot;
          </div>
        )}

        <ul className="space-y-6">
          {filteredCommits.map((commit, commitIdx) => {
            const dateStr = new Date(commit.commitDate).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
            const isLast = commitIdx === filteredCommits.length - 1
            const shortHash = commit.commitHash.slice(0, 7)
            const authorInitial = (commit.commitAuthorName?.[0] || 'G').toUpperCase()

            return (
              <li key={commit.id} className="relative flex gap-x-4">
                {/* Timeline connector line */}
                <div
                  className={cn(
                    isLast ? 'h-6' : '-bottom-6',
                    'absolute left-0 top-0 flex w-7 justify-center'
                  )}
                >
                  <div className="w-px translate-x-0.5 bg-border"></div>
                </div>

                {/* Author Avatar with fallback */}
                <div className="relative mt-2 shrink-0">
                  {commit.commitAuthorAvatar ? (
                    <img
                      src={commit.commitAuthorAvatar}
                      alt={commit.commitAuthorName}
                      className="size-7 rounded-full bg-muted object-cover ring-2 ring-background"
                    />
                  ) : (
                    <div className="size-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold ring-2 ring-background">
                      {authorInitial}
                    </div>
                  )}
                </div>

                {/* Commit Content Box */}
                <div className="flex-auto rounded-lg p-4 border border-border/70 bg-card/70 hover:bg-card/90 transition-all shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {commit.commitAuthorName}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Commit Hash Pill */}
                      <button
                        type="button"
                        onClick={() => handleCopyHash(commit.commitHash)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                        title="Copy full commit hash"
                      >
                        {copiedHash === commit.commitHash ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                        <span>{shortHash}</span>
                      </button>

                      {/* GitHub Link */}
                      <Link
                        href={`${project.repoUrl}/commit/${commit.commitHash}`}
                        target="_blank"
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                        title="View commit on GitHub"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Commit message */}
                  <div className="mt-2 text-sm font-medium text-foreground">
                    {commit.commitMessage}
                  </div>

                  {/* AI Summary Box */}
                  {commit.summary && (
                    <div className="mt-3 p-3 rounded-md bg-muted/30 border border-border/40 text-xs text-muted-foreground leading-relaxed">
                      <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold mb-1">
                        <Sparkles className="size-3" />
                        <span>AI Diff Summary</span>
                      </div>
                      <div
                        className="prose-xs"
                        dangerouslySetInnerHTML={{
                          __html: commit.summary
                            .replace(/(\*{2})(.*?)\1/g, '<b>$2</b>')
                            .replace(/(['"`])(.*?)\1/g, '<code class="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">$2</code>'),
                        }}
                      />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

export default CommitLog