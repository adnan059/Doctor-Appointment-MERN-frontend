import { createSlice } from "@reduxjs/toolkit";

const doctorsAndUsersSlice = createSlice({
  name: "doctorsAndUsers",
  initialState: {
    doctors: [],
    users: [],
  },
  reducers: {
    setDoctors: (state, action) => {
      state.doctors = action.payload.doctors;
    },
    setUsers: (state, action) => {
      state.users = action.payload.users;
    },

    doctorApproval: (state, action) => {
      state.doctors.forEach((doctor) => {
        if (doctor._id.toString() === action.payload.doctorId.toString()) {
          doctor.status = "approved";
        }
      });
    },

    removeDoctor: (state, action) => {
      state.doctors = state.doctors.filter(
        (doctor) => doctor._id.toString() !== action.payload.doctorId.toString()
      );
    },

    removeUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user._id.toString() !== action.payload.userId.toString()
      );
    },
  },
});

export const {
  setDoctors,
  setUsers,
  doctorApproval,
  removeDoctor,
  removeUser,
} = doctorsAndUsersSlice.actions;

export default doctorsAndUsersSlice.reducer;
