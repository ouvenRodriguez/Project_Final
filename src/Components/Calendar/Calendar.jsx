import React from "react";
import { Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const Calendar = ({ startDate, endDate, onDateChange }) => {
  // Obtener la fecha actual en formato DD/MM/YYYY
  const today = dayjs().format("DD/MM/YYYY");
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2, flex: 2 }}>
        <TextField
          label="Fecha de inicio"
          value={today}
          InputProps={{
            readOnly: true,
          }}
          required
          fullWidth
        />
        <DatePicker
          label="Fecha de fin"
          value={endDate}
          onChange={(date) => onDateChange('endDate', date)}
          format="DD/MM/YYYY"
          minDate={dayjs()}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Calendar;
