import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../assets/data/data";
import { Table, message } from "antd";
import {
  doctorApproval,
  removeDoctor,
  setDoctors,
} from "../../redux/doctorsAndUsersSlice";
import { tokenChecker } from "../../utils/helperFunctions";
import { logout } from "../../redux/userSlice";

const AllDoctos = () => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctorsAndUsers);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/admin/alldoctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setDoctors({ doctors: data }));
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  const handleAccountStatus = async (record, status) => {
    setLoading(true);
    try {
      if (status === "approved") {
        const updateResponse = await axios.put(
          `${baseUrl}/admin/approvedoctor`,
          { doctorId: record._id, userId: record.userId, status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(doctorApproval({ doctorId: record._id }));
      } else {
        const deleteResponse = await axios.put(
          `${baseUrl}/admin/deletedoctor`,
          { doctorId: record._id, userId: record.userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(removeDoctor({ doctorId: record._id }));
      }
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  // table coloumns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <>
              <button
                className="btn btn-warning"
                onClick={() => handleAccountStatus(record, "approved")}
                disabled={loading}
              >
                Approve
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => handleAccountStatus(record, "removed")}
                disabled={loading}
              >
                Remove
              </button>
            </>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => handleAccountStatus(record, "removed")}
              disabled={loading}
            >
              Remove
            </button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Layout>
      {" "}
      <h1 className="text-center py-2">All Doctors</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default AllDoctos;
