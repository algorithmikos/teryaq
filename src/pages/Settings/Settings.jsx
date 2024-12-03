import React, { useEffect, useState } from "react";
import "./Settings.css";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, FormControlLabel, Switch, Typography } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, setUser } from "../../rtk/slices/patient-slice";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { userData } from "../../utils/userData";

const Settings = () => {
  const dispatch = useDispatch();

  const patient = useSelector((state) => state.patient);

  const [formData, setFormData] = useState({
    breakfastDose: "",
    lunchDose: "",
    dinnerDose: "",
    organizerDose: "",
    organizerDoseTime: "",
    carpCoefficient: "",
    correctionCoefficient: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(setUser())
      .then((res) => {
        const patientUser = res.payload.userData;
        setFormData({
          breakfastDose: patientUser.breakfastDose,
          lunchDose: patientUser.lunchDose,
          dinnerDose: patientUser.dinnerDose,
          organizerDose: patientUser.organizerDose,
          organizerDoseTime: patientUser.organizerDoseTime,
          carpCoefficient: patientUser.carpCoefficient,
          correctionCoefficient: patientUser.correctionCoefficient,
        });
      })
      .then(() => {
        setIsLoading(false);
      });
  }, []);

  const {
    breakfastDose,
    lunchDose,
    dinnerDose,
    organizerDose,
    organizerDoseTime,
    carpCoefficient,
    correctionCoefficient,
  } = formData;

  const [customCarp, setCustomCarp] = useState(false);
  const [customCorrection, setCustomCorrection] = useState(false);

  const [isClicked, setIsClicked] = useState(false);

  const handleSave = async () => {
    try {
      setIsClicked(true);
      const userDocRef = doc(db, "users", patient.id);
      const updatedFormData = {
        ...formData,
        breakfastDose: Number(formData.breakfastDose) || 0,
        lunchDose: Number(formData.lunchDose) || 0,
        dinnerDose: Number(formData.dinnerDose) || 0,
        organizerDose: Number(formData.organizerDose) || 0,
        organizerDoseTime: formData.organizerDoseTime || "",
        carpCoefficient: Number(formData.carpCoefficient) || 0,
        correctionCoefficient: Number(formData.correctionCoefficient) || 0,
      };

      await toast.promise(updateDoc(userDocRef, updatedFormData), {
        pending: "جار حفظ الإعدادات",
        success: "تم حفظ الإعدادات",
        error: "حدث خطأ أثناء حفظ الإعدادات",
      });

      dispatch(fetchUser());
      setIsClicked(false);
    } catch (error) {
      setIsClicked(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "permission-denied") {
        toast.error(
          "انتهت صلاحية هذه الجلسة من فضلك سجل الخروج من لسان معلومات ثم أعد تسجيل الدخول لبدء جلسة جديدة"
        );
      }
      console.error("Saving Error:", errorCode, errorMessage);
    }
  };

  const [formChanged, setFormChanged] = useState(false);
  const isFormChanged = () => {
    return (
      formData.breakfastDose !== patient.breakfastDose ||
      formData.lunchDose !== patient.lunchDose ||
      formData.dinnerDose !== patient.dinnerDose ||
      formData.organizerDose !== patient.organizerDose ||
      formData.organizerDoseTime !== patient.organizerDoseTime ||
      (customCarp && formData.carpCoefficient !== patient.carpCoefficient) ||
      (customCorrection &&
        formData.correctionCoefficient !== patient.correctionCoefficient)
    );
  };

  useEffect(() => {
    setFormChanged(isFormChanged());
  }, [formData]);

  return !isLoading ? (
    <Grid container spacing={2} direction="column">
      <h2>الإعدادات</h2>
      <Typography variant="h6" className="section-title">
        الجرعات
      </Typography>
      <Grid
        container
        spacing={2}
        className="doses-container"
        direction="column"
        alignItems="flex-start"
      >
        <Grid item xs={12} lg={4} xl={6}>
          <TextField
            label="جرعة الإفطار"
            variant="outlined"
            fullWidth
            value={breakfastDose}
            onChange={(e) =>
              setFormData({
                ...formData,
                breakfastDose: e.target.value,
              })
            }
            type="number"
          />
        </Grid>

        <Grid item xs={12} lg={4} xl={6}>
          <TextField
            label="جرعة الغداء"
            variant="outlined"
            fullWidth
            value={lunchDose}
            onChange={(e) =>
              setFormData({
                ...formData,
                lunchDose: e.target.value,
              })
            }
            type="number"
          />
        </Grid>

        <Grid item xs={12} lg={4} xl={6}>
          <TextField
            label="جرعة العشاء"
            variant="outlined"
            fullWidth
            value={dinnerDose}
            onChange={(e) =>
              setFormData({
                ...formData,
                dinnerDose: e.target.value,
              })
            }
            type="number"
          />
        </Grid>

        <Grid item xs={12} lg={4} xl={6}>
          <TextField
            label="جرعة المنظم"
            variant="outlined"
            fullWidth
            value={organizerDose}
            onChange={(e) =>
              setFormData({
                ...formData,
                organizerDose: e.target.value,
              })
            }
            type="number"
          />
        </Grid>

        <Grid item xs={12} lg={4} xl={6}>
          <TextField
            label="وقت جرعة المنظم"
            variant="outlined"
            fullWidth
            sx={{ minWidth: 187 }}
            value={organizerDoseTime}
            onChange={(e) =>
              setFormData({
                ...formData,
                organizerDoseTime: e.target.value + ":00",
              })
            }
            type="time"
          />
        </Grid>

        <FormControlLabel
          control={<Switch />}
          label="معامل كارب مخصص"
          value={customCarp}
          onChange={() => {
            setCustomCarp(!customCarp);
          }}
          sx={{ mt: 2 }}
        />
        {customCarp && (
          <Grid item xs={12} lg={4}>
            <TextField
              label="معامل الكارب"
              variant="outlined"
              fullWidth
              value={carpCoefficient}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  carpCoefficient: e.target.value,
                })
              }
              type="number"
            />
          </Grid>
        )}

        <FormControlLabel
          control={<Switch />}
          label="معامل تصحيح مخصص"
          value={customCorrection}
          onChange={() => {
            setCustomCorrection(!customCorrection);
          }}
          sx={{ mt: 2 }}
        />
        {customCorrection && (
          <Grid item xs={12} lg={4}>
            <TextField
              label="معامل الحساسية"
              variant="outlined"
              fullWidth
              value={correctionCoefficient}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  correctionCoefficient: e.target.value,
                })
              }
              type="number"
            />
          </Grid>
        )}

        <Grid item>
          {isClicked ? (
            <Loader text="جار الحفظ..." />
          ) : (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              className="fw-300"
              disabled={!formChanged}
              onClick={handleSave}
            >
              احفظ الإعدادات
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Loader text="جار تحميل بيانات المستخدم..." />
  );
};

export default Settings;
