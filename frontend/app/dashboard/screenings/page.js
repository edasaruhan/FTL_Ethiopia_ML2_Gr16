// app/dashboard/screenings/page.js
'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Paper,
  Chip,
  Box,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

export default function ScreeningTablePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['screenings'],
    queryFn: () => api.get('/screenings/screenings/').then(res => res.data),
  })

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