import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    isLoggedIn: false,
    isSigningUp: false,
  },
  reducers: {
    toggleLogin: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
    toggleSignup: (state) => {
      state.isSigningUp = !state.isSigningUp;
    },
    setLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { toggleLogin, setLogin, toggleSignup } = authSlice.actions;
export default authSlice.reducer;
