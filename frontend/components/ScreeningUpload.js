//  components/ScreeningUpload.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Button,
  Tooltip,
  Alert,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import api from '@/lib/api'

export default function ScreeningUpload({ patientId }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultMessage, setResultMessage] = useState(null)
  const [confidence, setConfidence] = useState(null)
  const router = useRouter()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

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
    setResultMessage(null)
    setConfidence(null)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('patient', patientId)
    formData.append('notes', notes)

    try {
      const response = await api.post('/screenings/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = response.data?.result
      const confidenceValue = response.data?.confidence

      if (result === 'P') {
        setResultMessage('⚠ Malaria Detected (Positive)')
      } else if (result === 'N') {
        setResultMessage('✅ No Malaria Detected (Negative)')
      } else {
        setResultMessage('Result unclear, please review.')
      }

      if (confidenceValue !== undefined) {
        setConfidence((confidenceValue * 100).toFixed(1)) // e.g., 0.87 → 87.0%
      }

      router.refresh()
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
    setResultMessage(null)
    setConfidence(null)
  }

  return (
    <>
      <Tooltip title="Upload Screening">
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ ml: 1 }}
        >
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        fullWidth
      >
        <DialogTitle>Upload Blood Smear Image</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {typeof error === 'object' ? JSON.stringify(error) : error}
            </Typography>
          )}

          {resultMessage && (
            <Alert
              severity={resultMessage.includes('Malaria') ? 'error' : 'success'}
              sx={{
                mb: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                py: 2,
              }}
            >
              {resultMessage}
              {confidence !== null && (
                <Typography
                  variant="h6"
                  sx={{ mt: 1, fontWeight: 'normal' }}
                >
                  Confidence: {confidence}%
                </Typography>
              )}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 4, mt: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`screening-upload-${patientId}`}
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor={`screening-upload-${patientId}`}>
                <Button variant="outlined" component="span" fullWidth>
                  Select Image
                </Button>
              </label>

              {preview && (
                <Box
                  sx={{
                    mt: 2,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    overflow: 'hidden',
                    maxHeight: 500, // bigger preview
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Preview:
                  </Typography>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '450px', // bigger height
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 300 }}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={10}
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
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
