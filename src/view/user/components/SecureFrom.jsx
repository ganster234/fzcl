import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, message } from "antd";
import useAppStore from "../../../store";
import { getCode } from "../../../api/code";
import { postUpdatePwd } from "../../../api/user";

export default function SecureFrom() {
  const [codeSrc, setCodeSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [state, setState] = useState({
    code: "",
    password: "",
    comPwd: "",
  });
  const [checkToken, setCheckToken] = useState("");

  const userInfo = useAppStore((state) => state.userInfo);
  console.log(userInfo, "userInfo");

  const getPwdCode = async () => {
    let result = await getCode();
    const { code, data, msg } = result || {};
    if (code === 200) {
      setCodeSrc(data?.img);
      setCheckToken(data?.key);
    } else {
      message.destroy();
      message.error(msg);
    }
  };

  useEffect(() => {
    (() => {
      // getPwdCode();
    })();
  }, []);

  const comSubmit = async () => {
    message.destroy();
    // if (!checkToken) {
    //   return;
    // }
    if (!userInfo.Device_Sid) {
      return;
    }
    // if (!state.code) {
    //   return message.error("请输入验证码");
    // }
    if (!state.oldPassword) {
      return message.error("请输入旧密码");
    }

    if (!state.password) {
      return message.error("请输入密码");
    }
    if (state.comPwd !== state.password) {
      return message.error("两次输入密码不一致");
    }
    setLoading(true);
    // return console.log(state, "state");
    const { password, oldPassword } = state;
    let result = await postUpdatePwd({
      Sid: userInfo.Device_Sid, //用户sid
      Pass: password, //新密码
      Oldpass: oldPassword, //老密码
    });
    // eslint-disable-next-line eqeqeq
    if (result?.code) {
      // return;
      // 退出页面去除本地的登录信息
      localStorage.removeItem("globalState");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("globalState");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      message.success("修改成功");
      navigate("/");
    } else {
      message.error(result?.msg);
    }
    setLoading(false);
  };
  return (
    <div className="basic-form">
      <div className="form-item">
        <div className="form-item-title">
          <span className="form-color">*</span>
          <span>用户名：</span>
        </div>
        <Input
          value={userInfo.Device_name}
          disabled={true}
          placeholder="请输入用户名"
          style={{ width: "488px", height: "40px" }}
        ></Input>
      </div>
      {/* <div className="form-item">
        <div className="form-item-title">
          <span className="form-color">*</span>
          <span>验证码：</span>
        </div>
        <div
          style={{
            width: "488px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Input
            value={state.code}
            onChange={(even) =>
              setState((data) => ({ ...data, code: even.target.value }))
            }
            placeholder="请输入验证码"
            style={{ width: "340px", height: "40px" }}
          ></Input>
          <img
            src={codeSrc}
            alt=""
            onClick={() => getPwdCode()}
            style={{ width: "120px", height: "36px", borderRadius: "4px" }}
          />
        </div>
      </div> */}
      <div className="form-item">
        <div className="form-item-title">
          <span className="form-color">*</span>
          <span>旧密码：</span>
        </div>
        <Input.Password
          value={state.oldPassword}
          onChange={(even) =>
            setState((data) => ({ ...data, oldPassword: even.target.value }))
          }
          placeholder="请输入旧密码"
          style={{ width: "488px", height: "40px" }}
        ></Input.Password>
      </div>

      <div className="form-item">
        <div className="form-item-title">
          <span className="form-color">*</span>
          <span>新密码：</span>
        </div>
        <Input.Password
          value={state.password}
          onChange={(even) =>
            setState((data) => ({ ...data, password: even.target.value }))
          }
          placeholder="请输入新密码"
          style={{ width: "488px", height: "40px" }}
        ></Input.Password>
      </div>
      <div className="form-item">
        <div className="form-item-title">
          <span className="form-color">*</span>
          <span>确认密码：</span>
        </div>
        <Input.Password
          value={state.comPwd}
          onChange={(even) =>
            setState((data) => ({ ...data, comPwd: even.target.value }))
          }
          placeholder="确认密码"
          style={{ width: "488px", height: "40px" }}
        ></Input.Password>
      </div>
      <Button
        type="primary"
        onClick={comSubmit}
        loading={loading}
        style={{ width: "459px", height: "40px", marginTop: "90px" }}
      >
        确认修改
      </Button>
    </div>
  );
}
