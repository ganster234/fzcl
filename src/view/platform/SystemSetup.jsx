import React, { useEffect, useState } from "react";
import { Button, Input, InputNumber, message, Spin } from "antd";
import useAppStore from "../../store";

import { getRate, getRateUpdate } from "../../api/setup.js";
import { getUser } from "../../api/login";

import "./SystemSetup.less";

export default function SystemSetup() {
  const setUserInfo = useAppStore((state) => state.getUserInfo); //设置用户信息
  const [state, setState] = useState({
    rateId: "", //汇率ID
    rate: "", //汇率
    addressId: "", //钱包地址ID
    address: "", //钱包地址
    discountId: "", //优惠折扣Id
    discount: "", //优惠折扣
    insureId: "", //保险比例ID
    insure: "", //保险比例
    fiveId: "", //充值五百ID
    five: "", //充值五百赠送百分之几
    thousandId: "", //充值一千ID
    thousand: "", //充值一千赠送百分之几
    one_thousandID: "", //充值一万ID
    one_thousand: "", //充值一万赠送百分之几
    hundredUsdtId: "", //充值一百USDT ID
    hundredUsdt: "", //充值一百USDT
    two_hundredUsdtId: "", //充值两百USDT ID
    two_hundredUsdt: "", //充值两百USDT
    five_hundredUsdtId: "", //充值五百USDT ID
    five_hundredUsdt: "", //充值五百USDT
    thousandUsdtUsdtId: "", //充值一千USDT ID
    thousandUsdtUsdt: "", //充值一千USDT
  });
  const [setupLoading, setSetupLoading] = useState(false);
  useEffect(() => {
    getRateList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRateList = async () => {
    setSetupLoading(true);
    let result = await getRate();
    if (result?.code === 200) {
      setState((data) => ({
        ...data,
        rateId: result?.data[0] && result?.data[0].config_id,
        rate: result?.data[0] && result?.data[0].notice,
        addressId: result?.data[1] && result?.data[1].config_id,
        address: result?.data[1] && result?.data[1].notice,
        discountId: result?.data[2] && result?.data[2].config_id,
        discount: result?.data[2] && result?.data[2].notice,
        insureId: result?.data[3] && result?.data[3].config_id,
        insure: result?.data[3] && result?.data[3].notice,
        fiveId: result?.data[4] && result?.data[4].config_id, //充值五百ID
        five: result?.data[4] && result?.data[4].notice, //充值五百赠送百分之几
        thousandId: result?.data[5] && result?.data[5].config_id, //充值一千ID
        thousand: result?.data[5] && result?.data[5].notice, //充值一千赠送百分之几
        hundredUsdtId: result?.data[6] && result?.data[6].config_id, //充值一百USDT ID
        hundredUsdt: result?.data[6] && result?.data[6].notice, //充值一百USDT
        two_hundredUsdtId: result?.data[7] && result?.data[7].config_id, //充值两百USDT ID
        two_hundredUsdt: result?.data[7] && result?.data[7].notice, //充值两百USDT
        five_hundredUsdtId: result?.data[8] && result?.data[8].config_id, //充值五百USDT ID
        five_hundredUsdt: result?.data[8] && result?.data[8].notice, //充值五百USDT
        one_thousandID: result?.data[9] && result?.data[9].config_id, //充值一万ID
        one_thousand: result?.data[9] && result?.data[9].notice, //充值一万赠送百分之几
        thousandUsdtUsdtId: result?.data[10] && result?.data[10].config_id, //充值一千USDT ID
        thousandUsdtUsdt: result?.data[10] && result?.data[10].notice, //充值一千USDT
      }));
    } else {
      message.error(result?.msg);
    }
    setSetupLoading(false);
  };

  const setSetup = async () => {
    const {
      rateId, //汇率ID
      rate, //汇率
      addressId, //钱包地址ID
      address, //钱包地址
      discountId, //优惠折扣Id
      discount, //优惠折扣
      insureId, //保险比例ID
      insure, //保险比例
      fiveId, //充值五百ID
      five, //充值五百赠送百分之几
      thousandId, //充值一千ID
      thousand, //充值一千赠送百分之几
      one_thousandID, //充值一万ID
      one_thousand, //充值一万赠送百分之几
      hundredUsdtId, //充值一百USDT ID
      hundredUsdt, //充值一百USDT
      two_hundredUsdtId, //充值两百USDT ID
      two_hundredUsdt, //充值两百USDT
      five_hundredUsdtId, //充值五百USDT ID
      five_hundredUsdt, //充值五百USDT
      thousandUsdtUsdtId, //充值一千USDT ID
      thousandUsdtUsdt, //充值一千USDT
    } = state;
    let param = [
      { config_id: rateId, notice: rate },
      { config_id: addressId, notice: address },
      { config_id: discountId, notice: discount },
      { config_id: insureId, notice: insure },
      { config_id: fiveId, notice: five },
      { config_id: thousandId, notice: thousand },
      { config_id: one_thousandID, notice: one_thousand },
      { config_id: hundredUsdtId, notice: hundredUsdt },
      { config_id: two_hundredUsdtId, notice: two_hundredUsdt },
      { config_id: five_hundredUsdtId, notice: five_hundredUsdt },
      { config_id: thousandUsdtUsdtId, notice: thousandUsdtUsdt },
    ];
    setSetupLoading(true);
    let result = await getRateUpdate({ noticeList: param });
    message.destroy();
    if (result?.code === 200) {
      message.success("修改成功");
      getUserInfo();
    } else {
      message.error(result?.msg);
    }
    setSetupLoading(false);
  };

  // 获取用户信息
  const getUserInfo = async () => {
    let result = await getUser();
    const { code, data, msg } = result || {};
    if (code === 200) {
      setUserInfo(data);
    } else {
      message.destroy();
      message.open({
        type: "error",
        content: msg,
      });
    }
  };
  return (
    <div className="systems-setup">
      <Spin spinning={setupLoading}>
        <div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">兑换汇率：</span>
            <InputNumber
              value={state.rate}
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, rate: even }));
              }}
            />
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">钱包链接：</span>
            <Input
              style={{ width: "460px" }}
              value={state.address}
              onChange={(even) => {
                setState((data) => ({ ...data, address: even.target.value }));
              }}
            />
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">优惠折扣：</span>
            <InputNumber
              value={state.discount}
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, discount: even }));
              }}
            />
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">保险比例：</span>
            <InputNumber
              value={state?.insure}
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, insure: even }));
              }}
            />
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">充值五百：</span>
            <InputNumber
              value={state?.five}
              style={{ width: "460px" }}
              addonAfter="%"
              onChange={(even) => {
                setState((data) => ({ ...data, five: even }));
              }}
            />
            <span style={{ color: "red", marginLeft: "5px" }}>赠送</span>
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">充值一千：</span>
            <InputNumber
              value={state?.thousand}
              onChange={(even) => {
                setState((data) => ({ ...data, thousand: even }));
              }}
              style={{ width: "460px" }}
              addonAfter="%"
            />
            <span style={{ color: "red", marginLeft: "5px" }}>赠送</span>
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">充值一万：</span>
            <InputNumber
              value={state?.one_thousand}
              placeholder="全场折扣"
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, one_thousand: even }));
              }}
            />
            <span style={{ color: "red", marginLeft: "5px" }}>全场折扣</span>
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">一百USDT：</span>
            <InputNumber
              value={state?.hundredUsdt}
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, hundredUsdt: even }));
              }}
            />
            <span style={{ color: "red", marginLeft: "5px" }}>赠送</span>
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">两百USDT：</span>
            <InputNumber
              value={state?.two_hundredUsdt}
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, two_hundredUsdt: even }));
              }}
            />
            <span style={{ color: "red", marginLeft: "5px" }}>赠送</span>
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">五百USDT：</span>
            <InputNumber
              value={state?.five_hundredUsdt}
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, five_hundredUsdt: even }));
              }}
            />
            <span style={{ color: "red", marginLeft: "5px" }}>赠送</span>
          </div>
          <div className="systems-setup-item">
            <span className="systems-setup-item-title">一千USDT：</span>
            <InputNumber
              value={state?.thousandUsdtUsdt}
              style={{ width: "460px" }}
              onChange={(even) => {
                setState((data) => ({ ...data, thousandUsdtUsdt: even }));
              }}
            />
            <span style={{ color: "red", marginLeft: "5px" }}>全场折扣</span>
          </div>

          <div className="systems-setup-btn">
            <Button type="primary" onClick={() => setSetup()}>
              修改系统配置
            </Button>
          </div>
        </div>
      </Spin>
    </div>
  );
}
