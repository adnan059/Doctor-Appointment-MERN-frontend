import React from "react";
import "../assets/styles/layout.css";
import { adminMenu, userMenu } from "../assets/data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { Badge } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // logout function
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  // rendering menu list
  const sidebarMenu = user?.isAdmin ? adminMenu : userMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo text-center pt-4">
              <h3>
                <i className="fa-solid fa-user-doctor"></i>
                <p>WellMed</p>
              </h3>
            </div>
            <div className="menu">
              {sidebarMenu.map((menuItem) => {
                return (
                  <div key={Math.random()} className={`menu-item`}>
                    <i className={menuItem.icon}></i>
                    <Link to={menuItem.path}>{menuItem.name}</Link>
                  </div>
                );
              })}

              {user?.isDoctor === false ? (
                <div key={Math.random()} className={`menu-item`}>
                  <i className={"fa-solid fa-user-doctor"}></i>
                  <Link to={"/apply-doctor"}>Apply Doctor</Link>
                </div>
              ) : null}

              {user?.isDoctor ? (
                <div key={Math.random()} className={`menu-item`}>
                  <i className={"fa-solid fa-list"}></i>
                  <Link to={"/doctor-appointments"}>Doctor Appointments</Link>
                </div>
              ) : null}

              <div key={Math.random()} className={`menu-item`}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <button onClick={logoutHandler}>Log Out</button>
              </div>
            </div>
          </div>
          <div className="content ">
            <div className="header d-flex justify-content-end  align-items-center ">
              <div className="header-content">
                <Badge
                  count={user?.notifications?.length}
                  onClick={() => navigate("/notifications")}
                  size="default"
                  style={{ right: "12px" }}
                >
                  <i className="fa-solid fa-bell"></i>
                </Badge>
                <Link to="/profile">{user.name}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
            <div className="footer">
              This demo web application is created only for study purpose | No
              information here is valid | Designed and Developed by MD ADNAN
              FARUK
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
