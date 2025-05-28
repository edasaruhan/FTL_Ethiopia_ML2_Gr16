
// qpp/(auth)/login/page.js
'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const response = await login(
        e.currentTarget.email.value,
        e.currentTarget.password.value
      )
      
      if (response?.access) {
        router.push('/dashboard')
        router.refresh() // Ensure client-side state updates
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(
        err.response?.data?.email?.[0] || 
        err.response?.data?.detail || 
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h4" gutterBottom>Malaria Diagnosis</Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          required
          type="email"
          autoComplete="username"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          required
          autoComplete="current-password"
        />
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  )
}