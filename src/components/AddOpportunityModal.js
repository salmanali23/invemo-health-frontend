import { useContext } from 'react';
import { useFormik } from 'formik';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Modal from 'react-modal';
import * as Yup from 'yup';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  FormHelperText,
} from '@mui/material';
import { createOpportunities, updateOpportunity } from '../services/api';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const ModalTitle = styled.div`
  color: #000;
  font-size: 22px;
  font-weight: 600;
`;

const ModalHead = styled.div`
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const AddOpportunityModal = ({
  isOpen,
  onClose,
  isEdit,
  opportunity,
  doctors,
  patients,
}) => {
  const { opportunities, setOpportunities } = useContext(AppContext);
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      procedureName: opportunity?.procedure_name,
      selectedPatient: opportunity?.patient?.id,
      selectedDoctor: opportunity?.doctor?.id,
    },
    validationSchema: Yup.object({
      procedureName: Yup.string().required(
        [t('Procedure Name'), t('is required')].join(' '),
      ),
      selectedPatient: Yup.string().required(
        [t('Patient'), t('is required')].join(' '),
      ),
      selectedDoctor: Yup.string().required(
        [t('Doctor'), t('is required')].join(' '),
      ),
    }),
    onSubmit: async (values) => {
      try {
        let payload = {
          id: opportunity?.id,
          procedure_name: values.procedureName,
          patient_id: values.selectedPatient,
          doctor_id: values.selectedDoctor,
          stage_history: values.stageHistory,
        };
        if (isEdit) {
          const editedOpp = await updateOpportunity(payload);
          const index = opportunities.findIndex(
            (opp) => opp.id === editedOpp.opportunity.id,
          );
          const newOpps = [...opportunities];
          newOpps[index] = editedOpp.opportunity;
          setOpportunities([...newOpps]);
        } else {
          payload = {
            ...payload,
            stage_history: [{ Lead: new Date().toUTCString() }],
          };
          const newOpp = await createOpportunities(payload);
          setOpportunities((old) => [...old, newOpp.opportunity]);
        }
        onClose();
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onClose();
        formik.resetForm();
      }}
      ariaHideApp={false}
      contentLabel="Select Doctor and Patient Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          width: '80%',
          maxWidth: '400px',
          padding: '20px',
          margin: '0 auto',
          height: 'fit-content',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <ModalHead>
        <ModalTitle>
          {isEdit
            ? [t('Edit'), t('Opportunity')].join(' ')
            : [t('Add'), t('Opportunity')].join(' ')}
        </ModalTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </ModalHead>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <TextField
            label={t('Procedure Name')}
            name="procedureName"
            fullWidth
            style={{ marginBottom: '20px' }}
            value={formik.values.procedureName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.procedureName &&
              Boolean(formik.errors.procedureName)
            }
            helperText={
              formik.touched.procedureName && formik.errors.procedureName
            }
          />
        </div>
        <div>
          <FormControl
            fullWidth
            error={
              formik.touched.selectedDoctor &&
              Boolean(formik.errors.selectedDoctor)
            }
          >
            <InputLabel id="selectedDoctorLabel">
              {[t('Select'), t('Doctor')].join(' ')}
            </InputLabel>
            <Select
              labelId="selectedDoctorLabel"
              name="selectedDoctor"
              label={[t('Select'), t('Doctor')].join(' ')}
              style={{ width: '100%', marginBottom: '20px' }}
              value={formik.values.selectedDoctor}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.first_name} {doctor.last_name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.selectedDoctor && formik.errors.selectedDoctor ? (
                <div style={{ color: 'red' }}>
                  {formik.errors.selectedDoctor}
                </div>
              ) : null}
            </FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl
            fullWidth
            error={
              formik.touched.selectedPatient &&
              Boolean(formik.errors.selectedPatient)
            }
          >
            <InputLabel id="selectedPatientLabel">
              {[t('Select'), t('Patient')].join(' ')}
            </InputLabel>
            <Select
              labelId="selectedPatientLabel"
              name="selectedPatient"
              label={[t('Select'), t('Patient')].join(' ')}
              style={{ width: '100%' }}
              value={formik.values.selectedPatient}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.selectedPatient &&
              formik.errors.selectedPatient ? (
                <div style={{ color: 'red' }}>
                  {formik.errors.selectedPatient}
                </div>
              ) : null}
            </FormHelperText>
          </FormControl>
        </div>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          style={{
            borderRadius: '16px',
            border: '#FFF',
            background: '#2196F3',
            color: 'white',
            marginTop: '20px',
            width: '100%',
          }}
        >
          {t('Save')}
        </Button>
      </form>
    </Modal>
  );
};

export default AddOpportunityModal;
