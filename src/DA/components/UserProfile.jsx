import React from "react";
import Layout from "./Layout";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <Layout>
      <div className="row p-4 ">
        <h2>Name: {user?.name}</h2>
      </div>
    </Layout>
  );
};

export default UserProfile;
