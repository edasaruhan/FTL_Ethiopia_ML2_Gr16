//  app/dashboard/layout.js

'use client'
import { useState } from 'react'
import { Box, CssBaseline, Toolbar } from '@mui/material'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const drawerWidth = 240

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // account for sidebar
          ml: { sm: `${drawerWidth}px` }, // shift main to the right
        }}
      >
        <Toolbar /> {/* push content below navbar */}
        {children}
      </Box>
    </Box>
  )
}
