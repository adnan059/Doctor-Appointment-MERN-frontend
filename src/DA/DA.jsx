import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import Notifications from "./pages/Notifications";
import ProtectedAdminRoutes from "./components/ProtectedAdminRoutes";
import AllUsers from "./pages/admin pages/AllUsers";
import AllDoctos from "./pages/admin pages/AllDoctos";
import Profile from "./pages/Profile";
import BookingPage from "./pages/BookingPage";
import Appoinments from "./pages/Appoinments";
import DoctorAppointments from "./pages/DoctorAppointments";

const DA = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<ProtectedRoute />}>
            <Route path="" element={<Home />} />
            <Route path="apply-doctor" element={<ApplyDoctor />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="book-appointment/:doctorId"
              element={<BookingPage />}
            />
            <Route path="user-appointments" element={<Appoinments />} />
            <Route
              path="doctor-appointments"
              element={<DoctorAppointments />}
            />
          </Route>
          <Route path="/*" element={<PublicRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/admin/*" element={<ProtectedAdminRoutes />}>
            <Route path="users" element={<AllUsers />} />
            <Route path="doctors" element={<AllDoctos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default DA;
