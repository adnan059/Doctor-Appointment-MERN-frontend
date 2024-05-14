import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, message, TimePicker } from "antd";

import axios from "axios";
import { baseUrl } from "../assets/data/data";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { tokenChecker } from "../utils/helperFunctions";
import { logout } from "../redux/userSlice";

const BookingPage = () => {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState({});
  const { token, user } = useSelector((state) => state.user);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // fetching doctor info /////////////////////
  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}/doctors/find-doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDoctor(data);
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };
  ///////////////////////////////
  useEffect(() => {
    fetchDoctor();
  }, []);

  ///////////////////////////////////////
  // check booking availability
  const handleAvailability = async () => {
    //checking if date or time are invalid

    if (!date || !time || date === "Invalid Date" || time === "Invalid Time") {
      setIsAvailable(false);
      return message.error("Invalid Date or Time");
    }

    // time range validation

    const doctorStartingTime = dayjs(doctor?.timings[0]).toISOString();

    const doctorEndingTime = dayjs(doctor?.timings[1]).toISOString();

    const d = new Date();
    d.setHours(parseFloat(time.split(":")[0]));
    d.setMinutes(parseFloat(time.split(":")[1]));
    const appointmentTime = d.toISOString();
    console.log(appointmentTime);

    const dd = parseFloat(date.split("-")[0]);
    console.log(date);
    const mm = parseFloat(date.split("-")[1]) - 1;
    const yyyy = parseFloat(date.split("-")[2]);
    const d2 = new Date();
    d2.setFullYear(yyyy, mm, dd);
    const appointmentDate = d2.toISOString();

    if (
      appointmentTime < doctorStartingTime ||
      appointmentTime > doctorEndingTime
    ) {
      setIsAvailable(false);
      return message.error("Invalid Time");
    }

    setLoading(true);
    try {
      console.log("final time =>", appointmentTime);
      const { data } = await axios.post(
        `${baseUrl}/users/book-availability`,
        {
          doctorId: doctor._id,
          date: appointmentDate,
          time: appointmentTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.open({
        content: data.message + dayjs(appointmentTime).format("hh:mm a"),
        duration: 5,
        type: data.isAvailable === true ? "success" : "error",
      });

      setIsAvailable(data.isAvailable);

      setLoading(false);
    } catch (error) {
      setIsAvailable(false);
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  /////////////////////////////////////////
  // handle booking
  const handleBooking = async () => {
    if (date === "Invalid Date" || time === "Invalid Time" || !date || !time) {
      setIsAvailable(false);
      return message.error("Invalid Date or Time");
    }

    // *****************

    const d = new Date();
    d.setHours(parseFloat(time.split(":")[0]));
    d.setMinutes(parseFloat(time.split(":")[1]));
    const appointmentTime = d.toISOString();

    const dd = parseFloat(date.split("-")[0]);
    console.log(date);
    const mm = parseFloat(date.split("-")[1]) - 1;
    const yyyy = parseFloat(date.split("-")[2]);
    const d2 = new Date();
    d2.setFullYear(yyyy, mm, dd);
    const appointmentDate = d2.toISOString();

    // ******************
    setLoading(true);
    console.log("booking time......", time);
    try {
      const { data } = await axios.post(
        `${baseUrl}/users/bookappointment`,
        {
          doctorId,
          userId: user?._id,
          date: appointmentDate,
          time: appointmentTime,
          doctorToBeBooked: doctor,
          userInfo: user,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success({
        content: data.message + dayjs(data.time).format("hh:mm a"),
        duration: 5,
      });
      setIsAvailable(false);

      setLoading(false);
      navigate("/user-appointments");
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };
  return (
    <Layout>
      <h3 className="text-center py-4">Booking Page</h3>
      <div className="container m-2">
        <div>
          <p>
            Dr.{doctor?.firstName} {doctor?.lastName}
          </p>
          <p>Fees : ${doctor?.feesPerConsultation}</p>
          <p>
            Timings :{" "}
            {doctor?.timings && dayjs(doctor?.timings[0]).format("hh:mm a")} -{" "}
            {doctor?.timings && dayjs(doctor?.timings[1]).format("hh:mm a")}{" "}
          </p>
          <div className="d-flex flex-column w-50">
            <DatePicker
              className="m-2"
              format="DD-MM-YYYY"
              onChange={(value) => {
                setDate(dayjs(value).format("DD-MM-YYYY"));
                setIsAvailable(false);
              }}
              disabledDate={(current) => {
                return current < dayjs();
              }}
            />
            <TimePicker
              use12Hours
              format="hh:mm a"
              className="mt-3"
              onChange={(value) => {
                setTime(dayjs(value).format("HH:mm"));
                setIsAvailable(false);
              }}
            />

            <button
              className="btn btn-primary mt-2"
              onClick={handleAvailability}
              disabled={loading}
            >
              Check Availability
            </button>

            {isAvailable && (
              <button
                className="btn btn-dark mt-2"
                onClick={handleBooking}
                disabled={loading}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
