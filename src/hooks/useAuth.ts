'use client'

import { useEffect, useState } from 'react'
import { authService, User } from '@/services/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsAdmin(currentUser?.role === 'admin')
    setLoading(false)
  }, [])

  return { user, loading, isAdmin, isAuthenticated: !!user }
}
