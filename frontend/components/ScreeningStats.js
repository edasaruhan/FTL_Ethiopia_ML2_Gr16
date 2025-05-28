// components/ScreeningStats.js
'use client'
import { Card, CardContent, Typography, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export default function ScreeningStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['screening-stats'],
    queryFn: () => api.get('/analytics/dashboard/').then(res => res.data),
    onError: (err) => console.error('Failed to fetch stats:', err),
  })

  if (error) {
    return (
      <Typography color="error" variant="body1">
        Failed to load statistics: {error.message}
      </Typography>
    )
  }

  const stats = [
    {
      title: "Today's Screenings",
      value: data?.today_cases || 0,
      color: 'primary.main'
    },
    {
      title: 'Positive Rate',
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
    <Grid container spacing={4}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            elevation={6}
            sx={{
              borderLeft: 6,
              borderColor: stat.color,
              height: 150,               // taller card
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',  // center content vertically
              p: 2,                      // extra padding
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {stat.title}
              </Typography>
              <Typography variant="h3" sx={{ color: stat.color }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
