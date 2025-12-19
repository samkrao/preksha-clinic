import React, { useState ,useRef,useEffect} from "react";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";
import "../Styles/AppointmentForm.css";
import { DatePicker } from 'antd';
import { Form, Input, Button, Typography, Spin ,Select} from "antd";
import UseContactUs from "../utils/apis/appointment";
import PhoneInput from "antd-phone-input";
import {
  NOTIFICATION_DETAILS,
  FORM_PADDING,
} from "../utils/constants/Constants";
import showNotification from "../utils/views/showNotification";

const AppointmentForm = () => {
  const ref = useRef();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const [form] = Form.useForm();
  const { Title, Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();

  const handleSubmission = React.useCallback(
    (result) => {
      if (result.error) {
        showNotification("error", NOTIFICATION_DETAILS.error);
      } else {
        showNotification("success", NOTIFICATION_DETAILS.success);
        form.resetFields();
      }
    },
    [form]
  );

  const onSubmit = React.useCallback(async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (errorInfo) {
      return;
    }
    setLoading(true);
    const result = await UseContactUs(values);
    setLoading(false);
    handleSubmission(result);
  }, [form, handleSubmission]);

  return (
    <div className="appointment-form-section">
      <div className="form-container">
      <Title
        level={3}
        style={{
          marginBottom: 0,
          paddingTop: 20,
          ...FORM_PADDING,
        }}
      >
        <span> Book Appointment Online </span>
      </Title>
      <Spin spinning={loading}>
        <Form
          name="appointment"
          layout="vertical"
          form={form}
          wrapperCol={{
            span: 6,
          }}
          style={{
            marginTop: 20,
            paddingBottom: 10,
            ...FORM_PADDING,
          }}
          className="form-content"
        >
          <Form.Item
            label="Patient Name"
            name="patient"
            required
            tooltip="This is a required field"
            rules={[
              {
                required: true,
                message: "Please enter your Patient Name!",
              },
            ]}
          >
            <Input placeholder="Patient Name" />
          </Form.Item>
          <Form.Item
            label="Patient Phone Number"
            name="phone number"
            required
            tooltip="This is a required field"
            rules={[
              {
                required: true,
                message: "Please enter your Phone Number!",
              },
            ]}
          >
            <PhoneInput placeholder="Enter phone number" enableSearch country= "in" value={value}
            onChange={setValue} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            required
            tooltip="This is a required field"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
                type: "email",
              },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Preferred Appointment Time"
            name="appointmentdatetime"
            required
            tooltip="This is a required field"
            rules={[
              {
                required: true,
                message: "Message is a required field!",
              },
            ]}
          >
          <DatePicker
              ref={ref}
              format="DD/MM/YYYY hh:mm A"
              onChange={(date, dateString) => console.log(date, dateString)}
              showTime={{ use12Hours: true }}
              />
           </Form.Item>

           <Form.Item
            label="Preferred Appointment Mode"
            name="appointmentmode"
            required
            tooltip="This is a required field"
            rules={[
              {
                required: true,
                message: "Message is a required field!",
              },
            ]}
          >
           <Select
            dropdownRender={() => (
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Some Content
              </div>
            )}
          />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={onSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
      </div>
    </div>
  );
};
export default AppointmentForm;
