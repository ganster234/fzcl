import React, { useState } from "react";
import {
  Carousel,
  Modal,
  InputNumber,
  Input,
  Spin,
  Button,
  message,
  Row,
  Col,
} from "antd";
import useAppStore from "../../store";

import { getAddWithdrawal } from "../../api/cash";
import { getUser } from "../../api/login";
import HomeRight from "./components/HomeRight";
import CommonUse from "./components/CommonUse";

import headIcon from "../../assets/image/head/head-icon.png";
import availableIcon from "../../assets/image/home/available-money.png";

import "./Home.less";

export default function Home() {
  const userInfo = useAppStore((state) => state.userInfo);
  const setUserInfo = useAppStore((state) => state.getUserInfo); //设置用户信息
  const [cashShow, setCashShow] = useState(false);
  const [explainShow, setExplainShow] = useState(false);
  const [activeExplain, setActiveExplain] = useState(0);
  let explainList = ["周卡月卡等时间说明", "分销返利规则"]; //"保险规则说明",
  const [moneyLoading, setMoneyLoading] = useState(false);
  const [money, setMoney] = useState("");
  const [accountBank, setAccountBank] = useState("");
  const [bank, setBank] = useState("");
  const [userName, setUserName] = useState("");
  const changRechargeShow = useAppStore((state) => state.setRechargeShow);
  // 提现
  const cashBtn = async () => {
    message.destroy();
    if (!bank) {
      return message.error("请输入开户行");
    }
    if (!accountBank) {
      return message.error("请输入银行卡号");
    }
    if (!userName) {
      return message.error("请输入用户姓名");
    }
    if (!money) {
      return message.error("请输入提现金额");
    }
    setMoneyLoading(true);
    let result = await getAddWithdrawal({
      money: money + "",
      bank: bank,
      account_bank: accountBank,
      username: userName,
    });
    if (result?.code === 200) {
      message.success("提交成功");
      setMoney("");
      setAccountBank("");
      setBank("");
      setUserName("");
      getUserInfo();
      setCashShow(false);
    } else {
      message.error(result?.msg || "提交失败");
    }
    setMoneyLoading(false);
  };
  // 获取用户信息
  const getUserInfo = async () => {
    let result = await getUser();
    const { code, data, msg } = result || {};
    if (code === 200) {
      setUserInfo(data);
    } else {
      message.destroy();
      message.error(msg);
    }
  };
  return (
    <div className="home">
      <Row>
        <Col span={24}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <div className="home-user-info">
                    <div className="user-info-box">
                      <img src={headIcon} alt="" className="home-head-icon" />
                      <span>欢迎使用，{userInfo?.account}</span>
                    </div>
                    <div className="home-money">
                      <div className="home-money-item">
                        <div>{userInfo?.balance || "0.00"}</div>
                        <div className="home-money-item-test-icon">
                          <img
                            src={availableIcon}
                            alt=""
                            className="home-money-item-icon"
                          />
                          <span>可用余额</span>
                        </div>
                      </div>
                      {/* <div className="home-money-item">
            <div>{userInfo?.freeze || "0.00"}</div>
            <div className="home-money-item-test-icon">
              <img src={freezeIcon} alt="" className="home-money-item-icon" />
              <span>冻结金额</span>
            </div>
          </div> */}
                      {/* <div className="home-money-item">
                        <div>{userInfo?.income || "0.00"}</div>
                        <div className="home-money-item-test-icon">
                          <img
                            src={incomeIcon}
                            alt=""
                            className="home-money-item-icon"
                          />
                          <span>可提现金额</span>
                        </div>
                      </div> */}
                    </div>
                    <div className="home-recharge-cash-btn">
                      <div
                        className="home-recharge-cash home-recharge"
                        onClick={() => changRechargeShow(true)}
                      >
                        充值
                      </div>
                      {/* <div
                        className="home-recharge-cash home-cash"
                        onClick={() => setCashShow(true)}
                      >
                        提现
                      </div> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Row>
                <Col span={24}>
                  {/* <div className="home-main"> */}
                  <Row gutter={[20]}>
                    <Col span={18}>
                      <div className="home-main-left">
                        <div style={{ width: "100%", borderRadius: "8px" }}>
                          <Carousel autoplay>
                            <img
                              src={require("../../assets/image/home/carousel-item2.png")}
                              alt=""
                              className="home-main-left-carousel"
                            />
                            <img
                              src={require("../../assets/image/home/carousel-item1.png")}
                              alt=""
                              className="home-main-left-carousel"
                            />
                          </Carousel>
                        </div>
                        {/* /////////////////数据统计/////////////////////////////// */}
                        {/* {userInfo.permissions === 0 && <DataCount />}
                        {userInfo.permissions !== 0 && <CommonUse />} */}
                        <CommonUse />
                      </div>
                    </Col>
                    <Col span={6}>
                      {/* <div className="home-main-right"> */}
                      <HomeRight />
                      {/* </div> */}
                    </Col>
                  </Row>
                  {/* </div> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title={null}
        closeIcon={null}
        open={cashShow}
        width={860}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setCashShow(false);
          setMoney("");
        }}
      >
        <Spin spinning={moneyLoading}>
          <div className="cash-modal">
            <div className="cash-modal-pour">
              注：提现需经过平台审核，预计1-5个工作日提现至您的银行账户，如超时未到账，请及时联系客服。
            </div>
            <div className="cash-modal-title">提现</div>
            <div className="cash-modal-input-box cash-modal-input-box-bottom">
              <span className="cash-modal-input-title">开户行：</span>
              <Input
                value={bank}
                onChange={(even) => setBank(even.target.value)}
                style={{ width: "464px" }}
                placeholder="请输入开户行"
              />
            </div>
            <div className="cash-modal-input-box cash-modal-input-box-bottom">
              <span className="cash-modal-input-title">银行卡账户：</span>
              <Input
                value={accountBank}
                onChange={(even) => setAccountBank(even.target.value)}
                style={{ width: "464px" }}
                placeholder="请输入银行卡账户"
              />
            </div>
            <div className="cash-modal-input-box cash-modal-input-box-bottom">
              <span className="cash-modal-input-title">开户人姓名：</span>
              <Input
                value={userName}
                onChange={(even) => setUserName(even.target.value)}
                style={{ width: "464px" }}
                placeholder="请输入开户人姓名"
              />
            </div>
            <div className="cash-modal-input-box">
              <span className="cash-modal-input-title">提现金额：</span>
              <InputNumber
                value={money}
                style={{ width: "464px" }}
                onChange={(even) => setMoney(even)}
                placeholder="请输入体现金额"
              />
            </div>
            <div
              className="cash-modal-whole-btn"
              onClick={() => setMoney(userInfo?.income)}
            >
              全部提现
            </div>
            <Button
              type="primary"
              style={{
                marginLeft: "100px",
                marginTop: "60px",
                width: "375px",
                height: "40px",
              }}
              onClick={() => cashBtn()}
            >
              立即提现
            </Button>
          </div>
        </Spin>
      </Modal>
      <Modal
        title={null}
        closeIcon={null}
        open={explainShow}
        width={960}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setExplainShow(false);
        }}
      >
        <div className="explain-modal-tabs">
          <div className="explain-modal-tabs-box">
            {explainList &&
              explainList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      index === activeExplain
                        ? "explain-modal-tabs-item explain-modal-tabs-item-active"
                        : "explain-modal-tabs-item"
                    }
                    onClick={() => setActiveExplain(index)}
                  >
                    {item}
                  </div>
                );
              })}
          </div>
          <img
            src={require("../../assets/image/close-icon.png")}
            alt=""
            className="explain-modal-close-icon"
            onClick={() => setExplainShow(false)}
          />
        </div>
        <div className="explain-title-denga">
          最终解释权归磁力聚星所有
        </div>
        <div className="explain-text-content-box">
          {activeExplain === 0 && (
            <div style={{ lineHeight: "24px" }}>
              <div>
                <span className="explain-text-bold">日卡套餐：</span>
                有效期为购买成功时起24小时，首次扫码失败自动售后。
              </div>
              <div>
                <span className="explain-text-bold">周卡套餐：</span>
                有效期为购买成功时起7天，首次扫码失败自动售后，七天内出现复扫失败可以（找客服）售后，超时无售后。
              </div>
              <div>
                <span className="explain-text-bold">月卡套餐：</span>
                效期为购买成功时起30天，首次扫码失败自动售后，一个月内出现复扫失败可以（找客服）售后，超时无售后。
              </div>
              <div>
                <span className="explain-text-bold">open，ck套餐：</span>
                只能即时售后。
              </div>
            </div>
          )}
          {/* {activeExplain === 1 && (
            <div style={{ lineHeight: "24px" }}>
              <div>
                {nameType[platformSrc]}网络虚拟财产保险条款总则
                第一条本保险合同由保险条款、投保单、保险单、保险凭证以及批单组成。凡涉及本保险合同
                的约定，均应采用书面形式。
              </div>
              <div>
                第二条投保人可以为网络虚拟财产的所有人或使用人，也可以为网络虚拟财产的运营商或交易
                平台，被保险人为对保险标的具有保险利益的网络虚拟财产的所有人。
              </div>
              <div className="explain-text-bold">保险标的</div>
              <div>
                第三条下列由投保人、被保险人拥有合法使用权的网络虚拟财产经保险单列明后可作为保险标的:
              </div>
              <div> (一)游戏账号;</div> <div>(二)游戏币;</div>
              <div> (三)游戏装备、游戏道具;</div>
              <div> (四)经保险人同意的其它虚拟财产</div>
            </div>
          )} */}
          {activeExplain === 1 && (
            <div style={{ lineHeight: "24px" }}>
              <div>
                <span className="explain-text-bold">前提条件：</span>
                用户近7天充值金额每天必须大于等于{userInfo?.total || "5000"}
                ，才可成为代理。
              </div>
              <div>
                <span className="explain-text-bold">分销规则：</span>
                代理将邀请码分享给用户，用户注册充值成功。代理可获得返利
                {userInfo?.total_income || "20%"}。
              </div>
              <div>
                <span className="explain-text-bold">结算提现：</span>
                次月1日结算上月返利。返利可用于本平台消费也可提现，提现即刻到账
              </div>
              <div>
                <span className="explain-text-bold">注意事项：</span>
                代理需每月充值{userInfo?.sum_total || "15万"}
                才可享受返利。代理本月充值不满{userInfo?.sum_total || "15万"}
                的邀请返利将清零。
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
