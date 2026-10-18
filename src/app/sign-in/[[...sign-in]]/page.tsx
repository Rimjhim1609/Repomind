"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '~/lib/auth-client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { ArrowRight, Sparkles, Lock, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please provide both email and password")
      return
    }

    setLoading(true)
    try {
      const res = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      })

      if (res?.error) {
        toast.error(res.error.message || "Failed to sign in. Check your credentials.")
      } else {
        toast.success("Signed in successfully!")
        router.push('/dashboard')
      }
    } catch (err: any) {
      // Graceful fallback if database is not connected
      console.warn("Sign in notice:", err)
      toast.info("Database not connected yet. Use Instant Demo Access below!")
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setGithubLoading(true)
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
    } catch (err: any) {
      toast.error(err?.message || "GitHub OAuth failed. Verify your GitHub Client ID in .env")
      setGithubLoading(false)
    }
  }

  const handleDemoAccess = () => {
    // Set a demo cookie so middleware lets them explore without database
    document.cookie = "repomind_demo=true; path=/; max-age=86400"
    toast.success("Welcome! Entered RepoMind Demo Mode.")
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <img src="/favicon.ico" alt="RepoMind" className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in to RepoMind</CardTitle>
          <CardDescription>
            Authenticate with Better Auth or explore in Demo Mode
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* GitHub OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-border hover:bg-accent"
            onClick={handleGitHubSignIn}
            disabled={githubLoading || loading}
          >
            {githubLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            Continue with GitHub
          </Button>

          <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground">
            <span className="w-full border-t border-border" />
            <span className="bg-card px-2">Or with email</span>
            <span className="w-full border-t border-border" />
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 font-semibold mt-2" disabled={loading || githubLoading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          {/* Instant Demo Access Button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDemoAccess}
              className="w-full gap-2 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Instant Demo Access (No Setup Required)
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-0">
          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}