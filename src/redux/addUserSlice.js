import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addUser: [],
  editUser: null,
  error: null,
  loading: false,
};

const addUserSlice = createSlice({
  name: "addUser",
  initialState,
  reducers: {
    getUsersSuccess: (state, action) => {
      state.addUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEditUser: (state, action) => {
      state.editUser = action.payload;
    },
    clearEditUser: (state) => {
      state.editUser = null;
    },
  },
});

export const {
  addUserSuccess,
  getUsersSuccess,
  setError,
  setEditUser,
  clearEditUser,
} = addUserSlice.actions;

export default addUserSlice.reducer;
