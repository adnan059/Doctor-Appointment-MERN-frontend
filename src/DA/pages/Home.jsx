import React from "react";
import Layout from "../components/Layout";
import DoctorList from "../components/DoctorList";

const Home = () => {
  return (
    <>
      <Layout>
        <DoctorList />
      </Layout>
    </>
  );
};

export default Home;
