import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Column from './Column';
import AddMemberModal from './AddMemberModal';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';

const SubHeader = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 767px) {
    padding: 10px;
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  column-gap: 15px;
  height: 80vh;

  @media (max-width: 767px) {
    flex-direction: column;
    height: auto;
  }
`;

export default function PatientBoard() {
  const [isAddMemberModalOpen, toggleAddMemberModalOpen] = useState(false);
  const [lead, setLead] = useState([]);
  const [qualified, setQualified] = useState([]);
  const [booked, setBooked] = useState([]);
  const [treated, setTreated] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { opportunities, loading } = React.useContext(AppContext);
  const { t } = useTranslation();

  const handleOpenAddMember = () => {
    toggleAddMemberModalOpen(true);
  };

  const handleCloseAddMemberModal = () => {
    toggleAddMemberModalOpen(false);
  };

  const handleSearchChange = useCallback(
    async (searchText) => {
      try {
        const filteredLeads = [];
        const filteredQualified = [];
        const filteredBooked = [];
        const filteredTreated = [];

        const filtertext = searchText.trim().toLowerCase();
        const filteredOpportunites = opportunities.filter((opp) => {
          return (
            opp.procedure_name.toLowerCase().includes(filtertext) ||
            [
              opp.doctor.first_name.toLowerCase(),
              opp.doctor.last_name.toLowerCase(),
            ]
              .join(' ')
              .includes(filtertext) ||
            [
              opp.patient.first_name.toLowerCase(),
              opp.patient.last_name.toLowerCase(),
            ]
              .join(' ')
              .includes(filtertext)
          );
        });

        filteredOpportunites.forEach((data) => {
          const stages = data?.stage_history;
          if (stages) {
            const lastStage = stages[stages.length - 1];
            const lastStageKey = Object.keys(lastStage)[0];
            if (lastStageKey === 'Lead') {
              filteredLeads.push(data);
            } else if (lastStageKey === 'Qualified') {
              filteredQualified.push(data);
            } else if (lastStageKey === 'Booked') {
              filteredBooked.push(data);
            } else if (lastStageKey === 'Treated') {
              filteredTreated.push(data);
            }
          }
        });
        setLead([...filteredLeads]);
        setQualified([...filteredQualified]);
        setBooked([...filteredBooked]);
        setTreated([...filteredTreated]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    [opportunities],
  );

  useEffect(() => {
    if (!loading) {
      handleSearchChange('');
    }
  }, [loading, opportunities, handleSearchChange]);

  useEffect(() => {
    handleSearchChange(searchValue);
  }, [searchValue, handleSearchChange]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: 'white' }}>
        <Toolbar style={{ color: 'black' }}>
          <img
            src="pulse-icon.svg"
            alt="Icon"
            style={{ marginRight: '10px' }}
          />
          <span style={{ fontSize: '1.2em', color: 'black' }}>Pulse</span>
        </Toolbar>
      </AppBar>
      <SubHeader>
        <Typography fontSize={22} fontWeight={600}>
          {t('Patients')}
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={handleOpenAddMember}
            style={{ margin: '10px', borderRadius: '20px' }}
          >
            {[t('Add'), t('Member')].join(' ')}
          </Button>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              inputProps: {
                autoComplete: 'off',
                type: 'text',
              },
            }}
            value={searchValue}
            autoFocus
            type="text"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',

                legend: {
                  marginLeft: '30px',
                },
              },
              '& .MuiAutocomplete-inputRoot': {
                paddingLeft: '20px !important',
                borderRadius: '50px',
              },
              '& .MuiInputLabel-outlined': {
                paddingLeft: '20px',
              },
              '& .MuiInputLabel-shrink': {
                marginLeft: '20px',
                paddingLeft: '10px',
                paddingRight: 0,
                background: 'white',
              },
              width: 500,
              maxWidth: '100%',
            }}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            placeholder={t('Search')}
          />
        </div>
      </SubHeader>
      {isAddMemberModalOpen && (
        <AddMemberModal
          isVisible={isAddMemberModalOpen}
          onClose={handleCloseAddMemberModal}
        />
      )}
      {!loading ? (
        <ColumnsContainer>
          <Column title={t('Leads')} tasks={lead} />
          <Column title={t('Qualified')} tasks={qualified} />
          <Column title={t('Booked')} tasks={booked} />
          <Column title={t('Treated')} tasks={treated} />
        </ColumnsContainer>
      ) : (
        <Loader />
      )}
    </>
  );
}
