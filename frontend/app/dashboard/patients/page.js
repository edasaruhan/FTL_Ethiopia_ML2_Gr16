'use client'
import { Grid, Box } from '@mui/material'
import PatientTable from '@/components/PatientTable'
import PatientForm from '@/components/PatientForm'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'

export default function PatientsPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  }

  return (
    <ProtectedRoute>
      <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%', overflowX: 'auto' }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <PatientForm />
            </Grid>
          </Grid>
          <Box sx={{ width: '100%', minWidth: '100%' }}>
            <PatientTable />
          </Box>
        </motion.div>
      </Box>
    </ProtectedRoute>
  )
}