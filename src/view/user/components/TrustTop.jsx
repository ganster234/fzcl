import React from "react";
import { Button, Select, DatePicker } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

export default function TrustTop({
  dataState,
  changeState,
  resetting,
  changeDepositShow,
  queryTrust,
  addedTrust,
  batchCancel,
}) {
  const endDisabledDay = (current) => {
    return (
      current && (current < dayjs(dataState.start_time) || current > dayjs())
    );
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
  };
  const filterOption = (input, option) => {
    return (option?.children ?? "").toLowerCase().includes(input.toLowerCase());
  };
  return (
    <div className="trust-top">
      <div className="trust-top-input">
        <div className="trust-top-input-item">
          <div className="trust-input-title">起止日期：</div>
          <div className="trust-input-data-time">
            <DatePicker
              value={dataState.start_time}
              disabledDate={disabledDate}
              onChange={(value) => {
                if (value) {
                  changeState(value, "start_time");
                } else {
                  changeState(new Date(), "start_time");
                }
              }}
              className="search-date-picker"
              picker="date"
              format="YYYY-MM-DD"
            />
            <span className="trust-least">至</span>
            <DatePicker
              value={dataState.end_time}
              disabledDate={endDisabledDay}
              onChange={(value) => {
                if (value) {
                  changeState(value, "end_time");
                } else {
                  changeState(new Date(), "end_time");
                }
              }}
              className="search-date-picker"
              picker="date"
              format="YYYY-MM-DD"
            />
          </div>
        </div>
        <div className="trust-top-input-item">
          <div className="trust-input-title">类型：</div>
          <Select
            value={dataState.type}
            style={{ width: "160px" }}
            optionFilterProp="children"
            placeholder="全部"
            onChange={(value) => changeState(value, "type")}
            showSearch
            allowClear
            filterOption={filterOption}
          >
            <Option value={-1}>全部</Option>
            <Option value={0}>都包含</Option>
            <Option value={1}>open</Option>
            <Option value={2}>代销</Option>
            <Option value={3}>ck</Option>
          </Select>
        </div>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          style={{ margin: "0 0 24px 0" }}
          onClick={() => queryTrust()}
        >
          查询
        </Button>
        <Button
          className="resetting"
          icon={<SyncOutlined />}
          style={{ margin: "0 0 24px 16px" }}
          onClick={() => resetting()}
        >
          重置
        </Button>
      </div>
      <div className="trust-top-btn-item">
        <Button
          type="primary"
          style={{ borderRadius: "26px" }}
          onClick={() => changeDepositShow(true)}
        >
          新增托管
        </Button>
        <Button className="batch-addition" onClick={() => addedTrust(true)}>
          批量新增托管
        </Button>
        <Button
          danger
          className="cancel-trust-ship"
          onClick={() => batchCancel()}
        >
          取消托管
        </Button>
      </div>
    </div>
  );
}
