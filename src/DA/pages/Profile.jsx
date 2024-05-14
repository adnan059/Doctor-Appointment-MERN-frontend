import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DoctorProfile from "../components/DoctorProfile";
import UserProfile from "../components/UserProfile";

const Profile = () => {
  const { user, token } = useSelector((state) => state.user);

  if (user?.isDoctor) {
    return <DoctorProfile />;
  } else {
    return <UserProfile />;
  }
};

export default Profile;
