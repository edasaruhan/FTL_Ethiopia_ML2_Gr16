// app/dashboard/page.js
'use client'
import { Grid, Box } from '@mui/material'
import PatientTable from '@/components/PatientTable'
import ScreeningStats from '@/components/ScreeningStats'
import ProtectedRoute from '@/components/ProtectedRoute'
import PatientForm from '@/components/PatientForm'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Box sx={{  width: { sm: `calc(100% - 240px)` }, mt: '64px' }}> 
        <Grid >
         
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <ScreeningStats />
          </Grid>
           <Grid container spacing={3} sx={{ mb: 3 }}>
            <PatientForm />
          </Grid>
          <Grid >
            <PatientTable />
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  )
}
