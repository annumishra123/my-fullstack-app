import type {User} from '@/types'
import { createContext, useState, useContext, useEffect } from 'react'
import { is } from 'zod/v4/locales'
import { queryClient } from './react-query-provider'
import { useLocation, useNavigate } from 'react-router'
import { publicRoutes } from '@/lib'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
//   error: string | null
  login: (data: any) => Promise<void>
  logout: () => Promise<void>
}


const AuthContext =  createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const naivigate = useNavigate()
    const currentPath = useLocation().pathname
    const isPublicPath = publicRoutes.includes(currentPath)

    useEffect(()=>{
        const checkAuth = async () => {
            setIsLoading(true)
            const user = localStorage.getItem('user')

            if (user) {
                setUser( JSON.parse(user))
                setIsAuthenticated(true)
            } else {
                setUser(null)
                setIsAuthenticated(false)
                
                if (!isPublicPath) {
                    naivigate('/sign-in')
                }
            }
            setIsLoading(false)
        }
        checkAuth()
    },[])


    useEffect(()=>{
        const handleLogout = ()=>{
            logout()
            naivigate('/sign-in')
        }
        window.addEventListener('force-logout', handleLogout)
        return () => {
            window.removeEventListener('force-logout', handleLogout)
        }
    },[])

    const login = async (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        setUser(data.user);
        setIsAuthenticated(true);
    }


    const logout = async () => {
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       setUser(null);
       setIsAuthenticated(false);
       queryClient.clear()
    }


        const values = {
            user,
            isAuthenticated,
            isLoading,
            login,
            logout
        }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}


export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}