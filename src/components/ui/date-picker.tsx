'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  value,
  onChange,
}) => {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      className="w-full border rounded px-3 py-2"
      placeholderText="Chọn ngày"
    />
  );
};
