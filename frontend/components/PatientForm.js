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
  DialogActions 
} from '@mui/material'
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
    setFormData({...formData, [e.target.name]: e.target.value})
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

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Add New Patient
      </Button>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Register New Patient</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
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
            />
            <TextField
              name="last_name"
              label="Last Name"
              fullWidth
              margin="normal"
              required
              value={formData.last_name}
              onChange={handleChange}
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
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
              {/* <MenuItem value="O">Other</MenuItem> */}
            </TextField>
            <TextField
              name="birth_date"
              label="Birth Date"
              type="date"
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              value={formData.birth_date}
              onChange={handleChange}
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
            />
            <TextField
              name="phone"
              label="Phone Number"
              fullWidth
              margin="normal"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Patient'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}