import React from "react";
import "./Footer.css";
import { Box, Grid } from "@mui/material";

const Footer = ({ className }) => {
  return (
    <Grid
      container
      className={`${className} footer-links`}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item className="footer-right">
        أشرفت على تنفيذه{" "}
        <a href="https://www.instagram.com/memo2_187/" target="_blank">
          مرح بنت خالد
        </a>
        <br />
        (أخصائية التغذية العلاجية)
      </Grid>

      <Grid item className="footer-left">
        صممه وطوره{" "}
        <a href="https://umarfayiz-ar.pages.dev/" target="_blank">
          عمر بن فايز
        </a>
      </Grid>
    </Grid>
  );
};

export default Footer;
