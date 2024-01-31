import React, { useContext, useState } from 'react';
import {
  Typography,
  CardContent,
  Card,
  Avatar,
  CardHeader,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import styled from 'styled-components';
import { Edit, SkipNext } from '@mui/icons-material';
import { updateOpportunity } from '../services/api';
import AddOpportunityModal from './AddOpportunityModal';
import { AppContext } from '../context/AppContext';

const CardHeaderStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Opportunity = ({ opportunity, doctors, patients, isLoading }) => {
  const [isEditOpportunityModalOpen, toggleEditOpportunityModalOpen] =
    useState(false);
  const { opportunities, setOpportunities } = useContext(AppContext);

  const handleChangeStage = async () => {
    let updatedStage = [];
    const currentDateTime = new Date().toUTCString();
    const lastStage =
      opportunity.stage_history[opportunity.stage_history.length - 1];
    const lastStageKey = Object.keys(lastStage)[0];
    if (lastStageKey === 'Lead') {
      updatedStage = [
        ...opportunity.stage_history,
        {
          Qualified: currentDateTime,
        },
      ];
    } else if (lastStageKey === 'Qualified') {
      updatedStage = [
        ...opportunity.stage_history,
        {
          Booked: currentDateTime,
        },
      ];
    } else if (lastStageKey === 'Booked') {
      updatedStage = [
        ...opportunity.stage_history,
        {
          Treated: currentDateTime,
        },
      ];
    } else if (lastStageKey === 'Treated') {
      return;
    }
    const editedOpp = await updateOpportunity({
      ...opportunity,
      stage_history: updatedStage,
    });
    const index = opportunities.findIndex(
      (opp) => opp.id === editedOpp.opportunity.id,
    );
    const newOpps = [...opportunities];
    newOpps[index] = editedOpp.opportunity;
    setOpportunities([...newOpps]);
  };

  const handleClickEdit = () => {
    toggleEditOpportunityModalOpen(true);
  };

  const handleCloseEdit = async () => {
    toggleEditOpportunityModalOpen(false);
  };
  return (
    <div
      style={{
        marginBottom: '1rem',
      }}
    >
      <Card sx={{ borderRadius: '6px', border: '1px solid #C4C4C4' }}>
        <CardHeaderStyle>
          <div>
            <CardHeader
              avatar={
                <Avatar
                  alt={opportunity?.patient?.name}
                  src={opportunity?.patient?.avatar?.url}
                  sx={{ width: 36, height: 36 }}
                />
              }
            />
          </div>
          <div>
            <Typography fontSize={14}>
              {' '}
              {(opportunity?.doctor?.first_name || '') +
                ' ' +
                (opportunity?.doctor?.last_name || '')}
            </Typography>
            <Typography fontSize={12} color="#4D4D4D">
              {opportunity?.patient?.gender + ', ' + opportunity?.patient?.age}
            </Typography>
          </div>
        </CardHeaderStyle>
        <CardContent sx={{ backgroundColor: '#C8E5FC' }}>
          <Grid container spacing={7}>
            <Grid item xs={9}>
              <Typography
                sx={{ fontSize: '14px', fontWeight: 'font-weight: 400;' }}
                gutterBottom
              >
                {opportunity?.procedure_name}
              </Typography>
              <Typography
                sx={{ fontSize: '14px', fontWeight: 'font-weight: 400;' }}
                gutterBottom
              >
                {(opportunity?.doctor?.first_name || '') +
                  ' ' +
                  (opportunity?.doctor?.last_name || '')}
              </Typography>
              {opportunity?.stage_history?.map((stage, index) => (
                <div key={index}>
                  {Object.entries(stage).map(([key, value]) => (
                    <Typography key={key} variant="body2" color="textSecondary">
                      {key}: {value}
                    </Typography>
                  ))}
                </div>
              ))}
            </Grid>
            <Grid item xs={3}>
              <Box
                flexDirection={'column'}
                display={'flex'}
                justifyContent="center"
              >
                <Avatar
                  alt={opportunity?.doctor?.name}
                  src={opportunity?.doctor?.avatar?.url}
                  sx={{ width: 30, height: 30 }}
                />
                <IconButton onClick={handleChangeStage}>
                  <SkipNext fontSize="large" />
                </IconButton>
                <IconButton onClick={handleClickEdit}>
                  <Edit fontSize="medium" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {!isLoading && opportunity && isEditOpportunityModalOpen ? (
        <AddOpportunityModal
          isOpen={isEditOpportunityModalOpen}
          onClose={handleCloseEdit}
          isEdit={true}
          opportunity={opportunity}
          doctors={doctors}
          patients={patients}
        ></AddOpportunityModal>
      ) : null}
    </div>
  );
};

export default Opportunity;
