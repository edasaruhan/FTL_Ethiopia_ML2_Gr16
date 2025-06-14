'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Snackbar,
  Alert,
  Link
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { motion } from 'framer-motion'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ChatbotPage() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Fetch chat history
  const { data: messages, isLoading } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: () => api.get('/chatbot/messages/').then(res => res.data),
  })

  // Send query mutation
  const sendQueryMutation = useMutation({
    mutationFn: (query) => api.post('/chatbot/messages/', { query }),
    onSuccess: () => {
      queryClient.invalidateQueries(['chatMessages'])
      setQuery('')
      setSnackbar({ open: true, message: 'Message sent successfully!', severity: 'success' })
    },
    onError: (error) => {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' })
    },
  })

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/chatbot/messages/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['chatMessages'])
      setSnackbar({ open: true, message: 'Message deleted successfully.', severity: 'success' })
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete message.', severity: 'error' })
    },
  })

  const handleSend = () => {
    if (query.trim()) {
      sendQueryMutation.mutate(query)
    }
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      renderCell: (params) => `C-${params.row.id}`,
      headerClassName: 'font-sans',
    },
    {
      field: 'query',
      headerName: 'User Query',
      flex: 1,
      headerClassName: 'font-sans',
    },
    {
      field: 'response',
      headerName: 'Bot Response',
      flex: 1,
      renderCell: (params) => (
        <span>{params.value.length > 50 ? `${params.value.slice(0, 50)}...` : params.value}</span>
      ),
      headerClassName: 'font-sans',
    },
    {
      field: 'search_urls',
      headerName: 'Sources',
      width: 150,
      renderCell: (params) => (
        <span>{params.value?.length || 0} URLs</span>
      ),
      headerClassName: 'font-sans',
    },
    {
      field: 'created_at',
      headerName: 'Date',
      width: 180,
      renderCell: (params) => new Date(params.value).toLocaleString(),
      headerClassName: 'font-sans',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Delete Message">
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            sx={{ color: '#d32f2f', '&:hover': { bgcolor: '#ffebee', transform: 'scale(1.1)' } }}
            aria-label={`Delete message ${params.row.id}`}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
      headerClassName: 'font-sans',
    },
  ]

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <ProtectedRoute>
      <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%', overflowX: 'auto' }}>
        <motion.div variants={variants} initial="hidden" animate="visible">
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#1a3c34', mb: 3, fontSize: { xs: '1.5rem', sm: '1.8rem' } }}
            className="font-serif"
            aria-label="Malaria chatbot interface"
          >
            Malaria Treatment & Protection Assistant
          </Typography>
          <Grid container spacing={3}>
            {/* Chat Interface */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  border: '1px solid #e6f0fa',
                  maxHeight: 600,
                  overflowY: 'auto'
                }}
                className="shadow-md"
              >
                <Box sx={{ mb: 2 }}>
                  {messages?.length > 0 ? (
                    messages.slice().reverse().map((msg) => (
                      <Box key={msg.id} sx={{ mb: 2 }}>
                        {/* User Message */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                          <Chip
                            label={msg.query}
                            sx={{
                              bgcolor: '#00695c',
                              color: '#e6f0fa',
                              maxWidth: '80%',
                              borderRadius: '16px',
                              p: 1,
                              fontSize: '0.9rem'
                            }}
                            className="font-sans"
                            aria-label={`User query: ${msg.query}`}
                          />
                        </Box>
                        {/* Bot Response */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Avatar sx={{ bgcolor: '#00695c', mr: 1 }}>
                            AI
                          </Avatar>
                          <Box>
                            <Chip
                              label={msg.response}
                              sx={{
                                bgcolor: '#e6f0fa',
                                color: '#4b5e5a',
                                maxWidth: '80%',
                                borderRadius: '16px',
                                p: 1,
                                fontSize: '0.9rem'
                              }}
                              className="font-sans"
                              aria-label={`Bot response: ${msg.response}`}
                            />
                            {msg.search_urls?.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{ color: '#4b5e5a' }}
                                  className="font-sans"
                                >
                                  Sources:
                                </Typography>
                                {msg.search_urls.map((url, index) => (
                                  <Link
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      display: 'block',
                                      color: '#00695c',
                                      textDecoration: 'underline',
                                      fontSize: '0.8rem',
                                      '&:hover': { color: '#004d40' }
                                    }}
                                    className="font-sans"
                                    aria-label={`Source URL ${index + 1}`}
                                  >
                                    {url.length > 50 ? `${url.slice(0, 50)}...` : url}
                                  </Link>
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ color: '#4b5e5a' }} className="font-sans">
                      Ask about malaria treatment or protection to get started.
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Ask about malaria treatment or prevention..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    sx={{ bgcolor: '#f5f5f5', borderRadius: '8px' }}
                    className="font-sans"
                    aria-label="Malaria chat query input"
                  />
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={sendQueryMutation.isLoading || !query.trim()}
                    sx={{
                      bgcolor: '#00695c',
                      color: '#e6f0fa',
                      borderRadius: '50px',
                      px: 3,
                      '&:hover': { bgcolor: '#004d40' }
                    }}
                    className="font-sans"
                    aria-label="Send query"
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Paper>
            </Grid>
            {/* Chat History Table */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: '#1a3c34', mb: 2 }}
                className="font-serif"
                aria-label="Chat history"
              >
                Chat History
              </Typography>
              <Paper
                elevation={6}
                sx={{
                  width: '100%',
                  height: 600,
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  border: '1px solid #e6f0fa',
                  overflow: 'hidden'
                }}
                className="shadow-md"
              >
                <DataGrid
                  rows={messages || []}
                  columns={columns}
                  loading={isLoading}
                  pageSizeOptions={[10, 25, 50]}
                  getRowId={(row) => row.id}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                      bgcolor: '#00695c',
                      color: '#e6f0fa',
                      fontWeight: 700,
                      borderBottom: '1px solid #e6f0fa',
                      opacity: 1
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      color: '#e6f0fa',
                      fontSize: '1rem',
                      fontWeight: 700,
                      fontFamily: '"Inter", sans-serif',
                      opacity: 1
                    },
                    '& .MuiDataGrid-cell': {
                      color: '#4b5e5a',
                      fontSize: '0.9rem',
                      borderBottom: '1px solid #e6f0fa'
                    },
                    '& .MuiDataGrid-row:hover': {
                      bgcolor: '#e6f0fa'
                    },
                    '& .MuiDataGrid-footerContainer': {
                      bgcolor: '#f5f5f5',
                      borderTop: '1px solid #e6f0fa'
                    }
                  }}
                  aria-label="Malaria chat history data grid"
                />
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: '8px' }}
            className="font-sans"
            aria-label={snackbar.severity === 'success' ? 'Success message' : 'Error message'}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  )
}