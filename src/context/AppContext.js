import React, { useState, createContext, useEffect } from 'react';
import {
  getMemberDoctors,
  getMemberPatients,
  searchOpportunity,
} from '../services/api';

export const AppContext = createContext();
function AppContextProvider({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doctorsData = await getMemberDoctors();
        const patientsData = await getMemberPatients();
        const opportunitiesData = await searchOpportunity('');

        setDoctors([...doctorsData]);
        setPatients([...patientsData]);
        setOpportunities([...opportunitiesData]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        doctors,
        setDoctors,
        patients,
        setPatients,
        opportunities,
        setOpportunities,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export default AppContextProvider;
