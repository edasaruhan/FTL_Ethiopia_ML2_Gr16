//  app/dashboard/layout.js

'use client'
import { useState } from 'react'
import { Box, CssBaseline, Fab, Toolbar } from '@mui/material'
import { Chat as ChatIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import MalariaChatbotDialog from '@/components/MalariaChatbotDialog'
import ProtectedRoute from '@/components/ProtectedRoute'

const drawerWidth = 240

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const toggleChatbot = () => {
    setIsChatbotOpen(prev => !prev)
  }

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <CssBaseline />
        <Navbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            overflowX: 'auto'
          }}
        >
          <Toolbar />
          {children}

          {/* Blinking Floating Button */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1200 }}
          >
            <Fab
              color="primary"
              onClick={toggleChatbot}
              sx={{ bgcolor: '#00695c', '&:hover': { bgcolor: '#004d40' } }}
              aria-label="Toggle malaria chatbot"
            >
              <ChatIcon sx={{ color: '#e6f0fa' }} />
            </Fab>
          </motion.div>

          {/* Chatbot Dialog */}
          {isChatbotOpen && (
            <MalariaChatbotDialog open={isChatbotOpen} onClose={toggleChatbot} />
          )}
        </Box>
      </Box>
    </ProtectedRoute>
  )
}
