"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { authClient } from "~/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export function UserButton() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully")
            router.push("/sign-in")
          },
        },
      })
    } catch {
      router.push("/sign-in")
    }
  }

  const user = session?.user
  const name = user?.name || "Demo User"
  const email = user?.email || "demo@repomind.ai"
  const image = user?.image || ""

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "RM"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="User profile"
        >
          <Avatar className="h-9 w-9">
            {image && <AvatarImage src={image} alt={name} />}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2 font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
