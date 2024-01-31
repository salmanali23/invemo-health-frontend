import React from 'react';
import PatientBoard from './components/PatientBoard';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import AppContextProvider from './context/AppContext';


function App() {
  return (
    <AppContextProvider>
      <Container maxWidth={false} disableGutters>
        <CssBaseline />
        <PatientBoard />
      </Container>
    </AppContextProvider>
  );
}

export default App;
