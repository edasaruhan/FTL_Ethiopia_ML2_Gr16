'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material'
import { motion } from 'framer-motion'
import api from '@/lib/api'

export default function PatientForm() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    birth_date: '',
    address: '',
    phone: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/patients/', formData)
      router.refresh()
      handleClose()
    } catch (err) {
      setError(err.response?.data || 'Failed to create patient')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      first_name: '',
      last_name: '',
      gender: '',
      birth_date: '',
      address: '',
      phone: ''
    })
    setError(null)
  }

  // Animation variants
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          bgcolor: '#00695c',
          color: '#e6f0fa',
          px: 4,
          py: 1.5,
          borderRadius: '50px',
          textTransform: 'none',
          fontSize: '1rem',
          '&:hover': { bgcolor: '#00897b', transform: 'scale(1.05)', transition: 'all 0.3s' },
          '&:disabled': { bgcolor: '#b0bec5' }
        }}
        className="shadow-lg font-sans"
        aria-label="Add new patient"
      >
        Add New Patient
      </Button>

      <motion.div
        variants={dialogVariants}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
      >
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px',
              bgcolor: '#ffffff',
              border: '1px solid #e6f0fa',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }
          }}
          className="shadow-xl"
        >
          <DialogTitle
            sx={{ bgcolor: '#00695c', color: '#e6f0fa', fontWeight: 700, fontSize: '1.5rem' }}
            className="font-serif"
          >
            Register New Patient
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {error && (
              <Typography
                color="error"
                sx={{ mb: 2, bgcolor: '#ffebee', p: 1, borderRadius: '8px', fontSize: '0.9rem' }}
                className="font-sans"
              >
                {typeof error === 'object' ? JSON.stringify(error) : error}
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                margin="normal"
                required
                value={formData.first_name}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#00695c' },
                    '&.Mui-focused fieldset': { borderColor: '#00695c' }
                  }
                }}
                InputLabelProps={{ sx: { color: '#4b5e5a' } }}
                className="font-sans"
                aria-label="First name"
              />
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                margin="normal"
                required
                value={formData.last_name}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#00695c' },
                    '&.Mui-focused fieldset': { borderColor: '#00695c' }
                  }
                }}
                InputLabelProps={{ sx: { color: '#4b5e5a' } }}
                className="font-sans"
                aria-label="Last name"
              />
              <TextField
                name="gender"
                label="Gender"
                fullWidth
                margin="normal"
                required
                select
                value={formData.gender}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#00695c' },
                    '&.Mui-focused fieldset': { borderColor: '#00695c' }
                  }
                }}
                InputLabelProps={{ sx: { color: '#4b5e5a' } }}
                className="font-sans"
                aria-label="Gender"
              >
                <MenuItem value="M" className="font-sans">Male</MenuItem>
                <MenuItem value="F" className="font-sans">Female</MenuItem>
                <MenuItem value="O" className="font-sans">Other</MenuItem>
              </TextField>
              <TextField
                name="birth_date"
                label="Birth Date"
                type="date"
                fullWidth
                margin="normal"
                required
                InputLabelProps={{ shrink: true, sx: { color: '#4b5e5a' } }}
                value={formData.birth_date}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#00695c' },
                    '&.Mui-focused fieldset': { borderColor: '#00695c' }
                  }
                }}
                className="font-sans"
                aria-label="Birth date"
              />
              <TextField
                name="address"
                label="Address"
                fullWidth
                margin="normal"
                required
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#00695c' },
                    '&.Mui-focused fieldset': { borderColor: '#00695c' }
                  }
                }}
                InputLabelProps={{ sx: { color: '#4b5e5a' } }}
                className="font-sans"
                aria-label="Address"
              />
              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                margin="normal"
                required
                value={formData.phone}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#00695c' },
                    '&.Mui-focused fieldset': { borderColor: '#00695c' }
                  }
                }}
                InputLabelProps={{ sx: { color: '#4b5e5a' } }}
                className="font-sans"
                aria-label="Phone number"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: '#00695c',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#e6f0fa', color: '#00897b' }
              }}
              className="font-sans"
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#00695c',
                color: '#e6f0fa',
                px: 4,
                py: 1,
                borderRadius: '50px',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#00897b', transform: 'scale(1.03)', transition: 'all 0.3s' },
                '&:disabled': { bgcolor: '#b0bec5' }
              }}
              className="shadow-lg font-sans"
              aria-label="Save patient"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Patient'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </>
  )
}