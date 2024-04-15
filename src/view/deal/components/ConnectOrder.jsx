/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { Spin, Input, Button, message, Select } from "antd";
import { getThaliList } from "../../../api/thali";

import "./ReleaseNeed.less";

const { TextArea } = Input;
const { Option } = Select;

export default function ConnectOrder() {
  const [needLoading, setNeedLoading] = useState(false);
  const [needState, setNeedState] = useState({
    project: null,
    num: "",
  });
  const [packList, setPackList] = useState([]);
  useEffect(() => {
    const getPackList = async () => {
      setNeedLoading(true);
      let result = await getThaliList();
      message.destroy();
      if (result?.code===200) {
        setPackList([...result?.data]);
      } else {
        message.error(result?.msg);
      }
      setNeedLoading(false);
    };
    getPackList();
  }, []);

  //计算单价
  const projectPrice = useMemo(() => {
    let price = 0;
    const { project } = needState;
    let index =
      packList && packList.findIndex((item) => item?.app_id === project);
    if (index !== -1) {
      price = packList[index]?.pirce;
    }
    return price;
  }, [needState.project]);

  const totalPrice = useMemo(() => {
    return projectPrice * needState.num;
  }, [projectPrice, needState.num]);

  const filterOption = (input, option) => {
    return (option?.children ?? "").toLowerCase().includes(input.toLowerCase());
  };
  return (
    <Spin spinning={needLoading}>
      <div className="release-need">
        <div className="release-need-bor"></div>
        <div className="release-need-prompt">
        提示：为保证平台用户权益，你接单时应提供正确的账号密码，该项目开始时起7天内为售后时间，你可在此期间对项目存在的问题提出售后。
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
                  <Option key={index} value={item.app_id}>
                    {item.app_name}
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
            value={projectPrice}
            placeholder="请输入项目名称"
            disabled={true}
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
          <Button type="primary" style={{ width: "375px", height: "40px" }}>
            去付款
          </Button>
        </div>
      </div>
    </Spin>
  );
}
