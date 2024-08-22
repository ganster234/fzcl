import React from "react";
import { message, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store";

import "./Headers.less";
import { getDownload, cleanhuanc } from "../../api/home";
export default function Headers() {
  const role = sessionStorage.getItem("role");
  const userInfo = useAppStore((state) => state.userInfo);
  const changServiceShow = useAppStore((state) => state.setServiceShow);
  const changRechargeShow = useAppStore((state) => state.setRechargeShow);
  const navigate = useNavigate();
  const [service, setService] = useState({});
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    let result = await getDownload();
    if (result?.code === 200) {
      setService(result?.data);
    }
  };

  const unSign = () => {
    // 退出页面去除本地的登录信息
    localStorage.removeItem("globalState");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("globalState");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/");
  };

  const jump = (data) => {
    navigate(data);
  };
  return (
    <div className="headers">
      {/* <div className="contact">我的联系方式：11111</div> */}
      <div
        style={{
          textAlign: "right",
          fontSize: "16px",
          fontWeight: "900",
          color: "red",
        }}
      >
        <p>客服：{service["telegram"]}</p>
      </div>
      <div className="recharge-balance">
        <span className="balance">
          <img
            src={require("../../assets/image/headers/headers-money-icon.png")}
            alt=""
            className="headers-money-icon"
          />
          <span className="balance-title">余额：{userInfo?.balance}</span>
        </span>
        <div className="balance-line"></div>
        <span className="recharge" onClick={() => changRechargeShow(true)}>
          充值
        </span>
      </div>
      {role === "superAdmin" || role === "admin" ? (
        <Tooltip placement="bottom" title="清理缓存">
          <img
            src={require("../../assets/image/headers/shuaxing.png")}
            alt=""
            className="noe2"
            onClick={() => {
              cleanhuanc().then((res) => {
                if (res.code) {
                  message.info(res.message);
                }
              });
            }}
          />
        </Tooltip>
      ) : (
        <></>
      )}

      <img
        src={require("../../assets/image/headers/customer-service.png")}
        alt=""
        className="customer-service"
        onClick={() => changServiceShow(true)}
      />
      <img
        src={
          userInfo?.is_mail && userInfo?.is_mail > 0
            ? require("../../assets/image/headers/message.png")
            : require("../../assets/image/headers/no-message.png")
        }
        alt=""
        className="head-message"
        onClick={() => jump("/layouts/mail")}
      />
      <div className="user-name">你好，用户{userInfo?.account}</div>
      {userInfo?.invitation_code && (
        <div className="invitation-code-box">
          <span>邀请码:</span>
          <span className="invitation-code">{userInfo?.invitation_code}</span>
        </div>
      )}
      <div className="exit-main" onClick={unSign}>
        <PoweroffOutlined />
        <span className="exit">退出</span>
      </div>
    </div>
  );
}
