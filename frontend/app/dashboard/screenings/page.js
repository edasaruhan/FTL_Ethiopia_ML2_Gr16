// app/dashboard/screenings/page.js
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Paper,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { motion } from 'framer-motion'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/navigation'

export default function ScreeningTablePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [screeningToDelete, setScreeningToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const { data, isLoading } = useQuery({
    queryKey: ['screenings'],
    queryFn: () => api.get('/screenings/screenings/').then(res => res.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/screenings/screenings/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['screenings'])
      setSnackbar({ open: true, message: 'Screening deleted successfully.', severity: 'success' })
      setDeleteDialogOpen(false)
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete screening.', severity: 'error' })
    },
  })

  const handleView = (id) => {
    router.push(`/dashboard/screenings/${id}`)
  }

  const handleDelete = (id) => {
    setScreeningToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (screeningToDelete) {
      deleteMutation.mutate(screeningToDelete)
    }
  }

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false)
    setScreeningToDelete(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      renderCell: (params) => `S-${params.row.id}`,
      headerClassName: 'font-sans',
    },
    {
      field: 'patient',
      headerName: 'Patient',
      flex: 1,
      renderCell: (params) => {
        const { first_name, last_name } = params.row.patient || {}
        return <span>{first_name && last_name ? `${first_name} ${last_name}` : 'Unknown'}</span>
      },
      headerClassName: 'font-sans',
    },
    {
      field: 'parasite_count',
      headerName: 'Parasite Count',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.parasite_count !== undefined ? params.row.parasite_count : 'N/A'}</span>
      ),
      headerClassName: 'font-sans',
    },
    {
      field: 'result',
      headerName: 'Result',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value === 'P' ? 'Positive' : 'Negative'}
          color={params.value === 'P' ? 'error' : 'success'}
          sx={{
            bgcolor: params.value === 'P' ? '#d32f2f' : '#2e7d32',
            color: '#ffffff',
            fontWeight: 600
          }}
          className="font-sans"
          aria-label={`Result: ${params.value === 'P' ? 'Positive' : 'Negative'}`}
        />
      ),
      headerClassName: 'font-sans',
    },
    {
      field: 'confidence',
      headerName: 'Confidence (%)',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.confidence !== undefined ? Math.round(params.row.confidence * 100) : 'N/A'}</span>
      ),
      headerClassName: 'font-sans',
    },
    {
      field: 'created_at',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        const date = params.row.created_at ? new Date(params.row.created_at) : null
        return <span>{date ? date.toLocaleString() : 'Unknown'}</span>
      },
      headerClassName: 'font-sans',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="View Screening">
            <IconButton
              onClick={() => handleView(params.row.id)}
              sx={{
                color: '#00695c',
                '&:hover': { bgcolor: '#e6f0fa', transform: 'scale(1.1)', transition: 'all 0.3s' }
              }}
              aria-label={`View screening ${params.row.id}`}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Screening">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              sx={{
                color: '#d32f2f',
                '&:hover': { bgcolor: '#ffebee', transform: 'scale(1.1)', transition: 'all 0.3s' }
              }}
              aria-label={`Delete screening ${params.row.id}`}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      headerClassName: 'font-sans',
    },
  ]

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: '#1a3c34', mb: 3, fontSize: { xs: '1.5rem', sm: '1.8rem' } }}
        className="font-serif"
        aria-label="Screening records table"
      >
        Screening Records
      </Typography>
      <motion.div variants={tableVariants} initial="hidden" animate="visible">
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            height: 600,
            borderRadius: '12px',
            bgcolor: '#ffffff',
            border: '1px solid #e6f0fa',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
          }}
          className="shadow-md"
        >
          <DataGrid
            rows={data || []}
            columns={columns}
            loading={isLoading}
            pageSizeOptions={[10, 25, 50]}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: '#00695c', // primary color, no opacity
                  color: '#e6f0fa',    // white text for high contrast
                  fontWeight: 600,
                  borderBottom: '1px solid #e6f0fa',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: '#000000', // white for full visibility
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                },
              '& .MuiDataGrid-cell': {
                color: '#4b5e5a',
                fontSize: '0.9rem',
                alignItems: 'center',
                borderBottom: '1px solid #e6f0fa',
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: '#e6f0fa',
                transition: 'background-color 0.3s'
              },
              '& .MuiDataGrid-footerContainer': {
                bgcolor: '#f5f5f5',
                borderTop: '1px solid #e6f0fa'
              },
              '& .MuiDataGrid-overlay': {
                bgcolor: '#f5f5f5',
                color: '#4b5e5a',
                fontSize: '1rem',
                fontFamily: '"Inter", sans-serif'
              }
            }}
            aria-label="Screening records data grid"
          />
        </Paper>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
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
        aria-label="Confirm screening deletion dialog"
      >
        <DialogTitle
          sx={{ bgcolor: '#00695c', color: '#e6f0fa', fontWeight: 700, fontSize: '1.5rem' }}
          className="font-serif"
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ color: '#4b5e5a' }} className="font-sans">
            Are you sure you want to delete this screening? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: '#00695c',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { bgcolor: '#e6f0fa', color: '#00897b' }
            }}
            className="font-sans"
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              bgcolor: '#d32f2f',
              color: '#ffffff',
              px: 4,
              py: 1,
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { bgcolor: '#b71c1c', transform: 'scale(1.03)', transition: 'all 0.3s' }
            }}
            className="shadow-lg font-sans"
            aria-label="Confirm deletion"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
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
  )
}