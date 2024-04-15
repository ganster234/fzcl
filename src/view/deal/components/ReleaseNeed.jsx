/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { Spin, Input, Button, message, Select } from "antd";
import useAppStore from "../../../store";

import { setAddDeal } from "../../../api/deal";
import { getUser } from "../../../api/login";
import { getThaliList } from "../../../api/thali";

import "./ReleaseNeed.less";

const { TextArea } = Input;
const { Option } = Select;

export default function ReleaseNeed({ changeRelease }) {
  const setUserInfo = useAppStore((state) => state.getUserInfo);
  const [needLoading, setNeedLoading] = useState(false);
  const [needState, setNeedState] = useState({
    project: null,
    num: "",
    remark: "",
    price: "",
  });
  const [packList, setPackList] = useState([]);
  useEffect(() => {
    const getPackList = async () => {
      setNeedLoading(true);
      let result = await getThaliList();
      message.destroy();
      if (result?.code === 200) {
        if (result?.data && result?.data?.appPriceList) {
          setPackList([...result?.data?.appPriceList]);
        }
      } else {
        message.error(result?.msg);
      }
      setNeedLoading(false);
    };
    if (packList && packList.length === 0) {
      getPackList();
    }
  }, []);

  //计算单价
  const projectPrice = useMemo(() => {
    let price = 0;
    const { project } = needState;
    let index = packList && packList.findIndex((item) => item?.id === project);
    if (index !== -1) {
      price = packList[index]?.pirce;
      setNeedState({
        ...needState,
        price,
      });
    }
  }, [needState.project]);

  const totalPrice = useMemo(() => {
    return needState.price * needState.num;
  }, [needState.price, needState.num]);

  //发布需求
  const payment = async () => {
    const { project, num, price, remark } = needState;
    message.destroy();
    if (!project) {
      return message.error("请选择项目");
    }
    if (!num) {
      return message.error("请输入数量");
    }
    let param = {
      price_id: project + "",
      price: price + "",
      num: num,
      remark: remark,
    };
    setNeedLoading(true);
    let result = await setAddDeal(param);
    if (result?.code === 200) {
      setNeedState({
        project: null,
        num: "",
        remark: "",
      });
      setNeedLoading(false);
      message.success("创建成功");
      // 刷新本地信息
      getUserInfo();
      changeRelease(false, "success");
    } else {
      message.error(result?.msg);
    }
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

  const filterOption = (input, option) => {
    return (option?.children ?? "").toLowerCase().includes(input.toLowerCase());
  };
  return (
    <Spin spinning={needLoading}>
      <div className="release-need">
        <div className="release-need-bor"></div>
        <div className="release-need-prompt">
          提示：为保证平台用户权益，你发布需求时应保证在平台账户内余额充足，我们将在您发布需求时立即将该款项冻结。以保证用户接单时顺利转至该用户账户中。该项目开始时起7天内为售后时间，你可在此期间对项目存在的问题提出售后。
        </div>
        <div className="release-need-input-item release-need-input-item-align">
          <div className="need-input-item-title">
            <span className="need-input-item-test">*</span>
            <span>项目名称:</span>
          </div>
          <Select
            value={needState?.project}
            onChange={(value) =>
              setNeedState((data) => ({ ...data, project: value }))
            }
            style={{ width: "464px", height: "35px" }}
            placeholder="请选择项目"
            optionFilterProp="children"
            showSearch
            filterOption={filterOption}
          >
            {packList &&
              packList.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.appName}
                  </Option>
                );
              })}
          </Select>
        </div>
        <div className="release-need-input-item release-need-input-item-align">
          <div className="need-input-item-title">
            <span className="need-input-item-test">*</span>
            <span>单价:</span>
          </div>
          <Input
            value={needState?.price}
            onChange={(even) =>
              setNeedState((data) => ({ ...data, price: even.target.value }))
            }
            placeholder="请输入项目名称"
            style={{ width: "464px", height: "35px" }}
          />
        </div>
        <div className="release-need-input-item release-need-input-item-align">
          <div className="need-input-item-title">
            <span className="need-input-item-test">*</span>
            <span>数量:</span>
          </div>
          <Input
            value={needState?.num}
            onChange={(even) =>
              setNeedState((data) => ({ ...data, num: even.target.value }))
            }
            placeholder="请输入项目名称"
            style={{ width: "464px", height: "35px" }}
          />
        </div>
        <div className="release-need-input-item">
          <div className="need-input-item-title">
            <span>说明描述:</span>
          </div>
          <TextArea
            value={needState?.remark}
            onChange={(even) => {
              setNeedState((data) => ({ ...data, remark: even.target.value }));
            }}
            placeholder="您可以这么说：（急需500个王者荣耀账号）"
            style={{ width: "464px", height: "120px", resize: "none" }}
          />
        </div>
        <div className="release-need-input-item">
          <div className="need-input-item-title">
            <span>立即结算:</span>
          </div>
          <div className="need-input-item-right">
            <div className="need-input-right-item">
              <span className="need-right-item-title">项目单价：</span>
              <span>￥{projectPrice || 0}</span>
            </div>
            <div className="need-input-right-item">
              <span className="need-right-item-title">项目数量：</span>
              <span>{needState?.num || 0}</span>
            </div>
            <div className="need-input-right-item">
              <span className="need-right-item-title">实付总额：</span>
              <span className="need-input-right-item-money">
                ￥{totalPrice?.toFixed(2) || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="release-need-input-item">
          <Button
            type="primary"
            style={{ width: "375px", height: "40px" }}
            onClick={() => payment()}
          >
            去付款
          </Button>
        </div>
      </div>
    </Spin>
  );
}
