import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchWord, setSearchWord, placeholder }) => {
  return (
    <TextField
      label="بحث"
      value={searchWord}
      onChange={(e) => setSearchWord(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
