import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { tokenChecker } from "../utils/helperFunctions";
import { logout } from "../redux/userSlice";
import axios from "axios";
import { baseUrl } from "../assets/data/data";
import dayjs from "dayjs";

const DoctorAppointments = () => {
  const { user, token, doctorInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}/doctors/doctor-appointments/${doctorInfo._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDoctorAppointments(data);

      setLoading(false);
    } catch (error) {
      message(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleApprove = async (id, userId) => {
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${baseUrl}/doctors/approve-appointment/${id}`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      doctorAppointments.forEach((appmnt) => {
        if (appmnt._id === id) {
          appmnt.status = "approved";
        }
      });
      message.success(data.message);

      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  const handleReject = async (id, userId) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/doctors/reject-appointment/${id}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newDA = doctorAppointments.filter((appmnt) => appmnt._id !== id);
      setDoctorAppointments(newDA);
      message.success(data.message);
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-center pt-4 pb-4 ">Appointments</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="row gap-3  p-4 ">
          {doctorAppointments?.length > 0 ? (
            doctorAppointments?.map((da, i) => {
              return (
                <div key={i} className="card p-3  col-2 text-center ">
                  <p>Patient: {da?.userInfo.name}</p>
                  <p>
                    Doctor: {da?.doctorToBeBooked.firstName}{" "}
                    {da?.doctorToBeBooked.lastName}
                  </p>
                  <p>Time: {dayjs(da?.time).format("hh:mm a")}</p>
                  <p>Date: {dayjs(da?.date).format("DD-MM-YYYY")}</p>
                  <div className="buttons d-flex gap-2 justify-content-center ">
                    {da?.status === "pending" ? (
                      <button
                        className="btn btn-success"
                        disabled={loading}
                        onClick={() => handleApprove(da?._id, da?.userInfo._id)}
                      >
                        Approve
                      </button>
                    ) : (
                      <button disabled={loading} className="btn btn-primary">
                        Approved
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      disabled={loading}
                      onClick={() => handleReject(da?._id, da?.userInfo._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-center mt-5">No Appointments Found</h1>
          )}
        </div>
      )}
    </Layout>
  );
};

export default DoctorAppointments;
