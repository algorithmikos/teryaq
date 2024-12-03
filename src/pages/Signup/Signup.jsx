import React, { useEffect, useState } from "react";
import "./Signup.css";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleSignup, toggleLogin } from "../../rtk/slices/auth-slice";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import DateSelect from "../../components/DateSelect/DateSelect";
import { hashString } from "../../auth/passwordHashing";
import { countries } from "../../components/countries";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

import { fetchGuide } from "../../rtk/slices/guide-slice";

const Login = () => {
  const dispatch = useDispatch();

  const checkUsernameAvailability = async (username) => {
    const usersCollection = collection(db, "users");
    const usernameQuery = query(
      usersCollection,
      where("username", "==", username)
    );

    const querySnapshot = await getDocs(usernameQuery);
    return querySnapshot.empty;
  };

  const checkEmailAvailability = async (email) => {
    const usersCollection = collection(db, "users");
    const emailQuery = query(usersCollection, where("email", "==", email));

    const querySnapshot = await getDocs(emailQuery);
    return querySnapshot.empty;
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordAgain: "",
    firstname: "",
    lastname: "",
    gender: "اختر",
    land: "اختر",
  });

  const {
    username,
    email,
    password,
    passwordAgain,
    firstname,
    lastname,
    gender,
    land,
  } = formData;

  const [age, setAge] = useState(null);

  const [cookies, setCookies] = useCookies("access_token");
  const [isClicked, setIsClicked] = useState(false);

  const handleCreateAccount = async () => {
    try {
      setIsClicked(true);

      if (/^[0-9]+$/.test(username)) {
        toast.error("يجب أن يحتوي اسم المعرف أحرفا إنكليزية");
        setIsClicked(false);
        return;
      } else if (!isNaN(username[0])) {
        toast.error("لا يمكن أن يبدأ اسم المعرف برقم");
        setIsClicked(false);
        return;
      } else if (username.length < 5) {
        toast.error("يجب أن يتكون اسم المعرف من 5 حروف على الأقل");
        setIsClicked(false);
        return;
      } else if (/\d/.test(firstname)) {
        toast.error("لا يمكن أن يحتوي اسمك على أرقام!");
        setIsClicked(false);
        return;
      } else if (/\d/.test(lastname)) {
        toast.error("لا يمكن أن يحتوي اسم العائلة على أرقام!");
        setIsClicked(false);
        return;
      }

      const isEmailValid = await checkEmailAvailability(email);
      const isUsernameValid = await checkUsernameAvailability(username);
      if (!isEmailValid || !isUsernameValid) {
        if (!isEmailValid) {
          toast.error("هذا البريد مسجل لدينا. هل لديك حساب من قبل؟");
          setIsClicked(false);
        } else if (!isUsernameValid) {
          toast.error("اسم المستخدم مأخوذ");
          setIsClicked(false);
        }
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Signed up
      const user = userCredential.user;
      console.log(user);

      const hashedPassword = await hashString(password);

      const userData = {
        username: username.trimEnd(),
        email: email.trimEnd(),
        password: hashedPassword,
        firstname: firstname.trimEnd(),
        lastname: lastname.trimEnd(),
        gender,
        age: age.slice(0, 10),
        land,
      };

      // Reference to the "users" collection
      const usersCollection = collection(db, "users");

      // Use the UID from authentication as the document ID
      const newUserDocRef = doc(usersCollection, user.uid);

      // Set data to the user's document
      await toast.promise(setDoc(newUserDocRef, userData), {
        pending: "جار إنشاء الحساب",
        success: `أهلا بك في ترياق يا ${firstname}!`,
        error: "ثمة خطأ في البيانات أو في اتصالك بالشابكة",
      });

      // Fetch the document snapshot using getDoc
      const userSnapshot = await getDoc(newUserDocRef);

      // Exclude the 'password' key
      const userWithoutSensitiveData = {
        id: userSnapshot.id,
        ...userSnapshot.data(),
      };
      delete userWithoutSensitiveData.password;

      // Convert the modified 'user' object to a JSON string
      const userString = JSON.stringify(userWithoutSensitiveData);
      window.localStorage.setItem("UserData", userString);

      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          setCookies("access_token", user.accessToken);
          window.localStorage.setItem("UserId", user.uid);
          dispatch(toggleLogin());
          dispatch(toggleSignup());
          navigate("/settings");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });

      toast("ابدأ بإدخال جرعاتك من الإنسولين لتتمكن من استعمال وظائف التطبيق");

      dispatch(fetchGuide());
    } catch (error) {
      setIsClicked(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Authentication Error:", errorCode, errorMessage);
    }
  };

  const capitalise = (inputString) => {
    let words = inputString.split(" ");
    let capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    let resultString = capitalizedWords.join(" ");
    return resultString;
  };

  const handleUsernameChange = (event) => {
    const newValue = event.target.value;

    if (/^[a-zA-Z0-9]+$/.test(newValue) || newValue === "") {
      setFormData({
        ...formData,
        username: newValue,
      });
    }
  };

  return (
    <Grid
      container
      // xs={12}
      lg={6}
      justifyContent="center"
      sx={{ margin: "auto", mt: 8 }}
    >
      {/* Page Title */}
      <Typography sx={{ mb: 3 }} variant="h4">
        إنشاء حساب
      </Typography>
      {/* End of Page Title */}

      {/* Form Section */}
      <Grid
        container
        spacing={2}
        className="login-container"
        alignItems="center"
      >
        {/* Username Field */}
        <Grid item xl={12} xs={12} className="username-container">
          <TextField
            className="ltr-input-field"
            label="المعرف"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) =>
              // setFormData({
              //   ...formData,
              //   username: e.target.value.toLowerCase().trimEnd(),
              // })
              handleUsernameChange(e)
            }
            type="text"
            placeholder={`أحرف رومية / "إنكليزية" فقط`}
            inputProps={{
              pattern: "^[a-zA-Z]+$",
              title: "Please enter only English letters.",
            }}
          />
        </Grid>
        {/* End of Username Field */}

        {/* E-Mail Field */}
        <Grid item xl={12} xs={12}>
          <TextField
            className="ltr-input-field username-container"
            label="البريد الإلكتروني"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value.toLowerCase() })
            }
            type="email"
          />
        </Grid>
        {/* End of E-Mail Field */}

        {/* Password Field(s) */}
        <Grid item xl={12} xs={6}>
          <TextField
            label="مفتاح المرور"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            type="password"
            placeholder="ليكن سهلا مذكورا"
            error={password.length !== 0 && password.length < 6}
            helperText={
              password.length !== 0 &&
              password.length < 6 &&
              "يجب أن يتكون من 6 أحرف بحد أدنى"
            }
          />
        </Grid>
        <Grid item xl={12} xs={6}>
          <TextField
            label="تأكيد المفتاح"
            variant="outlined"
            fullWidth
            value={passwordAgain}
            onChange={(e) =>
              setFormData({ ...formData, passwordAgain: e.target.value })
            }
            type="password"
            placeholder="أعد إدخال المفتاح"
            error={passwordAgain.length !== 0 && password !== passwordAgain}
            helperText={
              passwordAgain.length !== 0 &&
              password !== passwordAgain &&
              "المفتاحان غير متطابقان"
            }
          />
        </Grid>
        {/* End of Password Field(s) */}

        {/* First Name Field */}
        <Grid item xl={12} xs={6}>
          <TextField
            label="الاسم الأول"
            variant="outlined"
            fullWidth
            value={firstname}
            onChange={(e) =>
              setFormData({
                ...formData,
                firstname: capitalise(e.target.value),
              })
            }
            type="text"
            placeholder="اسمك"
            error={firstname.length !== 0 && firstname.length === 1}
            helperText={
              firstname.length != 0 &&
              firstname.length === 1 &&
              "لا يمكن أن يتكون الاسم من حرف واحد!"
            }
          />
        </Grid>
        {/* End of First Name Field */}

        {/* Last Name Field */}
        <Grid item xl={12} xs={6}>
          <TextField
            label="اسم العائلة"
            variant="outlined"
            fullWidth
            value={lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: capitalise(e.target.value) })
            }
            type="text"
            placeholder="اسم أبيك"
            error={lastname.length !== 0 && lastname.length === 1}
            helperText={
              lastname.length != 0 &&
              lastname.length === 1 &&
              "لا يمكن أن يتكون الاسم من حرف واحد!"
            }
          />
        </Grid>
        {/* End of Last Name Field */}

        {/* Gender Field */}
        <Grid item xl={12} xs={6}>
          <FormControl fullWidth>
            <InputLabel>النوع</InputLabel>
            <Select
              value={gender}
              label="النوع"
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <MenuItem value="اختر" selected disabled>
                اختر النوع
              </MenuItem>
              <MenuItem value="male">ذكر</MenuItem>
              <MenuItem value="female">أنثى</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* End of Gender Field */}

        {/* Birth Date Field */}
        <Grid item xl={12} xs={6} className="age-container">
          <DateSelect label="تاريخ الميلاد" value={age} onChange={setAge} />
        </Grid>
        {/* End of Birth Date Field */}

        {/* Land Field */}
        <Grid item xl={12} xs={12}>
          <FormControl fullWidth>
            <InputLabel>البلد</InputLabel>
            <Select
              value={land}
              label="البلد"
              onChange={(e) =>
                setFormData({ ...formData, land: e.target.value })
              }
            >
              <MenuItem value="اختر" selected disabled>
                اختر البلد
              </MenuItem>
              {Object.entries(countries).map(([key, value]) => {
                return (
                  key != "IL" && (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  )
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        {/* End of Land Field */}

        {/* Submit Button */}
        <Grid item xl={12} xs={12} style={{ textAlign: "center" }}>
          {isClicked ? (
            <Loader text="يجري إنشاء الحساب..." />
          ) : (
            <Button
              variant="contained"
              size="large"
              className="fw-300"
              onClick={() => {
                handleCreateAccount();
              }}
              disabled={
                !email ||
                !username ||
                !password ||
                !passwordAgain ||
                !firstname ||
                !lastname ||
                gender === "اختر" ||
                !age ||
                land === "اختر"
              }
            >
              أنشأ حسابا جديدا
            </Button>
          )}
        </Grid>
        {/* End of Submit Button */}

        {/* Redirection Tip Section */}
        <Grid item>
          <Typography>
            لديك حساب من قبل؟
            <Button onClick={() => dispatch(toggleSignup())}>
              سجل دخولك بدلا من ذلك
            </Button>
          </Typography>
        </Grid>
        {/* Redirection Tip Section */}
      </Grid>
      {/* End of Form Section */}
    </Grid>
  );
};

export default Login;
