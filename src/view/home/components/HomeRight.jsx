import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store";
import { getDealList } from "../../../api/deal";
import { getCount } from "../../../api/count";
import { getDownload } from "../../../api/home";

import skypeIcon from "../../../assets/image/home/skype-icon.png";
import register from "../../../assets/image/home/register.png";
import androidApp from "../../../assets/image/home/android-app.png";
import scanCode from "../../../assets/image/home/scan-code.png";
import "./HomeRight.less";

export default function HomeRight() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const setService = useAppStore((state) => state.getService);
  // const [dealList, setDealList] = useState([]);
  // const [countList, setCountList] = useState([]);
  const [downloadDetail, setDownloadDetail] = useState({});
  const commonList = [
    {
      icon: require("../../../assets/image/home/thali-icon.png"),
      title: "套餐",
      path: "/layouts/thali",
    },
    {
      icon: require("../../../assets/image/home/ck-icon.png"),
      title: "联合套餐",
      path: "/layouts/qqunited",
    },
    {
      icon: require("../../../assets/image/home/scan-code-icon.png"),
      title: "修改密码",
      path: "/layouts/user/modify",
    },
    {
      icon: require("../../../assets/image/home/group-icon.png"),
      title: "分组管理",
      path: "/layouts/platform/group",
    },
    {
      icon: require("../../../assets/image/home/order-icon.png"),
      title: "订单列表",
      path: "/layouts/order",
    },
    {
      icon: require("../../../assets/image/home/payment-icon.png"),
      title: "支付记录",
      path: "/layouts/payment",
    },
    {
      icon: require("../../../assets/image/home/recharge-icon.png"),
      title: "充值记录",
      path: "/layouts/recharge",
    },
  ];

  const jumpPath = (item) => {
    navigate(item.path);
  };
  useEffect(() => {
    // 获取交易站的数据
    const getDeal = async () => {
      let result = await getDealList({
        limit: "3",
      });
      const { code } = result || {};
      if (code === 200) {
        // setDealList([...data?.data]);
      }
    };
    // 获取统计数据
    const getCountList = async () => {
      let result = await getCount({
        type: "2",
      });
      if (result?.code === 200) {
        if (result?.data && result?.data.length > 5) {
          // setCountList(result?.data.slice(0, 5));
        } else {
          // setCountList(result?.data);
        }
      }
    };
    //获取登陆器
    const getDetail = async () => {
      let result = await getDownload();
      if (result?.code) {
        setDownloadDetail({ ...result?.data });
        setService(result?.data);
      }
    };
    getDetail();
    if (role === "superAdmin") {
      getCountList();
    }
    getDeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //   下载登录器
  const homeDownload = (str) => {
    if (downloadDetail[str]) {
      const w = window.open("about:blank");
      w.location.href = downloadDetail[str];
    }
  };
  //   查看教程
  const downloadView = () => {
    const w = window.open("about:blank");
    w.location.href = "https://cowtransfer.com/s/920637fb46df4b";
  };
  const signTutorial = (str) => {
    if (downloadDetail[str]) {
      const w = window.open("about:blank");
      w.location.href = downloadDetail[str];
    }
  };
  return (
    <div style={{ marginTop: "0px" }} className="home-right">
      <div className="home-download">
        <div className="home-download-title">
          <span>系统下载</span>
          <span
            className="sign-tutorial"
            onClick={() => signTutorial("empower")}
          >
            查看上号教程
          </span>
        </div>
        <div className="home-download-item home-download-item-bor">
          <img src={skypeIcon} alt="" className="home-download-item-icon" />
          <span className="home-download-item-content">Telegram/Skype教程</span>
          <span
            className="home-download-item-view"
            onClick={() => downloadView()}
          >
            点击查看
          </span>
        </div>
        <div className="home-download-item home-download-item-bor">
          <img src={register} alt="" className="home-download-item-icon" />
          <span className="home-download-item-content">新版OP登录器</span>
          <span
            className="home-download-item-register"
            onClick={() => homeDownload("download_url")}
          >
            立即下载
          </span>
        </div>
        <div className="home-download-item home-download-item-bor">
          <img src={androidApp} alt="" className="home-download-item-icon" />
          <span className="home-download-item-content">新版安卓APP下载</span>
          <span
            className="home-download-item-android-app"
            onClick={() => homeDownload("apk")}
          >
            立即下载
          </span>
        </div>
        <div className="home-download-item">
          <img src={scanCode} alt="" className="home-download-item-icon" />
          <span className="home-download-item-content">
            新版PC扫码(带自动修改dns,自动优选最快ip)
          </span>
          <span
            className="home-download-item-scan-code"
            onClick={() => homeDownload("exe")}
          >
            立即下载
          </span>
        </div>
        <div className="home-download-item">
          <img src={scanCode} alt="" className="home-download-item-icon" />
          <span className="home-download-item-content">
            网页登录器下载(非专属项目无需下载)
          </span>
          <span
            className="home-download-item-scan-code"
            onClick={() => {
              window.open("https://pan.quark.cn/s/c324aef02a8e#/list/share");
            }}
          >
            立即下载
          </span>
        </div>
        <div className="home-download-item">
          <img src={scanCode} alt="" className="home-download-item-icon" />
          <span className="home-download-item-content">API下载使用与教程</span>
          <span
            className="home-download-item-scan-code"
            onClick={() => homeDownload("file")}
          >
            立即下载
          </span>
        </div>
        <div className="home-download-item">
          <img src={scanCode} alt="" className="home-download-item-icon" />
          <span className="home-download-item-content">xposed（用于微信快手使用）</span>
          <span
            className="home-download-item-scan-code"
            onClick={() => {
              window.open("https://pan.quark.cn/s/ed1d692aedd6#/list/share");
            }}
          >
            立即下载
          </span>
        </div>
        <div className="common_sw">
          <div className="common-title">常用功能</div>
          <div className="common-content">
            {commonList &&
              commonList.map((item, index) => {
                return (
                  <div key={item.path + index} className="common-item">
                    <img
                      src={item.icon}
                      alt=""
                      className="common-item-icon"
                      onClick={() => jumpPath(item)}
                    />
                    <span>{item.title}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
