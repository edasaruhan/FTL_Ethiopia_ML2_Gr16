//  components/ScreeningUpload.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Button,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material'
import { motion } from 'framer-motion'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import api from '@/lib/api'

export default function ScreeningUpload({ patientId, sx, className }) {
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
        setConfidence((confidenceValue * 100).toFixed(1))
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

  // Animation variants
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  }

  return (
    <>
      <Tooltip title="Upload Screening">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            color: '#00695c',
            '&:hover': { bgcolor: '#e6f0fa', transform: 'scale(1.1)', transition: 'all 0.3s' },
            ...sx
          }}
          className={`font-sans ${className || ''}`}
          aria-label={`Upload screening for patient ${patientId}`}
        >
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>

      <motion.div
        variants={dialogVariants}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
      >
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
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
          aria-label="Upload blood smear image dialog"
        >
          <DialogTitle
            sx={{ bgcolor: '#00695c', color: '#e6f0fa', fontWeight: 700, fontSize: '1.5rem' }}
            className="font-serif"
          >
            Upload Blood Smear Image
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2, borderRadius: '8px' }}
                className="font-sans"
              >
                {typeof error === 'object' ? JSON.stringify(error) : error}
              </Alert>
            )}

            {resultMessage && (
              <Alert
                severity={resultMessage.includes('Malaria') ? 'error' : resultMessage.includes('Negative') ? 'success' : 'warning'}
                sx={{
                  mb: 2,
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  py: 2,
                  bgcolor: resultMessage.includes('Malaria') ? '#ffebee' : resultMessage.includes('Negative') ? '#e8f5e9' : '#fff8e1'
                }}
                className="font-sans"
              >
                {resultMessage}
                {confidence !== null && (
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, fontWeight: 400, color: '#4b5e5a' }}
                    className="font-sans"
                  >
                    Confidence: {confidence}%
                  </Typography>
                )}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 3, mt: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 300 } }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id={`screening-upload-${patientId}`}
                  type="file"
                  onChange={handleFileChange}
                  aria-label="Select blood smear image"
                />
                <label htmlFor={`screening-upload-${patientId}`}>
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    sx={{
                      borderColor: '#00695c',
                      color: '#00695c',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      py: 1.5,
                      '&:hover': { borderColor: '#00897b', bgcolor: '#e6f0fa', color: '#00897b' }
                    }}
                    className="font-sans shadow-sm"
                    startIcon={<CloudUploadIcon />}
                  >
                    Select Image
                  </Button>
                </label>

                {preview && (
                  <Box
                    sx={{
                      mt: 2,
                      border: '2px solid #00695c',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      maxHeight: 450,
                      textAlign: 'center',
                      bgcolor: '#f5f5f5'
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ mt: 1, color: '#1a3c34' }}
                      className="font-sans"
                    >
                      Preview:
                    </Typography>
                    <img
                      src={preview}
                      alt="Blood smear preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        display: 'block',
                        margin: '0 auto',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 300 } }}>
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows= {8}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': { borderColor: '#00695c' },
                      '&.Mui-focused fieldset': { borderColor: '#00695c' }
                    }
                  }}
                  InputLabelProps={{ sx: { color: '#4b5e5a' } }}
                  className="font-sans"
                  aria-label="Screening notes"
                />

                <Typography
                  variant="body2"
                  sx={{ color: '#6b7280' }}
                  className="font-sans"
                >
                  Patient ID: {patientId}
                </Typography>
              </Box>
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
              aria-label="Close dialog"
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!file || loading}
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
              aria-label="Upload screening"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </>
  )
}