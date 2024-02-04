import React from 'react';
import TextField from '@mui/material/TextField';

const DateTimePicker = ({ value, onChange, patientAge, doctorAge }) => {
  const currentDate = new Date().toISOString().slice(0, 16);
  return (
    <TextField
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        min: '1900-01-01T00:00',
        max: currentDate,
      }}
    />
  );
};

export default DateTimePicker;
