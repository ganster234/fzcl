import React, { useState, useEffect } from "react";
import { DatePicker, Button, Select, message } from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getProjectPackList } from "../../../api/project";
import activeRadio from "../../../assets/image/project/active-radio.png";
import radio from "../../../assets/image/project/radio.png";

const { Option } = Select;

export default function CountTop({
  stateData,
  getState,
  queryCountList,
  resettingList,
}) {
  const [radioList] = useState([
    {
      title: "查询扫码次数",
      type: 0,
    },
    {
      title: "所有销售渠道总金额",
      type: 1,
    },
    {
      title: "统计每个项目总销售额（QQ）",
      type: 2,
    },
    {
      title: "统计每个项目总销售额（wx）",
      type: 6,
    },
    {
      title: "售后信息",
      type: 3,
    },
    {
      title: "open销售总额",
      type: 4,
    },
    {
      title: "周卡售后",
      type: 5,
    },
  ]);
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    (() => {
      prohectList();
    })();
  }, []);
  const changRop = (index) => {
    if (stateData.active === index) {
      return;
    }
    getState(index, "active");
  };
  const endDisabledDay = (current) => {
    return (
      current && (current < dayjs(stateData.start_time) || current > dayjs())
    );
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
  };

  const prohectList = async () => {
    let result = await getProjectPackList();
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      setPriceList([...data?.price]);
    } else {
      message.error(msg);
    }
  };

  const queryBtn = () => {
    queryCountList();
  };

  const resettingBtn = () => {
    resettingList();
  };
  return (
    <div className="count-top">
      <div className="top-screen">筛选：</div>
      <div className="top-radio">
      {radioList &&
          radioList.map((item, index) => {
            return (
              <div
                key={index}
                className="top-radio-item"
                onClick={() => changRop(item.type)}
              >
                <img
                  src={stateData.active === item.type ? activeRadio : radio}
                  alt=""
                  className="top-radio-item-img"
                />
                <span>{item.title}</span>
              </div>
            );
          })}
      </div>
      <div className="count-input-btn">
        <div className="count-input-btn-item">
          <div className="count-input-title">起止日期：</div>
          <div className="count-data-time">
            <DatePicker
              value={dayjs(stateData?.start_time)}
              onChange={(even) => {
                if (even) {
                  getState(even, "start_time");
                } else {
                  getState(new Date(), "start_time");
                }
              }}
              disabledDate={disabledDate}
              className="search-date-picker"
              picker="date"
              format="YYYY-MM-DD"
            />
            <span className="least">至</span>
            <DatePicker
              value={dayjs(stateData?.end_time)}
              onChange={(even) => {
                if (even) {
                  getState(even, "end_time");
                } else {
                  getState(new Date(), "end_time");
                }
              }}
              disabledDate={endDisabledDay}
              className="search-date-picker"
              picker="date"
              format="YYYY-MM-DD"
            />
          </div>
        </div>
        {stateData.active === 4 && (
          <div className="count-input-btn-item">
            <div className="count-input-title">搜索关键字：</div>
            <div className="count-data-time">
              <Select
                showSearch
                style={{ width: "156px" }}
                value={stateData.app_id}
                placeholder="请输入搜索关键字"
                onChange={(value) => {
                  getState(value, "app_id");
                }}
                filterOption={(inputValue, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                allowClear
              >
                {priceList &&
                  priceList.map((item) => {
                    return (
                      <Option key={item.id} value={item.app_id}>
                        {item.app_name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </div>
        )}
        <Button type="primary" icon={<SearchOutlined />} onClick={queryBtn}>
          查询
        </Button>
        <Button
          className="resetting"
          icon={<SyncOutlined />}
          style={{ marginLeft: "16px" }}
          onClick={resettingBtn}
        >
          重置
        </Button>
      </div>
    </div>
  );
}
