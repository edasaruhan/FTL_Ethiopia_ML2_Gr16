//  components/Navbar.js
'use client'
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import { motion } from 'framer-motion'
import MenuIcon from '@mui/icons-material/Menu'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'

export default function Navbar({ mobileOpen, handleDrawerToggle }) {
  // Animation variants
  const appBarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      variants={appBarVariants}
      initial="hidden"
      animate="visible"
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#00695c',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e6f0fa'
        }}
        className="shadow-lg"
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: 'none' },
                color: '#e6f0fa',
                '&:hover': { bgcolor: '#00897b', transform: 'scale(1.1)', transition: 'all 0.3s' }
              }}
              aria-label="Toggle sidebar"
            >
              <MenuIcon />
            </IconButton>
            <HealthAndSafetyIcon sx={{ fontSize: 32, color: '#e6f0fa' }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 700, color: '#e6f0fa', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              className="font-serif"
            >
              Malaria Diagnosis
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  )
}