import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import axios from "axios";
import { baseUrl } from "../assets/data/data";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { login, setDoctorInfo } from "../redux/userSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  ////////////
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });
  //////////////
  const navigate = useNavigate();
  const dispatch = useDispatch();
  ////////////////////////////////////////////////////////
  //login form handler
  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/users/login`, data);

      const { token, ...others } = response.data;

      dispatch(login({ token, others }));

      if (others.isDoctor) {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${baseUrl}/doctors/find/${others._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          dispatch(setDoctorInfo({ doctorInfo: data }));

          setLoading(false);
        } catch (error) {
          message.error(error.response.data.message);
          setLoading(false);
        }
      }

      message.success({
        content: "Login Successful",
        duration: 4,
      });

      reset();
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error({
        content: error.response.data.message,
        duration: 4,
      });
    }
  };
  ///////////////////////////////////////////////////////
  return (
    <>
      <div className="form-container ">
        <h3 className="text-center">Login Form</h3>
        <form onSubmit={handleSubmit(handleLogin)} className="login-form">
          <input
            name="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",

              pattern: {
                value:
                  /^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+[_]?){1,}@([a-zA-Z0-9]{2,}\.){1,}[a-zA-Z]{2,4}$/,
                message: "This is not a valid email address",
              },
            })}
            data-error={Boolean(errors?.email?.message)}
          />

          {errors?.email?.message && (
            <p className="error-msg text-danger text-xl">
              {errors?.email?.message}
            </p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            data-error={Boolean(errors?.password?.message)}
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                message:
                  "Min 8 Chars: upperCase, lowerCase, number/special Char ",
              },
            })}
          />

          {errors?.password?.message && (
            <p className="error-msg text-danger text-xl  w-80">
              {errors?.password?.message}
            </p>
          )}
          <button
            className="btn btn-primary mt-2 mx-auto d-block "
            type="submit"
            disabled={loading}
          >
            Login
          </button>
        </form>
        <span className="mt-3">
          Doesn't have an account?{" "}
          <Link to="/register" className="mt-3" disabled={loading}>
            Register
          </Link>
        </span>
      </div>
    </>
  );
};

export default Login;
