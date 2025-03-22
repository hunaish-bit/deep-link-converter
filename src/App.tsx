import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DeepLinkConverter from './components/DeepLinkConverter';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DeepLinkConverter />
    </ThemeProvider>
  );
}

export default App;
