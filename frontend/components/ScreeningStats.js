// components/ScreeningStats.js
'use client'
import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import api from '@/lib/api'
import { useEffect, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ScreeningStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['screening-stats'],
    queryFn: () => api.get('/analytics/dashboard/').then(res => res.data),
    onError: (err) => console.error('Failed to fetch stats:', err),
  })

  const [animatedCounts, setAnimatedCounts] = useState({
    today_cases: 0,
    positive_rate: 0,
    total_patients: 0,
  })

  // Animate counters
  useEffect(() => {
    if (data) {
      const duration = 1000
      const steps = 30
      const interval = duration / steps
      let currentStep = 0

      const start = {
        today_cases: 0,
        positive_rate: 0,
        total_patients: 0,
      }

      const increments = {
        today_cases: (data.today_cases - start.today_cases) / steps,
        positive_rate: (data.positive_rate - start.positive_rate) / steps,
        total_patients: (data.total_patients - start.total_patients) / steps,
      }

      const animate = setInterval(() => {
        currentStep++
        setAnimatedCounts((prev) => ({
          today_cases: Math.round(prev.today_cases + increments.today_cases),
          positive_rate: prev.positive_rate + increments.positive_rate,
          total_patients: Math.round(prev.total_patients + increments.total_patients),
        }))

        if (currentStep >= steps) {
          clearInterval(animate)
          setAnimatedCounts({
            today_cases: data.today_cases,
            positive_rate: data.positive_rate,
            total_patients: data.total_patients,
          })
        }
      }, interval)
    }
  }, [data])

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
      value: animatedCounts.today_cases || 0,
      color: 'primary.main',
    },
    {
      title: 'Positive Rate',
      value:
        animatedCounts.positive_rate !== undefined
          ? `${(animatedCounts.positive_rate * 100).toFixed(1)}%`
          : '0%',
      color: 'error.main',
    },
    {
      title: 'Total Patients',
      value: animatedCounts.total_patients || 0,
      color: 'success.main',
    },
  ]

  const weeklyData = data?.weekly_trend || { dates: [], counts: [] }

  const colors = weeklyData.counts.map((count, idx, arr) =>
    idx > 0 && count > arr[idx - 1] ? 'green' : 'red'
  )

  const chartData = {
    labels: weeklyData.dates,
    datasets: [
      {
        label: 'Daily Screenings',
        data: weeklyData.counts,
        backgroundColor: colors,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Weekly Screening Trend',
        font: { size: 18 },
      },
    },
    animation: {
      duration: 1000,
    },
  }
return (
  <Box>
    <Grid container spacing={3} alignItems="stretch">
      {/* Stat Cards - 3 cards × 2 columns = 6 columns */}
      {stats.map((stat, index) => (
        <Grid item xs={12} md={2} key={index}>
          <Card
            elevation={6}
            sx={{
              borderLeft: 6,
              borderColor: stat.color,
              height: 220,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 2,
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

      {/* Chart Card - spans 6 columns */}
      <Grid item xs={12} md={6}>
        <Card elevation={4} sx={{ height: 220, p: 2,width: '100%' }}>
          <Bar data={chartData} options={chartOptions} />
        </Card>
      </Grid>
    </Grid>
  </Box>
)



}
