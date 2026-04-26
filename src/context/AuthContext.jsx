import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Seed demo users
const DEFAULT_USERS = [
  { id: 1, name: 'Ramani', email: 'ramani@navaigate.in', password: 'password123', avatar: 'RA' },
  { id: 2, name: 'Demo User', email: 'demo@navaigate.in', password: 'demo123', avatar: 'DU' },
]

function getUsers() {
  const stored = localStorage.getItem('nav_users')
  if (!stored) {
    localStorage.setItem('nav_users', JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS
  }
  return JSON.parse(stored)
}

function saveUsers(users) {
  localStorage.setItem('nav_users', JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('nav_session')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const users = getUsers()
    const found = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { success: false, error: 'Invalid email or password' }
    const session = { id: found.id, name: found.name, email: found.email, avatar: found.avatar }
    localStorage.setItem('nav_session', JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  const signup = (name, email, password) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' }
    }
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const newUser = { id: Date.now(), name, email, password, avatar: initials }
    saveUsers([...users, newUser])
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar }
    localStorage.setItem('nav_session', JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('nav_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
