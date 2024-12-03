import React from "react";
import { Button, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  return (
    <div
      style={{
        color: "white",
        backgroundColor: "var(--main-color)",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        height: 64,
        display: "flex",
      }}
    >
      <IconButton
        color="inherit"
        edge="end"
        sx={{
          marginLeft: 5, // Adjusted from marginRight to marginLeft
          ...(open && { display: "none" }),
        }}
      >
        <MenuIcon />
      </IconButton>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        // sx={{ mr: 13 }}
      >
        <img src="/potion.png" className="nav-icon" />
        <Typography variant="h5" noWrap component="div">
          ترياق
        </Typography>
      </Grid>
    </div>
  );
};

export default Header;
