"use client"

import { Check, Copy, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import useProject from '~/hooks/use-project'

const InviteButton = () => {
  const { projectId, project } = useProject()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${projectId}` : ''

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      toast.success("Invite link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!projectId) return null

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <UserPlus className='size-5 text-primary' />
              Invite Team Members
            </DialogTitle>
            <DialogDescription>
              Share this link with your teammates so they can join and collaborate on <strong>{project?.name || "this project"}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className='flex items-center space-x-2 mt-2'>
            <Input
              readOnly
              value={inviteUrl}
              className='font-mono text-xs select-all'
              onClick={handleCopy}
            />
            <Button size='sm' onClick={handleCopy} className='shrink-0 gap-1.5'>
              {copied ? <Check className='size-4 text-emerald-300' /> : <Copy className='size-4' />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size='sm'
        variant='outline'
        onClick={() => setOpen(true)}
        className='h-8 gap-1.5 text-xs font-medium border-border/80 hover:bg-accent shadow-sm'
      >
        <UserPlus className='size-3.5 text-muted-foreground' />
        Invite
      </Button>
    </>
  )
}

export default InviteButton