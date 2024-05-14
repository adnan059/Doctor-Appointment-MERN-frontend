import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { tokenChecker } from "../utils/helperFunctions";
import { logout } from "../redux/userSlice";
import axios from "axios";
import { baseUrl } from "../assets/data/data";
import dayjs from "dayjs";
import moment from "moment";
const Appoinments = () => {
  const { user, token } = useSelector((state) => state.user);
  const [appoinments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchAppoinments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}/users/user-appointments/${user?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments(data);
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppoinments();
  }, []);

  return (
    <Layout>
      <h1 className="text-center pt-4 pb-4">My Appointments with Doctors</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="row w-100 gap-3 m-3 py-3">
          {appoinments.length > 0 ? (
            <>
              {appoinments.map((appmnt, i) => {
                console.log(appmnt);
                return (
                  <div className="card text-center col-2 p-3 " key={i}>
                    <p>Patient: {appmnt.userInfo.name}</p>
                    <p>
                      Doctor: {appmnt.doctorToBeBooked.firstName}{" "}
                      {appmnt.doctorToBeBooked.lastName}
                    </p>
                    <p>Time: {dayjs(appmnt?.time).format("hh:mm a")}</p>
                    <p>Date: {dayjs(appmnt?.date).format("DD-MM-YYYY")}</p>
                    <p>Status: {appmnt.status.toUpperCase()}</p>
                  </div>
                );
              })}
            </>
          ) : (
            <h3 className="text-center pt-5">No Appointments Found</h3>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Appoinments;
