import React from 'react';
import TextField from '@mui/material/TextField';

const DateTimePicker = ({ value, onChange }) => {
  return (
    <TextField
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

export default DateTimePicker;
