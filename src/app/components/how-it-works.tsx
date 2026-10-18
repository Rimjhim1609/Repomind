import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Github, MessageSquare, GitCommit, ArrowRight } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full p-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Yet Powerful Workflow</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              RepoMind turns complex, unfamiliar repositories into structured, searchable intelligence in three easy steps.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Step 1</CardTitle>
                  <CardDescription>Connect Repository</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Paste the GitHub repository URL. RepoMind fetches the files, extracts meaningful code chunks (AST), and indexes them into vector storage.
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Button variant="ghost" className="w-full" disabled>
                Connect <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Step 2</CardTitle>
                  <CardDescription>Ask in Natural Language</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Query the codebase using everyday questions. Hybrid search finds relevant chunks and generates streaming answers with source citations.
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Button variant="ghost" className="w-full" disabled>
                Ask <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <GitCommit className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Step 3</CardTitle>
                  <CardDescription>Commit Insights &amp; Knowledge</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View automated commit summaries derived from Git diffs, save key Q&amp;A pairs to the knowledge base, and collaborate effortlessly.
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Button variant="ghost" className="w-full" disabled>
                Summarize <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
