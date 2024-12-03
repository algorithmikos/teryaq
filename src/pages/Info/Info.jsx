import React, { useState } from "react";
import "./Info.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Grid,
  Tooltip,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";
import { toggleLogin } from "../../rtk/slices/auth-slice";
import CopyrightIcon from "@mui/icons-material/Copyright";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Loader from "../../components/Loader/Loader";
import { version } from "../../utils/version";
import { freeUserImport } from "../../utils/user/importMyItems";
import { freeUserExport } from "../../utils/user/exportMyItems";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import InsightsIcon from "@mui/icons-material/Insights";

const Info = () => {
  const dispatch = useDispatch();
  const [cookies, setCookies] = useCookies("access_token");
  const [myItems, setMyItems] = useState([]);

  const patient = useSelector((state) => state.patient);

  const doses =
    Number(patient.breakfastDose) +
    Number(patient.lunchDose) +
    Number(patient.dinnerDose) +
    Number(patient.organizerDose);

  const carpCoefficient = patient.carpCoefficient || (500 / doses).toFixed(2);
  const correctionCoefficient =
    patient.correctionCoefficient || (1700 / doses).toFixed(2);

  const handleLogout = () => {
    dispatch(toggleLogin());
    setCookies("access_token", "");
    window.localStorage.removeItem("UserId");
    window.localStorage.removeItem("UserData");

    toast.promise(signOut(auth), {
      pending: "جار تسجيل الخروج",
      success: "عسى أن نراك قريبا!",
      error:
        "حدث خطأ أثناء تسجيل الخروج. إنك لطيف لدرجة أن التطبيق لا يريد أن يفارقك",
    });
  };

  return (
    <>
      {/* ##### Page Title / Welcoming Sentence ##### */}
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Typography variant="h4" className="section-title">
            مرحبا {patient.firstname}!
          </Typography>
        </Grid>
      </Grid>
      {/* ##### End of Page Title / Welcoming Sentence ##### */}

      {/* ##### INFORMATION SECTION ##### */}

      {/* INFORMATION Heading Title */}
      <Divider sx={{ fontSize: 25, mt: 3, mb: 3 }}>معلومات</Divider>
      {/* INFORMATION Items */}
      <Grid container spacing={1} direction="column">
        <Grid item container gap={1} alignItems="center">
          <li>معامل الكارب لديك:</li>
          <Chip
            className="info-chip"
            icon={<FastfoodIcon />}
            label={carpCoefficient}
            variant="outlined"
          />
        </Grid>

        <Grid item container gap={1} alignItems="center">
          <li>ومعامل التصحيح:</li>
          <Chip
            className="info-chip"
            icon={<InsightsIcon />}
            label={correctionCoefficient}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* ##### End of INFORMATION SECTION ##### */}

      {/* ##### ACTIONS SECTION ##### */}

      {/* ACTIONS Heading Title */}
      <Divider sx={{ fontSize: 25, mt: 5, mb: 3 }}>إجراءات</Divider>
      {/* ACTIONS Items */}
      <Grid
        container
        spacing={1}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{ backgroundColor: "var(--main-color)", width: 209 }}
            onClick={() => {
              freeUserImport();
            }}
          >
            استيراد أصنافي
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 209 }}
            onClick={freeUserExport}
          >
            تصدير أصنافي
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={freeUserExport}
            sx={{ width: 209 }}
          >
            تفريغ قاعدة البيانات المحلية
          </Button>
        </Grid>
      </Grid>

      {/* ##### End of ACTIONS SECTION ##### */}

      {/* ##### SESSION SECTION ##### */}

      {/* SESSION Heading Title */}
      <Divider sx={{ fontSize: 25, mt: 5, mb: 3 }}>الجلسة</Divider>
      {/* SESSION Items */}
      <Grid container spacing={1} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ width: 209 }}
          >
            تسجيل الخروج
          </Button>
        </Grid>
      </Grid>

      {/* ##### End of SESSION SECTION ##### */}

      {/* ##### FOOTER CARD SECTION ##### */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 15 }}
      >
        <Card className="copyrights-card">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item container justifyContent="center" alignItems="center">
              <Grid item>
                <Loader />
              </Grid>
              <Grid item>
                <Typography variant="h5">ترياق</Typography>
              </Grid>
            </Grid>

            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <NewReleasesIcon />
              </Grid>
              <Grid item>الإصدار {version}</Grid>
            </Grid>

            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <MedicalInformationIcon />
              </Grid>
              <Grid item>
                أشرفت عليه{" "}
                <Tooltip title="أخصائية التغذية العلاجية" arrow placement="top">
                  <a
                    href="https://www.instagram.com/memo2_187/"
                    target="_blank"
                  >
                    مرح بنت خالد
                  </a>
                </Tooltip>
              </Grid>
            </Grid>

            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <CopyrightIcon />
              </Grid>
              <Grid item>
                صممه وطوره{" "}
                <a href="https://umarfayiz-ar.pages.dev/" target="_blank">
                  عمر بن فايز
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {/* ##### End of FOOTER CARD SECTION ##### */}
    </>
  );
};

export default Info;
