import React, { useState } from "react";
import Layout from "../components/Layout";
import { Tabs, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../assets/data/data";
import { logout, resetUserData } from "../redux/userSlice";
import { tokenChecker } from "./../utils/helperFunctions";

const Notifications = () => {
  const { user, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Mark read all notifications
  const readAllNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/users/readallnotifications`,
        { id: user?._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(resetUserData({ data: response.data }));
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  // Delete all old notifications
  const deleteSeenNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/users/deleteseennotifications`,
        { id: user?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(resetUserData({ data: response.data }));
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="New Notifications" key={0}>
          <div className="d-flex justify-content-end">
            <button
              className="p-2 btn-primary bg-primary rounded-2 text-white mb-2 mx-2 "
              onClick={readAllNotifications}
              disabled={loading}
            >
              Mark All Read
            </button>
          </div>
          {user?.notifications?.length > 0 &&
            user?.notifications?.map((notif, i) => (
              <div
                key={Math.random()}
                onClick={() => navigate(`${notif.onClickPath}`)}
                className="bg-warning-subtle my-1"
                style={{ cursor: "pointer" }}
              >
                <p className="p-1">
                  <span>
                    <i className="fa-solid fa-caret-right"></i>
                  </span>{" "}
                  {notif.message}
                </p>
              </div>
            ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Old Notifications" key={1}>
          <div className="d-flex justify-content-end">
            <button
              className="p-2 btn-primary bg-danger rounded-2 text-white mb-2 mx-2"
              onClick={deleteSeenNotifications}
              disabled={loading}
            >
              Delete All Read
            </button>
          </div>
          {user?.seenNotifications?.length > 0 &&
            user?.seenNotifications?.map((notif, i) => (
              <div
                key={Math.random()}
                onClick={() => navigate(`${notif.onClickPath}`)}
                className="bg-warning-subtle my-1"
              >
                <p className="p-1">
                  <span>
                    <i className="fa-solid fa-caret-right"></i>
                  </span>{" "}
                  {notif.message}
                </p>
              </div>
            ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default Notifications;
