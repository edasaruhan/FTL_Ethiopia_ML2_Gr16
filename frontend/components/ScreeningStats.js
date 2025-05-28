'use client'
import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export default function ScreeningStats() {
  // Add to the useQuery options
const { data, isLoading, error } = useQuery({
  queryKey: ['screening-stats'],
  queryFn: () => api.get('/analytics/dashboard/').then(res => res.data),
  onError: (err) => console.error('Failed to fetch stats:', err),
})

// Add error display
if (error) {
  return (
    <Card>
      <CardContent>
        <Typography color="error">
          Failed to load statistics: {error.message}
        </Typography>
      </CardContent>
    </Card>
  )
}

  const stats = [
    { 
      title: 'Today\'s Screenings', 
      value: data?.today_cases || 0,
      color: 'primary.main'
    },
    { 
      title: 'Positive Cases', 
      value: data?.positive_rate ? `${(data.positive_rate * 100).toFixed(1)}%` : '0%',
      color: 'error.main'
    },
    { 
      title: 'Total Patients', 
      value: data?.total_patients || 0,
      color: 'success.main'
    },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Screening Overview
        </Typography>
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderLeft: `4px solid`, 
                  borderColor: stat.color,
                  backgroundColor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}