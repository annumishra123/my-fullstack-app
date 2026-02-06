import { Loader } from '@/components/ui/loader'
import { Header } from '@/components/ui/layout/header'
import { useAuth } from '@/provider/auth-context'
import React from 'react'
import {Navigate, useNavigate, Outlet } from 'react-router'

const DashboardLayout = () => {
  const {isAuthenticated, isLoading} = useAuth()
  const navigate = useNavigate()

  if (!isLoading) {
    return <Loader/>
  }



  if (!isAuthenticated) {
    return <Navigate to="/sign-in"/>
  }
  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 flex-col h-full">
          <Header
          //  onWorkspaceSelected={handleWorkspaceSelected}
          //  selectedWorkspace={currentWorkspace}
          //  onCreateWorkspace={() => setIsCreatingWorkspace(true)}
          />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      
    </div>
  )
}

export default DashboardLayout