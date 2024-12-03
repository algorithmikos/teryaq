import React from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneNumAuth = () => {
  const handlePhoneAuth = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  };

  const onSignup = () => {
    handlePhoneAuth();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+2" + phoneNum;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onOTPverify = () => {
    window.confirmationResult
      .confirm(OTP)
      .then(async (res) => {
        setUser(res.user);
        const hashedPassword = bcrypt.hashSync(password, 10);

        const userData = {
          username,
          password: hashedPassword,
          firstname,
          lastname,
          gender,
          age,
          land,
        };

        // Reference to the "users" collection
        const usersCollection = collection(db, "users");

        // Use the UID from authentication as the document ID
        const newUserDocRef = doc(usersCollection, res.user.uid);

        // Set data to the user's document
        await setDoc(newUserDocRef, userData);

        console.log(
          "User profile successfully created with ID: ",
          newUserDocRef.id
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return <div>PhoneNumAuth</div>;
};

export default PhoneNumAuth;
