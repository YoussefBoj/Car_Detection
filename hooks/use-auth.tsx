"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  username: string
  email: string
  dateOfBirth: string
  cinNumber: string
  phoneNumber: string
  createdAt: string
  analysesCount: number
  analysisHistory: any[]
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const initializeAuth = () => {
      try {
        // Check for remembered login
        const rememberedUser = localStorage.getItem("rememberedUser")
        const loginTime = localStorage.getItem("loginTime")

        if (rememberedUser && loginTime) {
          const daysSinceLogin = (Date.now() - Number.parseInt(loginTime)) / (1000 * 60 * 60 * 24)
          if (daysSinceLogin < 30) {
            // Load user data from localStorage
            const userData = localStorage.getItem(`user_${rememberedUser}`)
            if (userData) {
              try {
                setUser(JSON.parse(userData))
              } catch (error) {
                console.error("Error parsing user data:", error)
                // Clear corrupted data
                localStorage.removeItem(`user_${rememberedUser}`)
                localStorage.removeItem("rememberedUser")
                localStorage.removeItem("loginTime")
              }
            }
          } else {
            // Clear expired login
            localStorage.removeItem("rememberedUser")
            localStorage.removeItem("loginTime")
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  const login = async (username: string, password: string, rememberMe = false) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      const hashedPassword = await hashPassword(password)

      if (users[username] && users[username].password === hashedPassword) {
        const userData = users[username]
        setUser(userData)

        if (rememberMe) {
          localStorage.setItem("rememberedUser", username)
          localStorage.setItem("loginTime", Date.now().toString())
        }

        localStorage.setItem(`user_${username}`, JSON.stringify(userData))
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)

    try {
      // Validate data
      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!validateCIN(userData.cinNumber)) {
        throw new Error("Invalid CIN number")
      }

      if (!validatePhone(userData.phoneNumber)) {
        throw new Error("Invalid phone number")
      }

      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("users") || "{}")

      if (users[userData.username]) {
        throw new Error("Username already exists")
      }

      const hashedPassword = await hashPassword(userData.password)
      const newUser = {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        dateOfBirth: userData.dateOfBirth,
        cinNumber: userData.cinNumber,
        phoneNumber: userData.phoneNumber,
        createdAt: new Date().toISOString(),
        analysesCount: 0,
        analysisHistory: [],
      }

      users[userData.username] = newUser
      localStorage.setItem("users", JSON.stringify(users))

      // Auto-login after registration
      const userForState = { ...newUser }
      delete userForState.password // Don't store password in state
      setUser(userForState)
      localStorage.setItem(`user_${userData.username}`, JSON.stringify(userForState))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("rememberedUser")
      localStorage.removeItem("loginTime")
      if (user) {
        localStorage.removeItem(`user_${user.username}`)
      }
    }
  }

  // Don't render children until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Utility functions
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function validateCIN(cin: string): boolean {
  return /^\d{8}$/.test(cin)
}

function validatePhone(phone: string): boolean {
  return /^(\+216|216|0)?[2-9]\d{7}$/.test(phone)
}
