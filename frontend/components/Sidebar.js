import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export default function Sidebar() {
  return (
    <Drawer variant="permanent">
      <List>
        <ListItem button>
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary="Patients" />
        </ListItem>
      </List>
    </Drawer>
  );
}