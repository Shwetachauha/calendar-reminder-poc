"use client";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface SearchBarProps {
  search: string;
  date: string;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export const SearchBar = ({ search, date, onSearchChange, onDateChange }: SearchBarProps) => {
  return (
    <Box className="grid gap-3 md:grid-cols-3">
      <TextField
        fullWidth
        value={search}
        label="Search title or description"
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <TextField
        fullWidth
        type="date"
        label="Filter by date"
        value={date}
        onChange={(event) => onDateChange(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </Box>
  );
};
