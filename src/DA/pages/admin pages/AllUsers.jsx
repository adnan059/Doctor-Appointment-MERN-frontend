import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Table, message } from "antd";
import axios from "axios";
import { baseUrl } from "../../assets/data/data";
import { removeUser, setUsers } from "../../redux/doctorsAndUsersSlice";
import { tokenChecker } from "../../utils/helperFunctions";
import { logout } from "../../redux/userSlice";

const AllUsers = () => {
  const { user, token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const { users } = useSelector((state) => state.doctorsAndUsers);
  const dispatch = useDispatch();

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/admin/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setUsers({ users: response.data }));
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);

      setLoading(false);
    }
  };

  const deleteUser = async (record) => {
    setLoading(true);
    try {
      const deletedUser = await axios.put(
        `${baseUrl}/admin/deleteuser`,
        { userId: record._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(removeUser({ userId: record._id }));
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button
            className="btn btn-danger"
            onClick={() => deleteUser(record)}
            disabled={loading}
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center py-3">All Users</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};

export default AllUsers;
