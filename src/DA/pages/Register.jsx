import { useForm } from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/register.css";
import { message } from "antd";
import axios from "axios";
import { baseUrl } from "./../assets/data/data";
import { useDispatch } from "react-redux";
import { signup } from "../redux/userSlice";
import { useState } from "react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  ///////////////////////////
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
  ///////////////////////////

  const navigate = useNavigate();
  const dispatch = useDispatch();
  ///////////////////////////////////////////////////
  // registration form handler
  const handleRegistration = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/users/register`, data);

      const { token, ...others } = response.data;

      dispatch(signup({ token, others }));

      message.success({
        content: "Registration Successful",
        duration: 4,
      });

      reset();
      setLoading(false);
      navigate("/");
    } catch (error) {
      message.error({
        duration: 4,
        content: error.response.data.message,
      });
      setLoading(false);
    }
  };
  ////////////////////////////////////////////////
  return (
    <>
      <div className="form-container ">
        <h3 className="text-center">Registration Form</h3>
        <form
          onSubmit={handleSubmit(handleRegistration)}
          className="register-form"
        >
          <input
            name="name"
            placeholder="Enter your name"
            {...register("name", {
              required: "Name is required",

              maxLength: {
                value: 40,
                message: "Not more than 40 characters is allowed",
              },
              minLength: {
                value: 2,
                message: "Not less than 2 characters is allowed",
              },
            })}
            data-error={Boolean(errors?.name?.message)}
          />

          {errors?.name?.message && (
            <p className="error-msg text-danger text-xl">
              {errors?.name?.message}
            </p>
          )}

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
            Register
          </button>
        </form>
        <span className="mt-3">
          Already have an account?{" "}
          <Link to="/login" className="mt-3" disabled={loading}>
            Login
          </Link>
        </span>
      </div>
    </>
  );
};

export default Register;
