//  components/PatientTable.js
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { DataGrid } from '@mui/x-data-grid'
import { Paper, IconButton, Tooltip, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import ScreeningUpload from './ScreeningUpload'
import { useRouter } from 'next/navigation'

export default function PatientTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients/').then(res => res.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/patients/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients'])
      setSnackbar({ open: true, message: 'Patient deleted successfully.', severity: 'success' })
      setDeleteDialogOpen(false)
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete patient.', severity: 'error' })
    },
  })

  const handleView = (id) => {
    router.push(`/dashboard/patients/${id}`)
  }

  const handleDelete = (id) => {
    setPatientToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (patientToDelete) {
      deleteMutation.mutate(patientToDelete)
    }
  }

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false)
    setPatientToDelete(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'Patient ID',
      width: 120,
      renderCell: (params) => `PID-${params.row.id}`,
      headerClassName: 'font-sans',
    },
    { field: 'first_name', headerName: 'First Name', flex: 1, headerClassName: 'font-sans' },
    { field: 'last_name', headerName: 'Last Name', flex: 1, headerClassName: 'font-sans' },
    { field: 'gender', headerName: 'Gender', width: 100, headerClassName: 'font-sans' },
    { field: 'phone', headerName: 'Phone', flex: 1, headerClassName: 'font-sans' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScreeningUpload
            patientId={params.row.id}
            sx={{
              bgcolor: '#00695c',
              color: '#e6f0fa',
              borderRadius: '8px',
              px: 2,
              py: 0.5,
              textTransform: 'none',
              '&:hover': { bgcolor: '#00897b', transform: 'scale(1.05)', transition: 'all 0.3s' }
            }}
            className="font-sans shadow-sm"
          />
          <Tooltip title="View Patient">
            <IconButton
              onClick={() => handleView(params.row.id)}
              sx={{
                color: '#00695c',
                '&:hover': { bgcolor: '#e6f0fa', transform: 'scale(1.1)', transition: 'all 0.3s' }
              }}
              aria-label={`View patient ${params.row.id}`}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Patient">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              sx={{
                color: '#d32f2f',
                '&:hover': { bgcolor: '#ffebee', transform: 'scale(1.1)', transition: 'all 0.3s' }
              }}
              aria-label={`Delete patient ${params.row.id}`}
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
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: '#1a3c34', mb: 3, fontSize: { xs: '1.5rem', sm: '1.8rem' } }}
        className="font-serif"
        aria-label="Patient records table"
      >
        Patient Records
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
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#00695c',
                color: '#000000', // High-contrast white for visibility
                fontWeight: 600,
                borderBottom: '1px solid #e6f0fa',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: '#ffffff', // Explicitly set title color
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
            aria-label="Patient records data grid"
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
      >
        <DialogTitle
          sx={{ bgcolor: '#00695c', color: '#e6f0fa', fontWeight: 700, fontSize: '1.5rem' }}
          className="font-serif"
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ color: '#4b5e5a' }} className="font-sans">
            Are you sure you want to delete this patient? This action cannot be undone.
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}