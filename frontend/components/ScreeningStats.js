// components/ScreeningStats.js
'use client'
import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
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
      const duration = 1500 // Smoother animation
      const steps = 50 // More steps for fluidity
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  if (isLoading) {
    return (
      <Typography
        variant="body1"
        sx={{ color: '#4b5e5a', textAlign: 'center' }}
        className="font-sans"
      >
        Loading statistics...
      </Typography>
    )
  }

  if (error) {
    return (
      <Typography
        color="error"
        variant="body1"
        sx={{ bgcolor: '#ffebee', p: 2, borderRadius: '8px', textAlign: 'center' }}
        className="font-sans"
      >
        Failed to load statistics: {error.message}
      </Typography>
    )
  }

  const stats = [
    {
      title: "Today's Screenings",
      value: animatedCounts.today_cases || 0,
      color: '#00695c', // Teal for consistency
    },
    {
      title: 'Positive Rate',
      value:
        animatedCounts.positive_rate !== undefined
          ? `${(animatedCounts.positive_rate * 100).toFixed(1)}%`
          : '0%',
      color: '#d32f2f', // Red for emphasis
    },
    {
      title: 'Total Patients',
      value: animatedCounts.total_patients || 0,
      color: '#2e7d32', // Green for success
    },
  ]

  const weeklyData = data?.weekly_trend || { dates: [], counts: [] }

  const chartData = {
    labels: weeklyData.dates,
    datasets: [
      {
        label: 'Daily Screenings',
        data: weeklyData.counts,
        backgroundColor: weeklyData.counts.map((count, idx, arr) =>
          idx > 0 && count > arr[idx - 1] ? '#2e7d32' : '#00695c'
        ),
        borderColor: '#e6f0fa',
        borderWidth: 1,
        borderRadius: 8, // Rounded bars
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Weekly Screening Trend',
        font: { size: 18, family: 'serif' },
        color: '#1a3c34',
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: '#1a3c34',
        titleColor: '#e6f0fa',
        bodyColor: '#e6f0fa',
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#4b5e5a' } },
      y: { grid: { color: '#e6f0fa' }, ticks: { color: '#4b5e5a' } },
    },
    animation: {
      duration: 1000,
    },
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: '#1a3c34', mb: 3, fontSize: { xs: '1.5rem', sm: '1.8rem' } }}
        className="font-serif"
      >
        Screening Statistics
      </Typography>
      <Grid container spacing={3} alignItems="stretch">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Card
                elevation={6}
                sx={{
                  borderLeft: 6,
                  borderColor: stat.color,
                  height: '100%',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
                }}
                className="shadow-md"
                aria-label={`${stat.title}: ${stat.value}`}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: '#4b5e5a', mb: 1 }}
                    className="font-sans"
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: stat.color, fontWeight: 600 }}
                    className="font-sans"
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
        <Grid item xs={12}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card
              elevation={6}
              sx={{
                height: 300,
                p: 3,
                borderRadius: '12px',
                bgcolor: '#ffffff',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
              }}
              className="shadow-md"
              aria-label="Weekly screening trend chart"
            >
              <Bar data={chartData} options={chartOptions} />
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  )
}