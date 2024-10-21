import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../../components/AppProvider";
import { Button, Form, Input, message, Spin } from "antd";
// getCode,transmitting
import { login, getCode } from "../../api/login";
import { usebegin } from "../../store/mystore";
// import Fingerprint2 from "fingerprintjs2";
// import useAppStore from "../../store";
import "./Login.less";
// import { newData } from "../../store/zhiwen";
export default function Login() {
  // const platformSrc = useAppStore((state) => state.platformSrc); //设置用户信息
  const takestore = usebegin();
  const [codeSrc, setCodeSrc] = useState("");
  const [loginKey, setKey] = useState("");
  const [loginCheckToken, setCheckToken] = useState("");

  const [loading, setLoading] = useState(false);
  // 跳转
  const navigate = useNavigate();
  const { resetMenus } = useContext(context);
  useEffect(() => {
    // transmitting({ data: JSON.stringify(newData) });
    getCodeSrc();
  }, []);
  //获取验证码
  const getCodeSrc = async () => {
    let result = await getCode();
    const { code, data } = result || {};
    // eslint-disable-next-line eqeqeq
    if (code == 200) {
      if (data[0]?.img) {
        setCodeSrc(data[0]?.img);
        setKey(data[0]?.key);
        setCheckToken(data[0]?.checkToken);
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
    // return console.log(yesFinish, "yesFinish");

    setLoading(true);
    let result = await login({
      ...yesFinish,
      checkToken: loginCheckToken,
      Key: loginKey,
    });
    // const fingerprint = await new Promise((resolve) => {
    //   Fingerprint2.get((components) => {
    //     const values = components.map((component) => component.value);
    //     const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
    //     resolve(fingerprint);
    //   });
    // });
    const { code, data, msg } = result || {};
    if (code === "200") {
      //登录成功
      takestore.setdisclosedBallot(false);
      setLoading(false);
      sessionStorage.setItem("token", "");
      sessionStorage.setItem("user", data[0].Device_Sid);
      // 刷新页面导致路由以及丢失menu的关键  暂时写死的超级管理员
      sessionStorage.setItem("role", data[0].Device_Roles || "role");
      //重置路由菜关键点    暂时写死的超级管理员
      resetMenus(data[0].Device_Roles || "role");
      // 获取查询参数,如果没有就跳转到首页
      navigate("/layouts/home", { replace: true });
    }
    // else if (code === 410) {
    //   //未修改密码禁止用户操作
    //   takestore.setdisclosedBallot(true);
    //   // console.log(result);
    //   setLoading(false);
    //   sessionStorage.setItem("token", data.data);
    //   // 刷新页面导致路由以及丢失menu的关键
    //   sessionStorage.setItem("role", data?.roles || "admin");
    //   //重置路由菜关键点
    //   resetMenus(data?.roles || "admin");
    //   // 获取查询参数,如果没有就跳转到首页
    //   navigate("/layouts/user/modify", { replace: true });
    //   message.open({
    //     type: "warning",
    //     content: msg,
    //   });
    // }
    else {
      message.open({
        type: "error",
        content: msg,
      });
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Spin spinning={loading}>
      <div className="login background">
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
              name="User"
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
              name="Pass"
              rules={[
                {
                  required: true,
                  message: "请输入登录密码!",
                },
              ]}
            >
              <Input.Password size="small" placeholder="请输入登录密码!" />
            </Form.Item>

            <Form.Item>
              <div className=" imgcodeBOX ">
                <Form.Item
                  name="VerifyCode"
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

            <Form.Item>
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
