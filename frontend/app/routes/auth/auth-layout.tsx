import { useAuth } from '@/provider/auth-context'
import React from 'react'
import { Navigate, Outlet } from  "react-router"

export const AuthLayout = () => {
  const {isAuthenticated, isLoading} = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard"/>
    
  }


  return (
   <Outlet />
  )
}
