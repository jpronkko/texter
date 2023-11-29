//import { ThemeOptions } from '@mui/material/styles';
import { deepPurple, grey, /* lightBlue,*/ pink } from '@mui/material/colors'
import createTheme from '@mui/material/styles/createTheme'

const darkBlue = '#101c6b'
const darkerBlue = '#0b1550'
const lightBlue = '#f1f4fa' //'#1a2d6b'
const nearWhite = '#fafbff'

const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: darkBlue,
      dark: darkerBlue,
      light: '#2a378c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#304ddf',
      light: lightBlue, //'#8095ff',
    },
    text: {
      primary: darkBlue, //'rgba(14,35,65,0.78)',
      secondary: darkerBlue, //'rgba(29,29,203,0.6)',
      disabled: grey[300], //'rgba(84,84,84,0.38)',
      error: pink.A700, //'#b00020',
    },
    background: {
      default: nearWhite, // grey[50], //'#c0cff3',
      paper: grey.A100,
      drawer: deepPurple[900],
      drawerPaper: deepPurple[400],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '2px',
          borderRadius: '8px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#101c6b',
          color: 'white',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          /* color: darkBlue, */
          marginTop: 12,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          '&[role="menu"]': {
            backgroundColor: deepPurple[900],
            color: 'white',
          },
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        padding: '10px',
        backgroundColor: deepPurple[900],
      },
    },
  },
}

// '#1a2d6b',
export default createTheme(themeOptions)
