import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";

// Your existing code for the slice
const UsersSlice = createSlice({
  name: "UsersSlice",
  initialState: {
    usernames: {},
    useremails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.usernames = action.payload.usernames;
        state.useremails = action.payload.useremails;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "UsersSlice/fetchUsers",
  async (_, { getState }) => {
    const dbusers = await getDocs(collection(db, "users"));

    const usernames = dbusers.docs.reduce((acc, doc) => {
      const username = doc.data().username;
      const id = doc.id;
      acc[username] = id;
      return acc;
    }, {});

    const useremails = dbusers.docs.reduce((acc, doc) => {
      const email = doc.data().email;
      const id = doc.id;
      acc[email] = id;
      return acc;
    }, {});

    return { usernames, useremails };
  }
);

export default UsersSlice.reducer;
