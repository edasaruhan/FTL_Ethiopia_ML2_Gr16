// app/dashboard/patients/[id]/page.js
'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useParams } from 'next/navigation'
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Grid, Avatar, Card, CardContent } from '@mui/material'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function PatientDetailPage() {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => api.get(`/patients/${id}/`).then(res => res.data),
  })

  const { data: screeningsData, isLoading: screeningsLoading } = useQuery({
    queryKey: ['screenings', id],
    queryFn: () => api.get(`/screenings/screenings/?patient=${id}`).then(res => res.data),
  })

  if (isLoading) return <Typography sx={{ p: 3 }}>Loading patient details...</Typography>
  if (error) return <Typography color="error" sx={{ p: 3 }}>Failed to load patient.</Typography>

  return (
    <ProtectedRoute>
      <Box sx={{ p: 3, width: '100%' }}>
        <Grid container spacing={3}>
          {/* Patient Details */}
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {data.first_name} {data.last_name}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Gender: {data.gender === 'M' ? 'Male' : 'Female'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Birth Date: {new Date(data.birth_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Address: {data.address}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Phone: {data.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Record Created At: {new Date(data.created_at).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>

          {/* Screening Records */}
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Screening Records
              </Typography>

              {screeningsLoading ? (
                <Typography>Loading screenings...</Typography>
              ) : screeningsData?.length > 0 ? (
                <List>
                  {screeningsData.map((screening) => (
                    <ListItem key={screening.id} sx={{ mb: 2 }}>
                      <Card variant="outlined" sx={{ display: 'flex', width: '100%' }}>
                        <Avatar
                          variant="rounded"
                          src={screening.image}
                          alt="Screening Image"
                          sx={{ width: 100, height: 100, mr: 2 }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                          <Typography variant="h6" component="div">
                            Result: {screening.result === 'P' ? 'Positive' : 'Negative'} ({(screening.confidence * 100).toFixed(1)}% confidence)
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            Parasite Count: {screening.parasite_count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Notes: {screening.notes || 'No notes provided'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Date: {new Date(screening.created_at).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No screenings available for this patient.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  )
}