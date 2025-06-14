'use client'
import { useState } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Typography
} from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import ChatIcon from '@mui/icons-material/Chat'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/dashboard/patients' },
    { text: 'Screenings', icon: <HealthAndSafetyIcon />, path: '/dashboard/screenings' },
    { text: 'Malaria Chatbot', icon: <ChatIcon />, path: '/dashboard/chatbot' },
  ]

  const drawerContent = (
    <Box sx={{ bgcolor: '#1a3c34', height: '100%', color: '#e6f0fa' }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{ color: '#e6f0fa', fontWeight: 700 }}
          className="font-serif"
        >
          Malaria Dashboard
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: '#00695c' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(item.path)
                setMobileOpen(false)
              }}
              sx={{
                bgcolor: pathname === item.path ? '#00695c' : 'transparent',
                color: pathname === item.path ? '#e6f0fa' : '#b2dfdb',
                '&:hover': {
                  bgcolor: '#00695c',
                  color: '#e6f0fa',
                  transform: 'translateX(5px)',
                  transition: 'all 0.3s'
                },
                py: 1.5,
                px: 3
              }}
              className="font-sans"
              aria-label={`Navigate to ${item.text}`}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Open sidebar"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ display: { sm: 'none' }, color: '#00695c', m: 1 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 240, bgcolor: '#1a3c34' }
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: 240,
            bgcolor: '#1a3c34',
            borderRight: '1px solid #00695c'
          }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  )
}