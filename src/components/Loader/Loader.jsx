import React from "react";
import "./Loader.css";
import { Grid, Typography } from "@mui/material";

const Loader = ({ text }) => {
  return (
    <Grid container alignItems="center" justifyContent="center" gap={1}>
      <Grid item>
        <img src="/potion.png" className="loader-img-animation" />
      </Grid>
      <Grid>
        <Typography variant="body1" className="loader-text">{text}</Typography>
      </Grid>
    </Grid>
  );
};

export default Loader;
