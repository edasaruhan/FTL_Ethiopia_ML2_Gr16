//  components/Navbar.js
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function Navbar({ onDrawerToggle }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }} // only show on mobile
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Malaria Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
