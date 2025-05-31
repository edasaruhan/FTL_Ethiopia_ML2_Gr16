
// app/(auth)/login/page.js
'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress,
  Link
} from '@mui/material'
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
        router.refresh()
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Malaria Diagnosis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Log in to access your dashboard
          </Typography>
        </Box>

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
            sx={{ mt: 2, py: 1.2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Link href="/" underline="hover">
            ← Back to Home
          </Link>
        </Box>
      </Paper>
    </Box>
  )
}
