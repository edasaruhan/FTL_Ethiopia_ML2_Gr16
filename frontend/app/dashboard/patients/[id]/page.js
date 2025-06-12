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
  Paper,
} from '@mui/material'
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

  if (isLoading) return <Typography sx={{ p: 3 }}>Loading patient details...</Typography>
  if (error) return <Typography color="error" sx={{ p: 3 }}>Failed to load patient.</Typography>

  return (
    <ProtectedRoute>
      <Box sx={{ p: 3, width: '100%' }}>
        <Grid container spacing={3}>
          {/* Patient Details Card */}
          <Grid item xs={12}>
            <Card elevation={6} sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {data.first_name} {data.last_name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {data.gender === 'M' ? 'Male' : 'Female'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Birth Date:</strong> {new Date(data.birth_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {data.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Address:</strong> {data.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Record Created At: {new Date(data.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Screening Records Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Screening Records
            </Typography>
            <Grid container spacing={3}>
              {screeningsLoading ? (
                <Typography sx={{ p: 2 }}>Loading screenings...</Typography>
              ) : screeningsData?.length > 0 ? (
                screeningsData.map((screening) => (
                  <Grid item xs={12} sm={6} md={4} key={screening.id}>
                    <Card elevation={4} sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={screening.image}
                        alt="Screening"
                      />
                      <CardContent>
                        <Box sx={{ mb: 1 }}>
                          <Chip
                            label={screening.result === 'P' ? 'Positive' : 'Negative'}
                            color={screening.result === 'P' ? 'error' : 'success'}
                            size="small"
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {screening.confidence ? `${(screening.confidence * 100).toFixed(1)}% confidence` : ''}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          <strong>Parasite Count:</strong> {screening.parasite_count}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Notes:</strong> {screening.notes || 'No notes provided'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Date: {new Date(screening.created_at).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography sx={{ p: 2 }}>No screenings available for this patient.</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  )
}
