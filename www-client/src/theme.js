import { deepPurple, grey, pink } from '@mui/material/colors'
import createTheme from '@mui/material/styles/createTheme'

const darkBlue = '#101c6b'
const darkerBlue = '#0b1550'
const lightBlue = '#f1f4fa'
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
      light: lightBlue,
    },
    text: {
      primary: darkBlue,
      secondary: darkerBlue,
      disabled: grey[300],
      error: pink.A700,
    },
    background: {
      default: nearWhite,
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

export default createTheme(themeOptions)
