//import { ThemeOptions } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors'
import createTheme from '@mui/material/styles/createTheme'

const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#101c6b',
      dark: '#1a2d6b',
      light: '#2a378c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0595a2',
    },
    pecondary: 'primary.contrastText',
    text: {
      primary: 'rgba(14,35,65,0.78)',
      secondary: 'rgba(29,29,203,0.6)',
      disabled: 'rgba(84,84,84,0.38)',
      error: '#b00020',
    },
    background: {
      default: '#c0cff3',
      paper: '#e7eaf7',
      drawer: deepPurple[900],
      drawerPaper: deepPurple[400],
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a2d6b',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          color: 'yellow',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: '40408c',
          color: 'white',
        },
      },
    },

    /*  MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#a02020',
          color: 'white',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          color: '#101010',
        },
      },
    },*/

    MuiDialogContentText: {
      styleOverrides: {
        root: {
          paddingTop: '15px',
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        padding: '10px',
        color: '#3030a0',
      },
    },
  },
}

// '#1a2d6b',
export default createTheme(themeOptions)
