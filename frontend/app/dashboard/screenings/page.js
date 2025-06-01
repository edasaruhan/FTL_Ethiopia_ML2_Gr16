// app/dashboard/screenings/page.js
'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Paper,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid' // Ensure this import is included
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function ScreeningTablePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['screenings'],
    queryFn: () => api.get('/screenings/screenings/').then(res => res.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/screenings/screenings/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['screenings'])
      alert('Screening deleted successfully.')
    },
    onError: () => {
      alert('Failed to delete screening.')
    },
  })

  const handleView = (id) => {
    router.push(`/dashboard/screenings/${id}`)  // adjust route as needed
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this screening?')) {
      deleteMutation.mutate(id)
    }
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => `S-${params.row.id}`, // Add 'S-' before the ID
    },
    {
      field: 'patient',
      headerName: 'Patient',
      flex: 1,
      renderCell: (params) => {
        const { first_name, last_name } = params.row.patient || {};
        return <span>{first_name && last_name ? `${first_name} ${last_name}` : 'Unknown'}</span>;
      },
    },
    {
      field: 'parasite_count',
      headerName: 'Parasite Count',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.parasite_count !== undefined ? params.row.parasite_count : 'N/A'}</span>
      ),
    },
    {
      field: 'result',
      headerName: 'Result',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value === 'P' ? 'Positive' : 'Negative'}
          color={params.value === 'P' ? 'error' : 'success'}
        />
      ),
    },
    {
      field: 'confidence',
      headerName: 'Confidence (%)',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.confidence !== undefined ? Math.round(params.row.confidence * 100) : 'N/A'}</span>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        const date = params.row.created_at ? new Date(params.row.created_at) : null;
        return <span>{date ? date.toLocaleString() : 'Unknown'}</span>;
      },
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
            <IconButton color="primary" onClick={() => handleView(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Screening">
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Screening Records
      </Typography>
      <Paper elevation={4} sx={{ height: '100%', p: 2 }}>
        <DataGrid
          rows={data || []}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  )
}