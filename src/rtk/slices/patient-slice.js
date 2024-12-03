import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

const PatientSlice = createSlice({
  name: "PatientSlice",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        return action.payload.userWithoutSensitiveData;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        return action.payload.userData;
      });
  },
});

// Async thunk to fetch user
export const fetchUser = createAsyncThunk(
  "PatientSlice/fetchUser",
  async (_, { getState }) => {
    try {
      const userId = window.localStorage.getItem("UserId");
      const userDocRef = doc(db, "users", userId);
      const user = await getDoc(userDocRef);

      if (user.exists()) {
        const userData = { id: user.id, ...user.data() };

        // Exclude the 'password' key
        const userWithoutSensitiveData = { ...userData };
        delete userWithoutSensitiveData.password;

        // Convert the modified 'user' object to a JSON string
        const userString = JSON.stringify(userWithoutSensitiveData);
        window.localStorage.setItem("UserData", userString);

        return { userWithoutSensitiveData };
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  }
);

export const setUser = createAsyncThunk(
  "PatientSlice/setUser",
  async (_, { getState }) => {
    try {
      const userDataString = window.localStorage.getItem("UserData");
      const userData = await JSON.parse(userDataString);
      return { userData };
    } catch (error) {
      console.error("Error fetching user:", error.message);
      throw error; // Rethrow the error to propagate it to the component
    }
  }
);

export default PatientSlice.reducer;
