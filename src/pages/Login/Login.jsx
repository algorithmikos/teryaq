import React, { useEffect, useState } from "react";
import "./Login.css";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleLogin, toggleSignup } from "../../rtk/slices/auth-slice";
import Signup from "../Signup/Signup";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import { auth, db } from "../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import WavingHandIcon from "@mui/icons-material/WavingHand";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SignupMountState = useSelector((state) => state.auth.isSigningUp);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [cookies, setCookies] = useCookies("access_token");

  const sampleDate = {
    firstname: "عمر",
    lastname: "فايز",
    breakfastDose: 15,
    lunchDose: 15,
    dinnerDose: 15,
    organizerDose: 22,
    organizerDoseTime: "20:00:00.000Z",
  };

  const [isClicked, setIsClicked] = useState(false);

  const handleLogin = async () => {
    setIsClicked(true);

    const queryByUsername = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const queryByEmail = query(
      collection(db, "users"),
      where("email", "==", username)
    );

    const [queryByUsernameSnapshot, queryByEmailSnapshot] = await Promise.all([
      getDocs(queryByUsername),
      getDocs(queryByEmail),
    ]);

    let email;
    let user;

    if (!queryByUsernameSnapshot.empty) {
      // User found by username
      email = queryByUsernameSnapshot.docs[0].data().email;
      user = queryByUsernameSnapshot.docs[0].data();
    } else if (!queryByEmailSnapshot.empty) {
      // User found by email
      email = queryByEmailSnapshot.docs[0].data().email;
      user = queryByEmailSnapshot.docs[0].data();
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        toast.success(`مرحبا ${user.firstname}`, {
          icon: (
            <WavingHandIcon
              style={{ color: "green", transform: "scaleX(-1)" }}
            />
          ),
        });
        setIsClicked(false);
        // Signed in
        const userCredentials = userCredential.user;
        // console.log(userCredentials);
        setCookies("access_token", userCredentials.accessToken);
        window.localStorage.setItem("UserId", userCredentials.uid);

        // Exclude the 'password' key
        const userWithoutSensitiveData = { id: userCredentials.uid, ...user };
        delete userWithoutSensitiveData.password;

        // Convert the modified 'user' object to a JSON string
        const userString = JSON.stringify(userWithoutSensitiveData);
        window.localStorage.setItem("UserData", userString);

        dispatch(toggleLogin());
        navigate("/eating-dose");
      })
      .catch((error) => {
        setIsClicked(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        if (errorCode === "auth/missing-email") {
          toast.error("لا يوجد حساب بهذا المعرف أو البريد");
        } else if (errorCode === "auth/invalid-credential") {
          toast.error("ثمة خطأ في المعرف / البريد أو مفتاح المرور");
        }
      });
  };

  return (
    <>
      <Header />
      {!SignupMountState ? (
        <Grid
          container
          gap={2}
          justifyContent="center"
          alignItems="center"
          lg={4}
          sx={{ margin: "auto", mt: 10 }}
        >
          <Grid item>
            <Typography variant="h4" sx={{ mb: 2 }}>
              تسجيل الدخول
            </Typography>
          </Grid>

          {/* Logging in with ID & password */}
          <Grid item xs={12} lg={12}>
            <TextField
              className="ltr-input-field"
              label="المعرف / البريد"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().trimEnd())
              }
              type="text"
            />
          </Grid>

          <Grid item xs={12} lg={12}>
            <TextField
              className="ltr-input-field"
              label="مفتاح المرور"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </Grid>
          <Grid item xs={12} lg={12} sx={{ textAlign: "center" }}>
            {isClicked ? (
              <Loader text="جار تسجيل الدخول" />
            ) : (
              <Button
                variant="contained"
                className="fw-300"
                onClick={handleLogin}
                size="large"
              >
                سجل الدخول
              </Button>
            )}
          </Grid>
          {/* End of logging in with ID & password */}

          <Grid item>
            <Typography variant="body1">
              ليس لديك حساب؟
              <Button onClick={() => dispatch(toggleSignup())}>
                أنشأ حسابا جديدا
              </Button>
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Signup />
      )}
    </>
  );
};

export default Login;
