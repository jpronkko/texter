//import { ThemeOptions } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme'

const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#141a41',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#1f2029',
      paper: '#404467',
    },
    text: {
      primary: 'rgba(255,240,240,0.87)',
    },
  },
}

export default createTheme(themeOptions)
