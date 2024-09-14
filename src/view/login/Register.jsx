import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Spin } from "antd";
import { getCode, register } from "../../api/login";

import "./Login.less";
import "./bg.css";

export default function Register() {
  const [codeSrc, setCodeSrc] = useState("");
  const [loginKey, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  // 跳转
  const navigate = useNavigate();

  useEffect(() => {
    getCodeSrc();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //获取验证码
  const getCodeSrc = async () => {
    let result = await getCode();
    const { code, data } = result || {};
    if (code === 200) {
      if (data?.img) {
        setCodeSrc(data?.img);
        setKey(data?.key);
      }
    } else {
      message.destroy();
      message.open({
        type: "error",
        content: result.msg,
      });
    }
  };
  const onFinish = async (yesFinish) => {
    const { comPwd, password, username } = yesFinish;
    // const regex = /^(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
    if (username.length < 6) {
      return message.error("注册账号至少需得6位");
    }
    if (password !== comPwd) {
      return message.error("两次密码不一致");
    }
    // if (!regex.test(password)) {
    //   return message.error("密码至少10位，且必须包含大小写字母");
    // }
    else {
      setLoading(true);
      let result = await register({
        ...yesFinish,
        checkToken: loginKey,
      });
      const { msg } = result || {};
      if (result?.code === 200) {
        setLoading(false);
        message.success("注册成功");
        navigate("/");
      } else {
        message.open({
          type: "error",
          content: msg,
        });
        getCodeSrc();
        setLoading(false);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Spin spinning={loading}>
      <div className="login background">
        <>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
          <strong></strong>
        </>
        <div style={{ zIndex: "20" }} className="login-form">
          {/* <div className="login-form-title">
            <span
              className="login-form-title-item"
              onClick={() => {
                navigate("/");
              }}
            >
              用户登录
            </span>
            <span className="login-form-title-item login-form-title-register">
              注册
            </span>
          </div> */}
          <img src={require("../../assets/image/login.png")} alt="" />
          <p className="yonghu">
            用户注册<span></span>
          </p>
          <Form
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "请输入账号!",
                },
              ]}
            >
              <Input placeholder="请输入账号!" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入登录密码!",
                },
              ]}
            >
              <Input.Password placeholder="请输入登录密码!" />
            </Form.Item>
            <Form.Item
              name="comPwd"
              rules={[
                {
                  required: true,
                  message: "请输入确认密码!",
                },
              ]}
            >
              <Input.Password
                style={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
                placeholder="确认密码!"
              />
            </Form.Item>
            <Form.Item
              name="invitation_code"
              rules={[
                {
                  required: true,
                  message: "请输入邀请码!",
                },
              ]}
            >
              <Input placeholder="邀请码!" />
            </Form.Item>
            <Form.Item>
              <div className=" imgcodeBOX ">
                <Form.Item
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "请输入验证码!",
                    },
                  ]}
                >
                  <Input placeholder="请输入验证码!" />
                </Form.Item>
                <img
                  src={codeSrc}
                  className=" codeImg "
                  alt=""
                  onClick={getCodeSrc}
                />
              </div>
              <div className="clickLgzc">
                <p>
                  已有账号
                  <span
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    点此登录
                  </span>
                </p>
              </div>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                // offset: 8,
                span: 24,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", fontSize: "16px", height: "50px" }}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
}
