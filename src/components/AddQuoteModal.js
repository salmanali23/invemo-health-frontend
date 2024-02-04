import React, { useContext } from 'react';
import { useFormik } from 'formik';
import {
  Modal,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { AppContext } from '../context/AppContext';
// import { addQuote } from './api';

const AddQuoteModal = ({ visible, onClose }) => {
  const { opportunities } = useContext(AppContext);

  const formik = useFormik({
    initialValues: {
      opportunityId: '',
      amount: '',
      date: '',
    },
    onSubmit: async (values) => {
      try {
        // await addQuote(values); //todo
        onClose();
      } catch (error) {
        console.error('Error adding quote:', error);
      }
    },
  });

  return (
    <Modal
      open={visible}
      onClose={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
          padding: 20,
          width: 400,
        }}
      >
        <h2>Add Quote</h2>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="opportunity-label">Opportunity</InputLabel>
            <Select
              labelId="opportunity-label"
              id="opportunityId"
              value={formik.values.opportunityId}
              onChange={(e) =>
                formik.setFieldValue('opportunityId', e.target.value)
              }
            >
              {opportunities.map((opportunity) => (
                <MenuItem key={opportunity.id} value={opportunity.id}>
                  {opportunity.procedure_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Amount"
              id="amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Date"
              id="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            color="primary"
            style={{ marginLeft: 10 }}
          >
            Cancel
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AddQuoteModal;
