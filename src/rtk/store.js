import { configureStore } from "@reduxjs/toolkit";
import guideSlice from "./slices/guide-slice";
import patientSlice from "./slices/patient-slice";
import weightGuideSlice from "./slices/weight-guide-slice";
import authSlice from "./slices/auth-slice";
import usersSlice from "./slices/users-slice";

export const store = configureStore({
  reducer: {
    users: usersSlice,
    guide: guideSlice,
    weightGuide: weightGuideSlice,
    patient: patientSlice,
    auth: authSlice,
  },
});
