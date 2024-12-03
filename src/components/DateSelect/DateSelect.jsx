import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ar";

const DateSelect = ({ label, value, onChange }) => {
  dayjs.locale("ar");
  function calculateMinDate() {
    // Get the current date
    const currentDate = new Date();

    // Calculate the date 14 years ago
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 14);

    // If the person is already 14, set the minimum date to the beginning of the current year
    if (currentDate >= minDate) {
      minDate.setMonth(0, 1); // Set to January 1st of the current year
    }

    return minDate;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} locale="ar">
      <DatePicker
        label={label}
        value={value}
        onChange={(date) => onChange(date.$d.toISOString())}
        maxDate={dayjs(calculateMinDate().toISOString().slice(0, 10))}
      />
    </LocalizationProvider>
  );
};

export default DateSelect;
