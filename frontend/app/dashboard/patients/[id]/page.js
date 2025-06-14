// app/dashboard/patients/[id]/page.js
'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useParams } from 'next/navigation'
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function PatientDetailPage() {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => api.get(`/patients/${id}/`).then(res => res.data),
  })

  const { data: screeningsData, isLoading: screeningsLoading } = useQuery({
    queryKey: ['screenings', id],
    queryFn: () => api.get(`/screenings/screenings/patient/${id}/`).then(res => res.data),
  })

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{ color: '#4b5e5a' }}
          className="font-sans"
          aria-label="Loading patient details"
        >
          Loading patient details...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
        <Typography
          color="error"
          variant="body1"
          sx={{ bgcolor: '#ffebee', p: 2, borderRadius: '8px' }}
          className="font-sans"
          aria-label="Error loading patient"
        >
          Failed to load patient: {error.message}
        </Typography>
      </Box>
    )
  }

  return (
    <ProtectedRoute>
      <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
        <Grid container spacing={3}>
          {/* Patient Details Card */}
          <Grid item xs={12}>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Card
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  border: '1px solid #e6f0fa',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
                }}
                className="shadow-md"
                aria-label={`Details for ${data.first_name} ${data.last_name}`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ bgcolor: '#00695c', width: 60, height: 60, mr: 2 }}
                    className="font-sans"
                  >
                    {data.first_name[0]}{data.last_name[0]}
                  </Avatar>
                  <Typography
                    variant="h4"
                    sx={{ color: '#1a3c34', fontWeight: 700 }}
                    className="font-serif"
                  >
                    {data.first_name} {data.last_name}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{ color: '#4b5e5a', mb: 1 }}
                      className="font-sans"
                    >
                      <strong>Gender:</strong> {data.gender === 'M' ? 'Male' : data.gender === 'F' ? 'Female' : 'Other'}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#4b5e5a', mb: 1 }}
                      className="font-sans"
                    >
                      <strong>Birth Date:</strong> {new Date(data.birth_date).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#4b5e5a' }}
                      className="font-sans"
                    >
                      <strong>Phone:</strong> {data.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{ color: '#4b5e5a', mb: 1 }}
                      className="font-sans"
                    >
                      <strong>Address:</strong> {data.address}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#6b7280' }}
                      className="font-sans"
                    >
                      Record Created At: {new Date(data.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>
          </Grid>

          {/* Screening Records Section */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#1a3c34', mb: 3, fontSize: { xs: '1.5rem', sm: '1.8rem' } }}
              className="font-serif"
              aria-label="Screening records"
            >
              Screening Records
            </Typography>
            <Grid container spacing={3} sx={{ width: '100%' }}>
              {screeningsLoading ? (
                <Typography
                  sx={{ p: 2, color: '#4b5e5a' }}
                  className="font-sans"
                  aria-label="Loading screenings"
                >
                  Loading screenings...
                </Typography>
              ) : screeningsData?.length > 0 ? (
                screeningsData.map((screening) => (
                  <Grid item xs={12} sm={6} md={4} key={screening.id}>
                    <motion.div variants={cardVariants} initial="hidden" animate="visible">
                      <Card
                        elevation={6}
                        sx={{
                          height: '100%',
                          borderRadius: '12px',
                          bgcolor: '#ffffff',
                          border: '1px solid #e6f0fa',
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
                        }}
                        className="shadow-md"
                        aria-label={`Screening record from ${new Date(screening.created_at).toLocaleString()}`}
                      >
                        <CardMedia
                          component="img"
                          height="180"
                          image={screening.image || '/placeholder-image.png'}
                          alt="Screening image"
                          sx={{ objectFit: 'cover', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                        />
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={screening.result === 'P' ? 'Positive' : 'Negative'}
                              color={screening.result === 'P' ? 'error' : 'success'}
                              size="small"
                              sx={{
                                bgcolor: screening.result === 'P' ? '#d32f2f' : '#2e7d32',
                                color: '#ffffff',
                                fontWeight: 600
                              }}
                              className="font-sans"
                              aria-label={`Result: ${screening.result === 'P' ? 'Positive' : 'Negative'}`}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: '#4b5e5a' }}
                              className="font-sans"
                            >
                              {screening.confidence ? `${(screening.confidence * 100).toFixed(1)}% confidence` : ''}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ color: '#4b5e5a', mb: 1 }}
                            className="font-sans"
                          >
                            <strong>Parasite Count:</strong> {screening.parasite_count}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: '#4b5e5a', mb: 1 }}
                            className="font-sans"
                          >
                            <strong>Notes:</strong> {screening.notes || 'No notes provided'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6b7280', display: 'block' }}
                            className="font-sans"
                          >
                            Date: {new Date(screening.created_at).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))
              ) : (
                <Typography
                  sx={{ p: 2, color: '#4b5e5a' }}
                  className="font-sans"
                  aria-label="No screenings available"
                >
                  No screenings available for this patient.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  )
}