// app/dashboard/page.js
'use client'
import { Grid } from '@mui/material'
import PatientTable from '@/components/PatientTable'
import ScreeningStats from '@/components/ScreeningStats'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ScreeningStats />
        </Grid>
        <Grid item xs={12}>
          <PatientTable />
        </Grid>
      </Grid>
    </ProtectedRoute>
  )
}