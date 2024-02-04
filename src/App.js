import React from 'react';
import PatientBoard from './components/PatientBoard';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import AppContextProvider from './context/AppContext';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

function App() {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <Container maxWidth={false} disableGutters>
          <CssBaseline />
          <PatientBoard />
        </Container>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
