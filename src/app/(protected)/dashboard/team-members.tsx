"use client"

import React from 'react'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'

const TeamMembers = () => {
  const { projectId } = useProject()
  const { data: members } = api.project.getTeamMembers.useQuery(
    { projectId },
    { enabled: !!projectId }
  )

  if (!members || members.length === 0) return null

  return (
    <div className='flex items-center -space-x-2 overflow-hidden py-1' title={`${members.length} team members`}>
      {members.slice(0, 4).map((member) => {
        const name = member.user.name || member.user.firstName || 'Collaborator'
        const initial = (name[0] || 'U').toUpperCase()

        return (
          <div
            key={member.id}
            title={name}
            className='relative inline-block ring-2 ring-background rounded-full'
          >
            {member.user.imageUrl ? (
              <img
                src={member.user.imageUrl}
                alt={name}
                className='size-7 object-cover rounded-full'
              />
            ) : (
              <div className='size-7 rounded-full bg-gradient-to-tr from-primary to-primary/70 text-white flex items-center justify-center text-xs font-semibold shadow-sm'>
                {initial}
              </div>
            )}
          </div>
        )
      })}
      {members.length > 4 && (
        <div className='size-7 rounded-full bg-muted ring-2 ring-background flex items-center justify-center text-[10px] font-semibold text-muted-foreground'>
          +{members.length - 4}
        </div>
      )}
    </div>
  )
}

export default TeamMembers