/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Layout, message, Modal, Spin, InputNumber, Input } from "antd";
import { Stepper } from "antd-mobile";
import { PoweroffOutlined } from "@ant-design/icons";

import { useLocation, useNavigate } from "react-router-dom";
import SiderMenus from "../components/siderMenus/SiderMenus";
import { getUser } from "../api/login";
import {
  setPayMoney,
  getPayStatus,
  getPayUsdt,
  getCard,
  getPayList,
} from "../api/recharge";
import { setUpdateTime } from "../api/user";
import useAppStore from "../store";

import { getDownload } from "../api/home";

import paymentIcon from "../assets/image/recharged/recharged-payment.png";
import rechargedActive from "../assets/image/home/recharge-checkout-active.png";
import rechargedCheckout from "../assets/image/home/recharge-checkout.png";

import "./Layouts.less";

const { Header, Sider, Content } = Layout;

//懒加载组件，react自带的，两者性能几乎相差无几就是写法差距
const Headers = React.lazy(async () => {
  const item = await import("../components/Headers/Headers");
  return item;
});

let times = null; //定时器

export default function Layouts({ children }) {
  const lohad = useLocation();
  const navigate = useNavigate();
  const [messageApi] = message.useMessage();
  const [rechargedActiveShow, setRechargedActiveShow] = useState(""); //微信充值还是USTD充值
  const [payUsdt, setPayUsdt] = useState("");
  const [cardPay, setCardPay] = useState("");
  const [noticShow, setNoticShow] = useState(true);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [advertActive, setAdvertActive] = useState(true);
  const setUserInfo = useAppStore((state) => state.getUserInfo); //设置用户信息
  const changServiceShow = useAppStore((state) => state.setServiceShow); //客服弹窗
  const changRechargeShow = useAppStore((state) => state.setRechargeShow); //充值弹窗
  const service = useAppStore((state) => state.service); //客服信息
  const setService = useAppStore((state) => state.getService);
  const serviceShow = useAppStore((state) => state.serviceShow);
  const rechargeShow = useAppStore((state) => state.rechargeShow);
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const [Topupaccount, setTopupaccount] = useState(""); //充值账户
  const [imgCode, setImgCode] = useState("");
  const [pattern, setpattern] = useState([]);
  const [highlight, sethighlight] = useState(""); //高亮
  const [postElection, setpostElection] = useState({}); //支付方式选中后
  const [tourl, settourl] = useState(""); //支付
  const roWx = [
    {
      money: "100",
    },
    {
      money: "200",
    },
    {
      money: "500",
    },
    {
      money: "1000",
    },
  ];
  const [rechargeList, setrechargeList] = useState([]);
  //   {
  //   money: "100",
  // },
  // {
  //   money: "200",
  // },
  // {
  //   money: "500",
  // },
  // {
  //   money: "1000",
  // },
  let kamiList = [
    {
      title: "10",
      key: "one",
    },
    {
      title: "100",
      key: "one_hundred",
    },
    {
      title: "200",
      key: "two_hundred",
    },
    {
      title: "500",
      key: "five__hundred",
    },
    {
      title: "1000",
      key: "one_thousand",
    },
  ];

  const [AAASSSS, setAAASSSS] = useState(roWx);
  useEffect(() => {
    settourl(lohad.pathname);
  }, [lohad]);
  useEffect(() => {
    if (rechargeShow) {
      setRechargeLoading(true);
      getPayList({ is_use: "0" }).then((result) => {
        if (result?.code === 200) {
          setRechargeLoading(false);
          setpattern(result?.data);
        }
      });
    }
  }, [rechargeShow]);
  useEffect(() => {
    if (rechargedActiveShow === "wexin" || rechargedActiveShow === "wCHaPay") {
      setAAASSSS(roWx);
    } else {
      setAAASSSS(rechargeList);
    }
  }, [rechargedActiveShow]);
  const [kamiState, setKamiState] = useState({
    one: 0,
    one_hundred: 0,
    two_hundred: 0,
    five__hundred: 0,
    one_thousand: 0,
  });
  const [rechargeActive, setRechargeActive] = useState("100"); //充值金额，默认是10
  const [num, setNum] = useState(1);
  //充值状态 未充值notRecharged，扫码scanCode，完成支付payment
  const [rechargeStatus, setRechargeStatus] = useState("notRecharged");
  useEffect(() => {
    // 获取用户信息
    getUserInfo();
    getDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 获取以及更新用户信息
  const getUserInfo = async () => {
    let result = await getUser();
    const { code, data, msg } = result || {};
    if (code === 200) {
      setUserInfo(data);
    } else {
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: msg,
      });
    }
  };
  //获取登陆器
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
  const serviceOk = () => {
    console.log(service);
    changServiceShow(!service);
  };
  // 关闭充值弹窗，清空信息
  const cancelRecharge = () => {
    setpostElection({});
    sethighlight("");
    clearInterval(times);
    setRechargeActive("100");
    setRechargedActiveShow("");
    changRechargeShow(!rechargeShow);
    setRechargeStatus("notRecharged");
    setKamiState({
      one: 0,
      one_hundred: 0,
      two_hundred: 0,
      five__hundred: 0,
      one_thousand: 0,
    });
    setRechargeLoading(false);
  };
  //发起订单，返回的是支付二维码
  const rechargeMoney = async () => {
    if (!rechargeActive) {
      return;
    }
    if (!num) {
      return message.error("请输入购买数量（只能输入整数）");
    }
    if (!Number.isInteger(num) || num < 0) {
      return message.error("购买数量只能为整数");
    }
    setRechargeLoading(true);
    let result = await setPayMoney({
      title: `充值${rechargeActive}元`,
      price: rechargeActive + "",
      num: num,
      type: postElection.pay_type, ///w    1  微信支付 2 支付宝
    });
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      setImgCode(data?.img);
      setRechargeStatus("scanCode");

      setRechargeLoading(false);
      //调起轮询
      times = setInterval(() => {
        checkStatus(data?.order_id);
      }, 1000);
    } else {
      message.error(msg);
    }
  };
  //轮循订单
  const checkStatus = (order_id) => {
    getPayStatus({ order_id: order_id }).then((result) => {
      if (result?.code === 200 && result?.data === 1) {
        clearInterval(times);
        setImgCode("");
        setRechargeStatus("payment");
        setKamiState({
          one: 0,
          one_hundred: 0,
          two_hundred: 0,
          five__hundred: 0,
          one_thousand: 0,
        });
        message.success("支付成功");
        //更新本地数据
        getUserInfo();
      }
    });
  };
  // ustd充值
  const rechargeUstd = async () => {
    message.destroy();

    if (!rechargeActive) {
      return message.error("请选择充值金额");
    }
    if (!Topupaccount) {
      return message.error("请输入充值账户");
    }

    setRechargeLoading(true);
    let result = await getPayUsdt({
      price: rechargeActive,
      num: 1,
      addr: Topupaccount,
    });
    if (result?.code === 200) {
      message.success("提交成功，请等待审核");
      setPayUsdt("");
      setNum(1);
      sethighlight("");
      setRechargeActive("100");
      setRechargedActiveShow("");
      setRechargeLoading(false);
      //更新本地数据
      getUserInfo();
    } else {
      message.error(result?.msg);
    }
    setRechargeLoading(false);
  };

  //卡密充值
  const payCardBtn = async () => {
    if (!cardPay) {
      return message.error("请输入卡密");
    }
    setRechargeLoading(true);
    let result = await getCard({ card: cardPay });
    if (result.code === 200) {
      message.success("充值成功");
      setCardPay("");
      //更新本地数据
      getUserInfo();
    } else {
      message.error(result?.msg);
    }
    setRechargeLoading(false);
  };

  //购买卡密
  const purchaseKami = async () => {
    if (!totalMoney) {
      return message.error("请选择购买卡密");
    }
    setRechargeLoading(true);
    let result = await setPayMoney({
      title: `购买卡密`,
      price: totalMoney + "",
      num: 1,
      card: JSON.stringify({
        ...kamiState,
      }),
    });
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      setImgCode(data?.img);
      setRechargeStatus("scanCode");
      setRechargeLoading(false);
      //调起轮询
      times = setInterval(() => {
        checkStatus(data?.order_id);
      }, 1000);
    } else {
      message.error(msg);
    }
    setRechargeLoading(false);
  };

  const rechargePrice = useMemo(() => {
    let price = 0;
    if (rechargeActive && num) {
      price = Number(rechargeActive) * Number(num);
    }
    return price;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rechargeActive, num]);

  const totalMoney = useMemo(() => {
    let price = 0;
    const { one, one_hundred, two_hundred, five__hundred, one_thousand } =
      kamiState;
    price =
      Number(one) * 10 +
      Number(one_hundred) * 100 +
      Number(two_hundred) * 200 +
      Number(five__hundred) * 500 +
      Number(one_thousand) * 1000;
    return price.toFixed(2);
  }, [JSON.stringify(kamiState)]);

  // 今日不显示
  const doNotDisplay = async () => {
    let result = await setUpdateTime();
    if (result?.code === 200) {
      setNoticShow(false);
      getUserInfo();
    }
  };
  return (
    <>
      {/* "calc(100vh - 60px)" */}
      <Layout style={{ width: "100vw", height: "100vh" }}>
        <Sider style={{ width: "256px", background: "#10274E", color: "#fff" }}>
          <SiderMenus />
        </Sider>
        <Layout>
          <Header
            className={tourl === "/layouts/home" ? "shox" : ""}
            style={{
              paddingInline: "32px",
              background: "#fff",
              lineHeight: "1",
              height: "64px",
            }}
          >
            {tourl === "/layouts/home" ? (
              <div className="homepageNav">
                <img
                  src="https://js-ad.a.yximgs.com/kos/nlav11074/IMAGES/new_white_logo.svg"
                  alt=""
                />
                <div className="exitOut" onClick={unSign}>
                  <PoweroffOutlined />
                  <span style={{ marginLeft: "10px" }}> 退出</span>
                </div>
              </div>
            ) : (
              <Headers></Headers>
            )}
          </Header>
          <Content
            className={tourl === "/layouts/home" ? "aaaass" : ""}
            style={{
              margin: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
            <Modal
              title="添加客服"
              open={serviceShow}
              width={792}
              footer={null}
              destroyOnClose
              onCancel={serviceOk}
            >
              <div className="layout-add-service">
                <div className="layout-add-service-text">
                  <div className="add-service-text-box">
                    {service["telegram"]}
                    <div className="add-service-text-skype">
                      {service["telegram_remark"]}
                    </div>
                    {/* <div>333</div>
                    <div className="add-service-text-skype">44</div> */}
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              title={null}
              closeIcon={null}
              open={rechargeShow}
              width={900}
              footer={null}
              destroyOnClose
              onCancel={() => {
                cancelRecharge();
              }}
            >
              <Spin spinning={rechargeLoading}>
                <div className="recharge-modal-box">
                  <div className="recharge-modal-wx">
                    1、充值金额只能用于胖虎消费。USTD转账(USTD转账
                    {userInfo?.rate}折)。
                    <span style={{ color: "red" }}>
                      2.若充值出现任何问题可联系客服处理
                    </span>
                    {postElection.remark ? (
                      <p
                        style={{
                          color: "red",
                          marginLeft: "5px",
                          fontSize: "15px",
                        }}
                      >
                        温馨提示：{postElection.remark}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="on-line-recharge-modal">在线充值</div>
                  <div className="recharge-modal-message-item">
                    <span>充值账户：</span>
                    <span className="recharge-message-item-user-info">
                      {userInfo?.account || "用户110"}
                    </span>
                  </div>
                  <div className="recharge-modal-message-item">
                    <span>账户余额：</span>
                    <span className="recharge-message-item-money">
                      {userInfo?.balance || "0.00"}
                    </span>
                  </div>
                  <div className="recharge-modal-message-item">
                    <span>支付方式：</span>
                    <div className="recharge-message-item-checkbox">
                      {pattern.map((item, index) => {
                        return (
                          <span
                            key={index}
                            className="recharge-checkbox-item"
                            onClick={() => {
                              console.log(item, "sssssstime");
                              if (item.price) {
                                const arr = item.price.split(",");
                                setrechargeList(
                                  arr.map((item) => ({ money: item })) || []
                                );
                              }
                              if (item.pay_type === "pay_kami") {
                                if (item.url) {
                                  window.open(item.url);
                                } else {
                                  message.error("此功能暂未开放请联系管理员");
                                }
                              } else {
                                setRechargeActive("100");
                                setNum(1);
                                setpostElection(item);
                                sethighlight(item.pay_type);
                                setRechargedActiveShow(
                                  //////////////////////新增支付方式////////////////////////
                                  item.pay_type === "wxpay" ||
                                    item.pay_type === "yuansheng" ||
                                    item.pay_type === "wechat" ||
                                    item.pay_type === "baoge"
                                    ? "wCHaPay"
                                    : item.pay_type === "alipay"
                                    ? "wexin"
                                    : item.pay_type === "USTD"
                                    ? "USDT"
                                    : item.pay_type
                                );
                                if (
                                  times &&
                                  rechargedActiveShow !== item.pay_type
                                ) {
                                  clearInterval(times);
                                  setRechargeStatus("notRecharged");
                                }
                              }
                            }}
                          >
                            <img
                              src={
                                highlight === item.pay_type
                                  ? rechargedActive
                                  : rechargedCheckout
                              }
                              alt=""
                              className="recharge-checkbox-item-icon"
                            />
                            <span>{item.pay_name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {rechargeStatus === "notRecharged" &&
                    (rechargedActiveShow === "wexin" ||
                      rechargedActiveShow === "wCHaPay") && (
                      <div>
                        <div className="recharge-modal-message-item">
                          <span>购买数量：</span>
                          <InputNumber
                            value={num}
                            onChange={(even) => {
                              setNum(even);
                            }}
                            placeholder="请输入购买数量（只能输入整数，才能生效）"
                            style={{ width: "464px" }}
                          />
                        </div>
                        <div className="recharge-modal-message-item">
                          <span>充值金额：</span>
                        </div>
                        <div className="recharge-money-box">
                          {rechargeList &&
                            rechargeList.map((item) => {
                              return (
                                <div
                                  key={item.money}
                                  className={
                                    item.money === rechargeActive
                                      ? "recharge-money-item recharge-money-item-active"
                                      : "recharge-money-item"
                                  }
                                  onClick={() => setRechargeActive(item.money)}
                                >
                                  <span className="recharge-money-item-num">
                                    {item.money}
                                  </span>
                                  <span>售价:￥{item.money}元</span>
                                </div>
                              );
                            })}
                        </div>
                        <div
                          className="recharge-money-btn"
                          onClick={rechargeMoney}
                        >
                          立即充值
                        </div>
                      </div>
                    )}
                  {rechargeStatus === "scanCode" &&
                    (rechargedActiveShow === "wexin" ||
                      rechargedActiveShow === "wCHaPay") && (
                      <div className="recharged-scan-code">
                        <img
                          src={imgCode}
                          alt=""
                          className="recharged-scan-code-img"
                        />
                        <div>
                          <div className="wx-recharged-money">
                            <span>
                              {postElection.pay_name}
                              <span className="wx-recharged-money-icon">
                                ￥
                              </span>
                            </span>
                            <span className="wx-recharged-money-num">
                              {rechargePrice || "0.00"}
                            </span>
                          </div>
                          <div className="wx-title-scan">
                            打开相关APP ，选择【扫一扫】功能
                          </div>
                          <div className="wx-title-scan">
                            然后用屏幕中的框对准下方的二维码进行扫码支付
                          </div>
                        </div>
                      </div>
                    )}
                  {rechargeStatus === "payment" &&
                    (rechargedActiveShow === "wexin" ||
                      rechargedActiveShow === "wCHaPay") && (
                      <div className="recharged-payment">
                        <img
                          src={paymentIcon}
                          alt=""
                          className="recharged-payment-icon"
                        />
                        <span>支付完成!</span>
                      </div>
                    )}
                  {rechargedActiveShow === "usdt" && (
                    <div className="recharged-ustd">
                      <div className="ustd-money-title">
                        <img
                          src={require("../assets/image/trust/trust-icon.png")}
                          alt=""
                          className="ustd-money-title-icon"
                        />
                        <span>
                          请在钱包向收款账户转账充U金额，打款成功后24小时内充值成功。
                          <span style={{ color: "red" }}>
                            （USDT汇率：{userInfo?.usdt_rate || ""}）
                          </span>
                        </span>
                      </div>
                      <div className="recharge-modal-message-item">
                        <span>收U账户：</span>
                        <span className="recharge-message-item-money">
                          {Topupaccount.length > 20
                            ? userInfo?.wallet
                            : "请输入正确交易单号与交易金额"}
                        </span>
                      </div>
                      <div className="recharge-modal-message-item">
                        <span>打U账户：</span>
                        <Input
                          value={Topupaccount}
                          onChange={(even) => {
                            setTopupaccount(even.target.value);
                          }}
                          placeholder="请输入充U账户"
                          style={{ width: "464px" }}
                        />
                      </div>
                      {/* <div className="recharge-modal-message-item">
                        <span>充值金额：</span>
                        <InputNumber
                          value={payUsdt}
                          onChange={(even) => {
                            setPayUsdt(even);
                          }}
                          placeholder="请输入充值金额"
                          style={{ width: "464px" }}
                        />
                      </div> */}
                      {/* <div className="recharge-modal-message-item">
                        <span>打款金额：</span>
                        <InputNumber
                          min={50}
                          value={num}
                          onChange={(even) => {
                            setNum(even);
                          }}
                          placeholder="请输入充值金额（只能输入整数，才能生效）"
                          style={{ width: "464px" }}
                        />
                      </div> */}
                      <div className="recharge-modal-message-item">
                        <span>充U金额：</span>
                      </div>
                      <div className="recharge-money-box">
                        {rechargeList &&
                          rechargeList.map((item) => {
                            return (
                              <div
                                key={item.money}
                                className={
                                  item.money === rechargeActive
                                    ? "recharge-money-item recharge-money-item-active"
                                    : "recharge-money-item"
                                }
                                onClick={() => setRechargeActive(item.money)}
                              >
                                <span className="recharge-money-item-num">
                                  {item.money}
                                </span>
                                <span>U</span>
                              </div>
                            );
                          })}
                      </div>
                      {Topupaccount.length > 20 ? (
                        <div
                          className="recharge-btn-sign"
                          onClick={() => rechargeUstd()}
                        >
                          确认提交
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                  {/* USTD扫码支付 */}
                  {/* {rechargedActiveShow === "USDTsao" && (
                    <div>
                      <div className="recharge-modal-message-item">
                        <span>购买数量：</span>
                        <InputNumber
                          value={num}
                          onChange={(even) => {
                            setNum(even);
                          }}
                          placeholder="请输入购买数量（只能输入整数，才能生效）"
                          style={{ width: "464px" }}
                        />
                      </div>
                      <div className="recharge-modal-message-item">
                        <span>充值金额：</span>
                      </div>
                      <div className="recharge-money-box">
                        {rechargeList &&
                          rechargeList.map((item) => {
                            return (
                              <div
                                key={item.money}
                                className={
                                  item.money === rechargeActive
                                    ? "recharge-money-item recharge-money-item-active"
                                    : "recharge-money-item"
                                }
                                onClick={() => setRechargeActive(item.money)}
                              >
                                <span className="recharge-money-item-num">
                                  {item.money}
                                </span>
                                <span>根据汇率计算</span>
                              </div>
                            );
                          })}
                      </div>
                      <div
                        className="recharge-btn-sign"
                        onClick={(()=>{
                          if (!num) {
                            return message.error("请输入购买数量（只能输入整数）");
                          }
                          if (!Number.isInteger(num) || num < 0) {
                            return message.error("购买数量只能为整数");
                          }
                          if (!rechargeActive) {
                            return message.error("请选择充值金额");
                          }
                          console.log(123,'问客人房间',rechargeActive);
                        })}
                      >
                        确认提交
                      </div>
                    </div>
                  )} */}
                  {rechargedActiveShow === "kami" && (
                    <>
                      <div className="recharge-modal-message-item">
                        <span>卡密充值：</span>
                        <Input
                          value={cardPay}
                          placeholder="请输入卡密"
                          style={{ width: "464px" }}
                          onChange={(even) => {
                            setCardPay(even.target.value);
                          }}
                        />
                      </div>
                      <div
                        className="recharge-btn-sign"
                        onClick={() => payCardBtn()}
                      >
                        确认提交
                      </div>
                    </>
                  )}
                  {rechargeStatus === "notRecharged" &&
                    rechargedActiveShow === "payKami" && (
                      <>
                        <div className="pay-kami-title">
                          <img
                            src={require("../assets/image/recharged/kami-pay.png")}
                            alt=""
                            className="ustd-money-title-icon"
                          />
                          购买卡密仅限代理，卡密可转让使用。
                        </div>
                        <div className="pay-kami-denomination">充值面额：</div>
                        <div className="pay-kami-money-box">
                          {kamiList &&
                            kamiList.map((item, index) => {
                              return (
                                <div
                                  className="pay-kami-money-box-item"
                                  key={index}
                                >
                                  <div className="pay-kami-money-item-title">
                                    {item.title}
                                  </div>
                                  <div className="pay-kami-money-item-price">
                                    售价：￥{item.title}
                                  </div>
                                  <Stepper
                                    value={kamiState[item?.key]}
                                    min={0}
                                    digits={0}
                                    style={{
                                      "--border": "1px solid #f5f5f5",
                                      "--border-inner": "none",
                                      "--height": "30px",
                                      "--input-width": "50px",
                                      "--input-background-color":
                                        "var(--adm-color-background)",
                                      "--active-border": "1px solid #1677ff",
                                      "--button-text-color": "#999",
                                    }}
                                    onChange={(value) => {
                                      setKamiState((datas) => ({
                                        ...datas,
                                        [item.key]: value,
                                      }));
                                    }}
                                  />
                                </div>
                              );
                            })}
                        </div>
                        <div className="pay-kami-total-money">
                          金额总计：
                          <span className="pay-kami-total-money-text">
                            {totalMoney}
                          </span>
                        </div>
                        <div
                          className="recharge-btn-sign"
                          onClick={() => purchaseKami()}
                        >
                          确认提交
                        </div>
                      </>
                    )}
                  {rechargeStatus === "scanCode" &&
                    rechargedActiveShow === "payKami" && (
                      <div className="recharged-scan-code">
                        <img
                          src={imgCode}
                          alt=""
                          className="recharged-scan-code-img"
                        />
                        <div>
                          <div className="wx-recharged-money">
                            <span>
                              支付宝支付：
                              <span className="wx-recharged-money-icon">
                                ￥
                              </span>
                            </span>
                            <span className="wx-recharged-money-num">
                              {totalMoney || "0.00"}
                            </span>
                          </div>
                          <div className="wx-title-scan">
                            打开支付宝，选择【扫一扫】功能
                          </div>
                          <div className="wx-title-scan">
                            然后用屏幕中的框对准下方的二维码进行扫码支付
                          </div>
                        </div>
                      </div>
                    )}
                  {rechargeStatus === "payment" &&
                    rechargedActiveShow === "payKami" && (
                      <div className="recharged-payment">
                        <img
                          src={paymentIcon}
                          alt=""
                          className="recharged-payment-icon"
                        />
                        <span>支付完成!</span>
                      </div>
                    )}
                </div>
              </Spin>
            </Modal>
            {/* //////////////////////////////////3.5日关////////////////////////////////////// */}
            {/* {noticShow && userInfo?.is_share && (
              <div
                className="notic-show-bg"
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setNoticShow(false);
                }}
              >
                <div
                  className="notic-show-bg-content"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  <img
                    src={require("../assets/image/notic/ntc_t.png")}
                    alt=""
                    className="notic-icon-title"
                  />
                  <div className="notice-text" style={{ lineHeight: "26px" }}>
                    {userInfo.notice}
                  </div>
                  <div
                    style={{
                      textAlign: "end",
                      paddingBottom: "20px",
                      paddingRight: "54px",
                      width: "100%",
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        doNotDisplay();
                      }}
                    >
                      今日不显示
                    </Button>
                  </div>
                </div>
              </div>
            )} */}
          </Content>
        </Layout>
      </Layout>
      {/* <div
        className={
          advertActive
            ? "layouts-content-advert"
            : "layouts-content-advert-active"
        }
      >
        <img
          src={require("../assets/image/advert-1.png")}
          alt=""
          className="layouts-content-advert-img"
        />
        <img
          src={require("../assets/image/advert-close.png")}
          alt=""
          className="layouts-content-advert-close"
          onClick={() => setAdvertActive(false)}
        />
      </div> */}
    </>
  );
}
