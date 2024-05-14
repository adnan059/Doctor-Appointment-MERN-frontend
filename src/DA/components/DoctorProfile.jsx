/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { Col, Form, Input, Row, TimePicker, message, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../assets/data/data";
import { logout, setDoctorInfo } from "../redux/userSlice";

import dayjs from "dayjs";
import { tokenChecker } from "../utils/helperFunctions";

const DoctorProfile = () => {
  const { token, user, doctorInfo } = useSelector((state) => state.user);
  console.log(dayjs(doctorInfo.timings[0]).format("hh:mm a"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values) => {
    if (user?._id.toString() !== doctorInfo?.userId.toString()) {
      return message.error("You are not authorized");
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/doctors/update`,
        {
          doctorId: doctorInfo?._id,
          userId: doctorInfo?.userId,
          doctorData: {
            ...values,
            timings: [
              dayjs(values?.timings[0]).toISOString(),
              dayjs(values?.timings[1]).toISOString(),
            ],
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setDoctorInfo({ doctorInfo: response.data }));
      setLoading(false);
      navigate("/");
    } catch (error) {
      message.error(error.response.data.message);
      tokenChecker(error.response.data.message, dispatch, logout);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-center pt-4 pb-4">My Information</h1>

      <Form layout="vertical" onFinish={handleUpdate} className="m-3">
        <h4 className="">Personal Details : </h4>
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              initialValue={doctorInfo?.firstName}
              label="First Name"
              name="firstName"
              required
              rules={[
                { required: true, message: "First name is required" },
                { min: 2, message: "Minimum 2 characters needed" },
                { max: 20, message: "Maximum 20 characters allowed" },
              ]}
              hasFeedback
            >
              <Input type="text" placeholder="your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Last Name"
              initialValue={doctorInfo?.lastName}
              name="lastName"
              required
              rules={[
                { required: true, message: "Last name is required" },
                { min: 2, message: "Minimum 2 characters needed" },
                { max: 20, message: "Maximum 20 characters allowed" },
              ]}
              hasFeedback
            >
              <Input type="text" placeholder="your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              initialValue={doctorInfo?.phone}
              label="Phone Number"
              name="phone"
              required
              rules={[
                { required: true, message: "Phone number is required" },
                {
                  pattern:
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
                  message: "This is not a valid phone number yet",
                },
              ]}
              hasFeedback
            >
              <Input
                type="text"
                placeholder="Enter a valid US phone number. For e.g +1234567890"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              initialValue={doctorInfo?.email}
              label="Email"
              name="email"
              required
              rules={[
                { required: true, message: "Email is required" },
                {
                  pattern:
                    /^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+[_]?){1,}@([a-zA-Z0-9]{2,}\.){1,}[a-zA-Z]{2,4}$/,
                  message: "this is not a valid email yet",
                },
              ]}
              hasFeedback
            >
              <Input type="email" placeholder="your email address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Website"
              name="website"
              initialValue={doctorInfo?.website}
              hasFeedback
            >
              <Input type="text" placeholder="your website" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              initialValue={doctorInfo?.address}
              label="Address"
              name="address"
              required
              rules={[{ required: true, message: "Address is required" }]}
              hasFeedback
            >
              <Input type="text" placeholder="your clinic address" />
            </Form.Item>
          </Col>
        </Row>
        <h4>Professional Details :</h4>
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Specialization"
              name="specialization"
              initialValue={doctorInfo?.specialization}
              required
              rules={[
                { required: true, message: "Specialization is required" },
              ]}
              hasFeedback
            >
              <Input type="text" placeholder="your specialization" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              initialValue={doctorInfo?.experience}
              label="Experience"
              name="experience"
              required
              rules={[{ required: true, message: "Experience is required" }]}
              hasFeedback
            >
              <Input type="text" placeholder="your experience" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Fees Per Consultation in USD"
              name="feesPerConsultation"
              initialValue={doctorInfo?.feesPerConsultation}
              required
              rules={[
                {
                  type: "number",

                  required: true,

                  min: 20,
                  max: 100,
                  message:
                    "Enter a number that is not less than 20 and not more than 100",
                },
              ]}
              hasFeedback
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="your consultaion fee in USD"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Timings"
              name="timings"
              rules={[{ required: true, message: "Work time is required" }]}
              hasFeedback
              initialValue={[
                dayjs(doctorInfo.timings[0]),
                dayjs(doctorInfo.timings[1]),
              ]}
            >
              <TimePicker.RangePicker format="hh:mm a" use12Hours />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}></Col>
          <Col xs={24}>
            <button
              className="btn btn-primary form-btn mt-5 mx-auto d-block "
              type="submit"
              disabled={loading}
            >
              Update
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default DoctorProfile;
