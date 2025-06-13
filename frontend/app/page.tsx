'use client'
import { useRouter } from 'next/navigation'
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import PeopleIcon from '@mui/icons-material/People'
import BarChartIcon from '@mui/icons-material/BarChart'

export default function HomePage() {
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.push('/login')
  }

  const handleLearnMore = () => {
    router.push('/about')
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const cardHover = {
    hover: { scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }
  }

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(135deg, #e6f0fa 0%, #f5f5f5 100%)',
        minHeight: '100vh',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
          animation: 'pulse 10s infinite'
        }}
      />
      <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative' }}>
        {/* Hero Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, color: '#1a3c34', mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}
            className="font-serif"
          >
            Malaria Diagnosis System
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#4b5e5a', mb: 5, maxWidth: '800px', mx: 'auto', fontSize: { xs: '1rem', md: '1.3rem' } }}
            className="font-sans"
          >
            Revolutionize malaria detection with our AI-powered platform. Upload blood smear images for fast, accurate diagnostics with cutting-edge deep learning.
          </Typography>
          <Box sx={{ mt: 4, mb: 6, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleLoginRedirect}
              sx={{
                bgcolor: '#00695c',
                color: 'white',
                px: 6,
                py: 1.5,
                fontSize: '1.2rem',
                borderRadius: '50px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#00897b', transform: 'scale(1.05)', transition: 'all 0.3s' }
              }}
              className="shadow-lg"
            >
              Get Started → Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleLearnMore}
              sx={{
                borderColor: '#00695c',
                color: '#00695c',
                px: 4,
                py: 1.5,
                fontSize: '1.2rem',
                borderRadius: '50px',
                textTransform: 'none',
                '&:hover': { borderColor: '#00897b', color: '#00897b', backgroundColor: '#e6f0fa' }
              }}
              className="shadow-md"
            >
              Learn More
            </Button>
          </Box>
          {/* Hero Image */}
          <Box sx={{ mt: 4, mb: 8 }}>
            <Image
              src="/malaria_analysis.webp"
              alt="Malaria Diagnosis Illustration"
              width={700}
              height={450}
              className="mx-auto rounded-xl shadow-2xl"
              priority
              onError={() => console.log('Image failed to load')}
            />
          </Box>
        </motion.div>

        {/* Features Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a3c34', mb: 5 }} className="font-serif">
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <motion.div whileHover="hover" variants={cardHover}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    bgcolor: '#ffffff',
                    border: '1px solid #e6f0fa',
                    transition: 'all 0.3s'
                  }}
                  className="shadow-md"
                >
                  <AutoFixHighIcon sx={{ fontSize: 40, color: '#00695c', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a3c34', mb: 2 }}>
                    Automated Screening
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4b5e5a' }}>
                    Upload blood smear images for instant detection of parasitized cells with 93%+ accuracy using our AI model.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <motion.div whileHover="hover" variants={cardHover}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    bgcolor: '#ffffff',
                    border: '1px solid #e6f0fa',
                    transition: 'all 0.3s'
                  }}
                  className="shadow-md"
                >
                  <PeopleIcon sx={{ fontSize: 40, color: '#00695c', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a3c34', mb: 2 }}>
                    Patient Management
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4b5e5a' }}>
                    Securely track patient records, past screenings, and treatment outcomes in an intuitive dashboard.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <motion.div whileHover="hover" variants={cardHover}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    bgcolor: '#ffffff',
                    border: '1px solid #e6f0fa',
                    transition: 'all 0.3s'
                  }}
                  className="shadow-md"
                >
                  <BarChartIcon sx={{ fontSize: 40, color: '#00695c', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a3c34', mb: 2 }}>
                    Real-Time Analytics
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4b5e5a' }}>
                    Visualize infection trends and screening stats for informed decision-making with real-time reports.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Footer */}
        <Box sx={{ mt: 10, py: 4, bgcolor: '#1a3c34', borderRadius: '16px' }}>
          <Typography variant="body2" sx={{ color: '#e6f0fa', mb: 2 }}>
            © {new Date().getFullYear()} Malaria Diagnosis System. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Button sx={{ color: '#e6f0fa', textTransform: 'none' }} onClick={() => router.push('/about')}>
              About
            </Button>
            <Button sx={{ color: '#e6f0fa', textTransform: 'none' }} onClick={() => router.push('/contact')}>
              Contact
            </Button>
            <Button sx={{ color: '#e6f0fa', textTransform: 'none' }} onClick={() => router.push('/privacy')}>
              Privacy Policy
            </Button>
          </Box>
        </Box>
      </Container>

      {/* CSS for background animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.15;
          }
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
        }
      `}</style>
    </Box>
  )
}