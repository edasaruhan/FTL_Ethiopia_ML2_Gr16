// // app/dashboard/page.js
// 'use client'
// import { Grid, Box } from '@mui/material'
// import PatientTable from '@/components/PatientTable'
// import ScreeningStats from '@/components/ScreeningStats'
// import ProtectedRoute from '@/components/ProtectedRoute'
// import PatientForm from '@/components/PatientForm'

// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <Box sx={{  mt: '6px' }}> 
//         <Grid >
         
//           <Grid container spacing={4} sx={{ mb: 3 }}>
//             <ScreeningStats />
//           </Grid>
//            <Grid container spacing={3} sx={{ mb: 3 }}>
//             <PatientForm />
//           </Grid>
//           <Grid >
//             <PatientTable />
//           </Grid>
//         </Grid>
//       </Box>
//     </ProtectedRoute>
//   )
// }

'use client'
import { Box } from '@mui/material'
import ScreeningStats from '@/components/ScreeningStats'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  }

  return (
    <ProtectedRoute>
      <Box sx={{ p: { xs: 2, sm: 3 }, mt: '6px' }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <ScreeningStats />
        </motion.div>
      </Box>
    </ProtectedRoute>
  )
}