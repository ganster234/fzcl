import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../../components/AppProvider";
import { Button, Form, Input, message, Spin } from "antd";
import { getCode, login } from "../../api/login";
import { usebegin } from "../../store/mystore";
import Fingerprint2 from "fingerprintjs2";
import useAppStore from "../../store";
import "./Login.less";
import "./bg.css";
export default function Login() {
  const platformSrc = useAppStore((state) => state.platformSrc); //设置用户信息
  const takestore = usebegin();
  const [codeSrc, setCodeSrc] = useState("");
  const [loginKey, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  // 跳转
  const navigate = useNavigate();
  const { resetMenus } = useContext(context);

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
    setLoading(true);
    let result = await login({ ...yesFinish, checkToken: loginKey });
    const fingerprint = await new Promise((resolve) => {
      Fingerprint2.get((components) => {
        const values = components.map((component) => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
        resolve(fingerprint);
      });
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      //登录成功
      takestore.setdisclosedBallot(false);
      setLoading(false);
      sessionStorage.setItem("token", data?.data);
      // 刷新页面导致路由以及丢失menu的关键
      sessionStorage.setItem("role", data?.roles || "admin");
      //重置路由菜关键点
      resetMenus(data?.roles || "admin");
      // 获取查询参数,如果没有就跳转到首页
      navigate("/layouts/home", { replace: true });

      // await fetch("https://api.afei567.com/v1/add/user/ip", {
      //   method: "POST",
      //   headers: {
      //     Token: data?.data,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     zhi: fingerprint,
      //     data: window.navigator.userAgent,
      //     account: data?.account,
      //     type:
      //       platformSrc === "rosefinch"
      //         ? "2"
      //         : platformSrc === "whale"
      //         ? "3"
      //         : platformSrc === "shark"
      //         ? "4"
      //         : "",
      //   }),
      // });
    } else if (code === 410) {
      //未修改密码禁止用户操作
      takestore.setdisclosedBallot(true);
      // console.log(result);
      setLoading(false);
      sessionStorage.setItem("token", data.data);
      // 刷新页面导致路由以及丢失menu的关键
      sessionStorage.setItem("role", data?.roles || "admin");
      //重置路由菜关键点
      resetMenus(data?.roles || "admin");
      // 获取查询参数,如果没有就跳转到首页
      navigate("/layouts/user/modify", { replace: true });
      message.open({
        type: "warning",
        content: msg,
      });
    } else {
      message.open({
        type: "error",
        content: msg,
      });
      getCodeSrc();
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Spin spinning={loading}>
      {/* login background */}
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
          {/* <span className="login-form-title-item login-form-title-user">
              用户登录
            </span>
            <span
              className="login-form-title-item"
              onClick={() => {
                navigate("/register");
              }}
            >
              注册
            </span> */}
          {/* <img src={require("../../assets/image/login.png")} alt="" /> */}
          <p className="yonghu">
            用户登录<span></span>
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
              name="account"
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
            <Form.Item>
              <div className=" imgcodeBOX ">
                <Form.Item
                  name="verifyCode"
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
                  className=" codeImg "
                  src={codeSrc}
                  alt=""
                  onClick={getCodeSrc}
                />
              </div>
              <div className="clickLgzc">
                <p>
                  没有账号
                  <span
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    点此注册
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
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
}
