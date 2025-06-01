//  components/Sidebar.js

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import AssessmentIcon from '@mui/icons-material/Assessment'
import Link from 'next/link'

const drawerWidth = 240

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        <Link href="/dashboard" passHref legacyBehavior>
          <ListItem button component="a">
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Patients" />
          </ListItem>
        </Link>

        <Link href="/dashboard/screenings" passHref legacyBehavior>
          <ListItem button component="a">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Screenings" />
          </ListItem>
        </Link>
      </List>
    </>
  )

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  )
}
