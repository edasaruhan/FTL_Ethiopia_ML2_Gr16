//  components/ScreeningUpload.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Box
} from '@mui/material'
import api from '@/lib/api'

export default function ScreeningUpload({ patientId }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSubmit = async () => {
    if (!file || !patientId) return
    
    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('image', file)
    formData.append('patient', patientId)
    formData.append('notes', notes)
    
    try {
      await api.post('/screenings/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      router.refresh()
      handleClose()
    } catch (err) {
      setError(err.response?.data || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFile(null)
    setPreview(null)
    setNotes('')
    setError(null)
  }

  return (
    <>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        sx={{ ml: 2 }}
      >
        Upload Screening
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Upload Blood Smear Image</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {typeof error === 'object' ? JSON.stringify(error) : error}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
            <Box sx={{ flex: 1 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="screening-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="screening-upload">
                <Button 
                  variant="contained" 
                  component="span"
                  fullWidth
                >
                  Select Image
                </Button>
              </label>
              
              {preview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Preview:</Typography>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 300,
                      marginTop: 8,
                      border: '1px solid #ddd'
                    }} 
                  />
                </Box>
              )}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                Patient ID: {patientId}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}