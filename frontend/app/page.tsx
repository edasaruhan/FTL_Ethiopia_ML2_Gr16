'use client'
import { useRouter } from 'next/navigation'
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material'

export default function HomePage() {
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.push('/login')  // adjust if needed
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        {/* Hero Section */}
        <Typography variant="h3" gutterBottom>
          Welcome to the Malaria Diagnosis System
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph>
          An AI-powered platform for fast, reliable malaria detection from blood smear images.
          Empowering healthcare workers with cutting-edge deep learning tools to improve diagnostics.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleLoginRedirect}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started → Login
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            What We Offer
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Automated Screening
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload blood smear images and let our deep learning model detect parasitized cells with over 93% accuracy.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Patient Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track patient records, view past screenings, and monitor treatment outcomes in a secure dashboard.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Real-Time Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access visual reports on infection trends, screening statistics, and system performance for better decision-making.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Footer or Image Banner */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Malaria Diagnosis System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
