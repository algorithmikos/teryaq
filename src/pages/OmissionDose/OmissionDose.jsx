import React, { useEffect } from "react";
import "./OmissionDose.css";
import { Grid, Alert, AlertTitle } from "@mui/material";
import { useSelector } from "react-redux";
import { unitGrammar } from "../../components/grammar";

const OmissionDose = () => {
  const patient = useSelector((state) => state.patient);
  const yesterday = () => {
    // Get the current date
    var today = new Date();

    // Subtract one day
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Format the date in ISO format
    var yesterdayISO = yesterday.toISOString();

    // Reassign yesterday time
    let yesterdayDoseTime = yesterdayISO.split("T");
    yesterdayDoseTime[1] = patient.organizerDoseTime;
    yesterdayDoseTime = new Date(
      `${yesterdayDoseTime[0]}T${yesterdayDoseTime[1]}`
    );

    return yesterdayDoseTime;
  };

  const diffBetweenDates = () => {
    const startDate = yesterday();
    const endDate = new Date(); // Current date and time

    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;

    // Convert milliseconds to seconds
    const secondsDifference = timeDifference / 1000;

    // Convert seconds to minutes
    const minutesDifference = secondsDifference / 60;

    // Convert minutes to hours
    const hoursDifference = minutesDifference / 60;

    // Convert hours to days
    const daysDifference = hoursDifference / 24;

    return hoursDifference;
  };

  const hourPortion = patient.organizerDose / 24;

  useEffect(() => {
    console.log(patient);
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} lg={4}>
        <h2>الجرعة التعويضية للمنظم</h2>
        <Alert severity="info" className="info-callout">
          <AlertTitle>هل نسيت جرعة المنظم؟</AlertTitle>
          في حالة نسيان جرعة المنظم بالأمس يمكنك أخذ{" "}
          <span style={{ fontWeight: "bold", fontSize: 15 }}>
            {unitGrammar(Math.round((24 - diffBetweenDates()) * hourPortion))}
          </span>{" "}
          الآن.
        </Alert>
      </Grid>
    </Grid>
  );
};

export default OmissionDose;
