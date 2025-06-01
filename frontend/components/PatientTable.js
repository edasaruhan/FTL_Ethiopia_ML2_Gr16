//  components/PatientTable.js
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { DataGrid } from '@mui/x-data-grid'
import { Paper, IconButton, Tooltip, Box } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import ScreeningUpload from './ScreeningUpload'
import { useRouter } from 'next/navigation'

export default function PatientTable() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients/').then(res => res.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/patients/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients'])
      alert('Patient deleted successfully.')
    },
    onError: () => {
      alert('Failed to delete patient.')
    },
  })

  const handleView = (id) => {
    router.push(`/dashboard/patients/${id}`)  // adjust route as needed
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      deleteMutation.mutate(id)
    }
  }

  const columns = [
     {
      field: 'id',
      headerName: 'Patient ID',
      width: 100,
      renderCell: (params) => `PID-${params.row.id}`, // Format the ID
    },
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScreeningUpload patientId={params.row.id} />

          <Tooltip title="View Patient">
            <IconButton color="primary" onClick={() => handleView(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Patient">
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Paper elevation={4} sx={{ width: '100%', height: '600px', p: 2 }}>
      <DataGrid
        rows={data || []}
        columns={columns}
        loading={isLoading}
        pageSize={10}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-cell': {
            alignItems: 'center',
          },
        }}
      />
    </Paper>
  )
}
