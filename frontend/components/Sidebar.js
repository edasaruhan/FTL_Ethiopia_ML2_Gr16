//  components/Sidebar.js

'use client'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'
import Link from 'next/link'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import PeopleIcon from '@mui/icons-material/People'
import AssessmentIcon from '@mui/icons-material/Assessment'

const drawerWidth = 240

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  // Animation variants
  const drawerVariants = {
    open: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    closed: { x: -drawerWidth, opacity: 0, transition: { duration: 0.3 } }
  }

  const itemVariants = {
    hover: { scale: 1.05, backgroundColor: '#e6f0fa', transition: { duration: 0.2 } }
  }

  const drawerContent = (
    <>
      <Toolbar sx={{ bgcolor: '#00695c', color: '#e6f0fa', display: 'flex', alignItems: 'center', gap: 1 }}>
        <HealthAndSafetyIcon sx={{ fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: '1.2rem' }}
          className="font-serif"
        >
          Malaria Diagnosis
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#e6f0fa' }} />
      <List sx={{ p: 1 }}>
        <Link href="/dashboard" passHref legacyBehavior>
          <motion.div whileHover="hover" variants={itemVariants}>
            <ListItem
              button
              component="a"
              sx={{
                borderRadius: '8px',
                mb: 1,
                color: '#1a3c34',
                '&:hover': { color: '#00695c' }
              }}
              aria-label="Patients page"
              className="font-sans"
            >
              <ListItemIcon sx={{ color: '#00695c', minWidth: 40 }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Patients" primaryTypographyProps={{ fontSize: '1rem' }} />
            </ListItem>
          </motion.div>
        </Link>
        <Link href="/dashboard/screenings" passHref legacyBehavior>
          <motion.div whileHover="hover" variants={itemVariants}>
            <ListItem
              button
              component="a"
              sx={{
                borderRadius: '8px',
                mb: 1,
                color: '#1a3c34',
                '&:hover': { color: '#00695c' }
              }}
              aria-label="Screenings page"
              className="font-sans"
            >
              <ListItemIcon sx={{ color: '#00695c', minWidth: 40 }}>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Screenings" primaryTypographyProps={{ fontSize: '1rem' }} />
            </ListItem>
          </motion.div>
        </Link>
      </List>
    </>
  )

  return (
    <>
      {/* Mobile Drawer */}
      <motion.div
        variants={drawerVariants}
        animate={mobileOpen ? 'open' : 'closed'}
        initial="closed"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#ffffff',
              borderRight: '1px solid #e6f0fa'
            }
          }}
          className="shadow-md"
        >
          {drawerContent}
        </Drawer>
      </motion.div>

      {/* Desktop Drawer */}
      <motion.div
        variants={drawerVariants}
        initial="open"
        animate="open"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#ffffff',
              borderRight: '1px solid #e6f0fa'
            }
          }}
          open
          className="shadow-md"
        >
          {drawerContent}
        </Drawer>
      </motion.div>
    </>
  )
}