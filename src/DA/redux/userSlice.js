import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: { user: null, token: null, doctorInfo: null },
  reducers: {
    signup: (state, action) => {
      state.user = action.payload.others;
      state.token = action.payload.token;
    },

    login: (state, action) => {
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    resetUserData: (state, action) => {
      state.user = action.payload.data;
    },

    setDoctorInfo: (state, action) => {
      state.doctorInfo = action.payload.doctorInfo;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.doctorInfo = null;
    },
  },
});

export const { signup, login, logout, resetUserData, setDoctorInfo } =
  userSlice.actions;

export default userSlice.reducer;
