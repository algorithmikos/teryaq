import React, { useState } from "react";
import "./CorrectionDose.css";
import { Grid, Typography, TextField, Button, Chip } from "@mui/material";
import { useSelector } from "react-redux";
import { unitGrammar } from "../../components/grammar";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { randomCorrectionDoseImg } from "./doseImg";

const CorrectionDose = () => {
  const patient = useSelector((state) => state.patient);
  const [currentMeasurement, setCurrentMeasurement] = useState("");
  const [wantedMeasurement, setWantedMeasurement] = useState("");

  const doses =
    Number(patient.breakfastDose) +
    Number(patient.lunchDose) +
    Number(patient.dinnerDose) +
    Number(patient.organizerDose);

  const correctionCoefficient = patient.correctionCoefficient || 1700 / doses;

  return (
    <Grid container spacing={4} direction="column">
      <Grid item>
        <h2>جرعة التصحيح</h2>
        <Typography variant="h6" className="section-title">
          أدخل القياسات
        </Typography>
        <Grid
          container
          spacing={2}
          className="doses-container"
          direction="column"
          alignItems="flex-start"
        >
          <Grid item xs={12} lg={4}>
            <TextField
              label="القياس الحالي"
              variant="outlined"
              fullWidth
              value={currentMeasurement}
              onChange={(e) => setCurrentMeasurement(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TextField
              label="القياس المطلوب"
              variant="outlined"
              fullWidth
              value={wantedMeasurement}
              onChange={(e) => setWantedMeasurement(e.target.value)}
              type="number"
            />
          </Grid>
        </Grid>
      </Grid>

      {currentMeasurement && wantedMeasurement && (
        <Grid item xl={6} container direction="column" gap={1}>
          <Chip
            className="dose-chip"
            icon={<VaccinesIcon />}
            label={unitGrammar(
              Math.round(
                (currentMeasurement - wantedMeasurement) / correctionCoefficient
              )
            )}
            variant="outlined"
            sx={{ maxWidth: 200 }}
          />

          <img src={randomCorrectionDoseImg} width={200} style={{ borderRadius: 5 }} />
        </Grid>
      )}
    </Grid>
  );
};

export default CorrectionDose;
