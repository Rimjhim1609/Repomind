"use client"

import { authClient } from '~/lib/auth-client'

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return {
      isLoaded: false,
      isSignedIn: false,
      user: null,
    }
  }

  if (session?.user) {
    const fullName = session.user.name || 'Developer'
    const nameParts = fullName.split(' ')
    const firstName = nameParts[0] || 'Developer'
    const lastName = nameParts.slice(1).join(' ') || ''

    return {
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: session.user.id,
        firstName,
        lastName,
        fullName,
        imageUrl: session.user.image || '/favicon.ico',
        emailAddresses: [{ emailAddress: session.user.email }],
      },
    }
  }

  // Safe Demo Fallback
  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'user_demo_repomind',
      firstName: 'Demo',
      lastName: 'User',
      fullName: 'Demo User',
      imageUrl: '/favicon.ico',
      emailAddresses: [{ emailAddress: 'demo@repomind.ai' }],
    },
  }
}

export default useCurrentUser
