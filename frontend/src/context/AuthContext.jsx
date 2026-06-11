import { createContext, useState, useEffect } from 'react'
import api from '../api/axios.js'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await api.get('/auth/profile')
        setUser(res.data.user)
      } catch (error) {
        console.log('not logged in', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const register = async (name, email, phone, password, passcode) => {
    await api.post('/auth/register', { name, email, phone, password, passcode })
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/profile')
      setUser(res.data.user)
    } catch (error) {
      console.log('refresh user error', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}