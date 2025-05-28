//  app/dashboard/layout.js

'use client'
import { useState } from 'react'
import { Box, CssBaseline, Toolbar } from '@mui/material'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px:10,
          width: { sm: `calc(100% - 240px)` },
          mt: '64px', // height of navbar
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
