import React from "react";
import { DatePicker, Input, Button, Select } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function ScanHead({ state, getState, scanSearch, resetting }) {
  const endDisabledDay = (current) => {
    return current && (current < dayjs(state.start_time) || current > dayjs());
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <div className="scan-top">
      <div className="scan-top-item">
        <div className="scan-top-item-title">起止日期：</div>
        <div className="start-end-time">
          <DatePicker
            value={dayjs(state?.start_time)}
            disabledDate={disabledDate}
            className="search-date-picker"
            picker="date"
            onChange={(value) => {
              if (value) {
                getState(value, "start_time");
              } else {
                getState(new Date(), "start_time");
              }
            }}
            format="YYYY-MM-DD"
          />
          <span className="least">至</span>
          <DatePicker
            value={dayjs(state?.end_time)}
            disabledDate={endDisabledDay}
            onChange={(value) => {
              if (value) {
                getState(value, "end_time");
              } else {
                getState(new Date(), "end_time");
              }
            }}
            className="search-date-picker"
            picker="date"
            format="YYYY-MM-DD"
          />
        </div>
      </div>
      <div className="scan-top-item">
        <div className="scan-top-item-title">appid：</div>
        <Input
          value={state.app_id}
          onChange={(even) => getState(even.target.value, "app_id")}
          placeholder="请输入appid"
          style={{ width: "160px", height: "32px" }}
        />
      </div>
      {/* <div className="scan-top-item">
        <div className="scan-top-item-title">订单号：</div>
        <Input
          value={state.order_id}
          onChange={(even) => getState(even.target.value, "order_id")}
          placeholder="请输入名称"
          style={{ width: "160px", height: "32px" }}
        />
      </div> */}
      <div className="scan-top-item">
        <div className="scan-top-item-title">名称：</div>
        <Input
          value={state.account}
          onChange={(even) => getState(even.target.value, "account")}
          placeholder="请输入名称"
          style={{ width: "160px", height: "32px" }}
        />
      </div>
      <div className="scan-top-item">
        <div className="scan-top-item-title">扫码类型：</div>
        <Select
          value={state.auth_state}
          showSearch
          style={{ width: "146px", height: "32px" }}
          placeholder="全部"
          optionFilterProp="children"
          onChange={(value) => getState(value, "auth_state")}
          filterOption={filterOption}
          options={[
            {
              value: "",
              label: "全部",
            },
            {
              value: "1",
              label: "成功",
            },
            {
              value: "2",
              label: "失败",
            },
          ]}
        />
      </div>
      <div className="scan-top-item">
        <div className="scan-top-item-title">扫码状态：</div>
        <Select
          value={state.first_auth}
          showSearch
          style={{ width: "146px", height: "32px" }}
          placeholder="全部"
          optionFilterProp="children"
          onChange={(value) => getState(value, "first_auth")}
          filterOption={filterOption}
          options={[
            {
              value: "",
              label: "全部",
            },
            {
              value: "1",
              label: "首次扫码",
            },
            {
              value: "2",
              label: "多次扫码",
            },
          ]}
        />
      </div>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={() => scanSearch()}
      >
        查询
      </Button>
      <Button
        className="resetting"
        icon={<SyncOutlined />}
        style={{ marginLeft: "16px" }}
        onClick={() => resetting()}
      >
        重置
      </Button>
    </div>
  );
}
