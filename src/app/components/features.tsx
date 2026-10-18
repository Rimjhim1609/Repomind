import { Github, Code, GitCommit, Database, BookmarkCheck, Zap } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="w-full p-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Core Functions</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">RepoMind Product Capabilities</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Combining structure-aware parsing, vector embeddings, and LLM reasoning to make unfamiliar codebases instantly understandable.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <Github className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Repository Ingestion</h3>
            <p className="text-muted-foreground text-center text-sm">
              Connect any GitHub repository with structure-aware chunking of functions, classes, and interfaces.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Semantic Code Indexing</h3>
            <p className="text-muted-foreground text-center text-sm">
              Vector embeddings generated for code chunks and stored with pgvector for deep semantic similarity search.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Hybrid AI Q&amp;A</h3>
            <p className="text-muted-foreground text-center text-sm">
              Combines semantic search and keyword reranking with source citations and line-number traceability.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <GitCommit className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Commit Summarization</h3>
            <p className="text-muted-foreground text-center text-sm">
              Automatically converts Git diffs into clear, understandable natural language summaries.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <BookmarkCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Persistent Knowledge Base</h3>
            <p className="text-muted-foreground text-center text-sm">
              Save useful questions, answers, and file references for continuous repository documentation.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Streaming Responses</h3>
            <p className="text-muted-foreground text-center text-sm">
              Real-time progressive token streaming with interactive syntax highlighting and code preview.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
