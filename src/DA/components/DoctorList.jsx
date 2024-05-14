import { Row, message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../assets/data/data";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokenChecker } from "../utils/helperFunctions";
import { logout } from "../redux/userSlice";
import dayjs from "dayjs";

const DoctorList = () => {
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchApprovedDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}/doctors/find/approveddoctors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApprovedDoctors(data);
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedDoctors();
  }, []);

  return (
    <div className="doctorList">
      <h1 className="text-center mb-4 pt-4">Our Doctors</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <Row>
          {approvedDoctors.map((doctor, i) => (
            <div
              key={i}
              className="card m-2"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/book-appointment/${doctor._id}`)}
            >
              <div className="card-header doctorName">
                Dr. {doctor.firstName} {doctor.lastName}
              </div>
              <div className="card-body">
                <p>
                  <b>Specialization:</b> {doctor.specialization}
                </p>
                <p>
                  <b>Experience:</b> {doctor.experience}
                </p>
                <p>
                  <b>Fees Per Consultation:</b> ${doctor.feesPerConsultation}
                </p>
                <p>
                  <b>Timings:</b> {dayjs(doctor?.timings[0]).format("hh:mm a")}{" "}
                  - {dayjs(doctor?.timings[1]).format("hh:mm a")}
                </p>
              </div>
            </div>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DoctorList;
