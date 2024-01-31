import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import './scroll.css';
import Opportunity from './Opportunity';
import AddOpportunityModal from './AddOpportunityModal';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 2.5px;
  width: 330px;
  height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background: #f8f8f8;
  padding: 12px;

  @media (max-width: 767px) {
    width: 100%;
    height: auto;
  }
`;

const Title = styled.div`
  text-align: center;
  display: flex;
  padding: 16px 8px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  color: #000;
  font-size: 1rem;
  font-style: bold;
  font-weight: 500;
  line-height: normal;

  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

const AddOpportunityContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default function Column({ title, tasks }) {
  const [isAddOpportunityModalOpen, toggleAddOpportunityModalOpen] =
    useState(false);
  const { doctors, patients, loading } = useContext(AppContext);
  const { t } = useTranslation();

  const handleOpenAddOpportunityModal = () => {
    toggleAddOpportunityModalOpen(true);
  };

  const handleCloseAddOpportunityModal = () => {
    toggleAddOpportunityModalOpen(false);
  };

  return (
    <Container disableGutters>
      <div
        style={{
          height: '10%',
        }}
      >
        <AddOpportunityContainer>
          <Title>
            {title} {`(${tasks.length})`}
          </Title>
          {title === t('Leads') && (
            <Button
              variant="contained"
              onClick={handleOpenAddOpportunityModal}
              size="small"
              style={{
                margin: '10px',
                borderRadius: '20px',
                fontSize: '1.2vh',
              }}
            >
              {[t('Add'), t('Opportunity')].join(' ')}
            </Button>
          )}
        </AddOpportunityContainer>
      </div>
      {!loading && isAddOpportunityModalOpen && (
        <AddOpportunityModal
          isOpen={isAddOpportunityModalOpen}
          onClose={handleCloseAddOpportunityModal}
          isEdit={false}
          doctors={doctors}
          patients={patients}
        ></AddOpportunityModal>
      )}
      <div
        style={{
          overflowY: 'scroll',
          height: '90%',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          background: '#f1f1f1',
        }}
      >
        {!loading
          ? tasks.map((task) => (
              <div key={task?.id}>
                {task && Object.keys(task).length > 0 && (
                  <Opportunity
                    opportunity={task}
                    toggleAddOpportunityModalOpen={
                      toggleAddOpportunityModalOpen
                    }
                    doctors={doctors}
                    patients={patients}
                    isLoading={loading}
                  />
                )}
              </div>
            ))
          : null}
      </div>
    </Container>
  );
}
