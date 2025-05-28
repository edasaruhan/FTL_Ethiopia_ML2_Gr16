//  components/PatientTable.js
'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { DataGrid } from '@mui/x-data-grid'
import { Paper } from '@mui/material'
import ScreeningUpload from './ScreeningUpload'

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'first_name', headerName: 'First Name', flex: 1 },
  { field: 'last_name', headerName: 'Last Name', flex: 1 },
  { field: 'gender', headerName: 'Gender', flex: 0.7 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: (params) => <ScreeningUpload patientId={params.row.id} />,
    sortable: false,
    filterable: false,
  },
]

export default function PatientTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients/').then(res => res.data),
  })

  return (
    <Paper elevation={3} sx={{ width: '100%', height: '550px' }}>
      <DataGrid
        rows={data || []}
        columns={columns}
        loading={isLoading}
        pageSize={10}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </Paper>
  )
}
