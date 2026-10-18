import React from 'react'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { ModeToggle } from '../components/ThemeToggle'
import { UserButton } from '~/components/user-button'

type Props = {
    children: React.ReactNode
}

const SideBarLayout = ({children}:Props) => {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <main className='w-full m-2 '>
            <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4'>
                <SidebarTrigger />
                <div className="ml-auto"></div>
                <ModeToggle/>
                <UserButton />
            </div>
            <div className="h-4"></div>
            {/* main content */}
            <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
                {children}
            </div>
        </main>
    </SidebarProvider>
  )
}

export default SideBarLayout