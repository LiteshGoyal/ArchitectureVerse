'use client'

import { getCurrentUser } from "@/services/user"
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: number;
  username: string;
  email: string;
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType |null>(null)

export function AuthProvider({children,}:{children:ReactNode}){
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshUser = async()=>{
        try{
            const userData = await getCurrentUser();
            setUser(userData)
        }catch(error){
            console.error("Failed to fetch user", error)
            setUser(null)
        }
    }
    const router = useRouter()

    const logout = ()=>{
        localStorage.removeItem("token")
        setUser(null)
        router.push("/login")

    }

    useEffect(()=>{
        const initializeAuth = async()=>{
            const token = localStorage.getItem("token")
            if(!token){
                setLoading(false)
                return
            }

            try{
                const userData = await getCurrentUser();
                setUser(userData)
            }catch(error){
                console.error("Authentication Failed", error)
                localStorage.removeItem("token")
                setUser(null)
            }finally{
                setLoading(false)
            }

        }
        initializeAuth()
    },[])

    return(
        <AuthContext.Provider value={{user, loading, isAuthenticated:!!user, refreshUser, logout}}>{children}</AuthContext.Provider>
    )

}

export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}