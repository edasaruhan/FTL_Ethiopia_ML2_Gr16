import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Default mode (can switch to 'dark')
    primary: {
      main: '#1976d2', // Blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e', // Pink/Red
    },
    error: {
      main: '#f44336', // Red for errors
    },
    success: {
      main: '#4caf50', // Green for success
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff', // White for cards/paper
    },
    text: {
      primary: '#212121', // Dark gray for text
      secondary: '#757575', // Lighter gray
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Buttons won't be uppercase
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded cards
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;