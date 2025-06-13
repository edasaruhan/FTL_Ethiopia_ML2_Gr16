// app/(auth)/login/page.js
'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Box, Button, TextField, Typography, Paper, CircularProgress, Link } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'

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
      const response = await login(e.currentTarget.email.value, e.currentTarget.password.value)
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #e6f0fa 0%, #f5f5f5 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
          animation: 'pulse 10s infinite'
        }}
      />
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4 },
            maxWidth: 450,
            width: '100%',
            borderRadius: '16px',
            bgcolor: '#ffffff',
            border: '1px solid #e6f0fa'
          }}
          className="shadow-xl"
        >
          <Box textAlign="center" sx={{ mb: 4 }}>
            <HealthAndSafetyIcon sx={{ fontSize: 48, color: '#00695c', mb: 2 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: '#1a3c34', fontSize: { xs: '1.8rem', sm: '2.2rem' } }}
              className="font-serif"
            >
              Malaria Diagnosis
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#4b5e5a', mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
              className="font-sans"
            >
              Sign in to access your AI-powered diagnostic dashboard
            </Typography>
          </Box>

          {error && (
            <Typography
              color="error"
              sx={{ mb: 3, bgcolor: '#ffebee', p: 1, borderRadius: '8px', fontSize: '0.9rem' }}
              className="font-sans"
            >
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': { borderColor: '#00695c' },
                  '&.Mui-focused fieldset': { borderColor: '#00695c' }
                }
              }}
              InputLabelProps={{ sx: { color: '#4b5e5a' } }}
              aria-label="Email address"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': { borderColor: '#00695c' },
                  '&.Mui-focused fieldset': { borderColor: '#00695c' }
                }
              }}
              InputLabelProps={{ sx: { color: '#4b5e5a' } }}
              aria-label="Password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: '#00695c',
                color: 'white',
                borderRadius: '50px',
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#00897b', transform: 'scale(1.03)', transition: 'all 0.3s' },
                '&:disabled': { bgcolor: '#b0bec5' }
              }}
              disabled={loading}
              className="shadow-lg"
              aria-label="Log in"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>
          </form>

          <Box textAlign="center" sx={{ mt: 3 }}>
            <Link
              href="/"
              underline="none"
              sx={{
                color: '#00695c',
                fontSize: '0.9rem',
                '&:hover': { color: '#00897b', textDecoration: 'underline' }
              }}
              className="font-sans"
              aria-label="Back to home page"
            >
              ← Back to Home
            </Link>
          </Box>
        </Paper>
      </motion.div>

      {/* CSS for background animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.15;
          }
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
        }
      `}</style>
    </Box>
  )
}