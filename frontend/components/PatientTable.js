'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'first_name', headerName: 'First Name', width: 130 },
  { field: 'last_name', headerName: 'Last Name', width: 130 },
  { field: 'gender', headerName: 'Gender', width: 90 },
  { field: 'phone', headerName: 'Phone', width: 150 },
]

export default function PatientTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients/').then(res => res.data),
  })

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data || []}
        columns={columns}
        loading={isLoading}
        pageSize={5}
        checkboxSelection
      />
    </div>
  )
}