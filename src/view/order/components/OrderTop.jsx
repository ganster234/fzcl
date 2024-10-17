import React from "react";
import { Button, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

export default function OrderTop({
  stateData,
  getState,
  groupList,
  packList,
  showModalStatus,
  resetting,
  queryBtn,
}) {
  const endDisabledDay = (current) => {
    return (
      current && (current < dayjs(stateData.start_time) || current > dayjs())
    );
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
  };
  const filterOption = (input, option) =>
    (option?.children ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <div className="order-top">
      <div className="order-top-input">
        <div className="order-top-input-item">
          <div className="order-top-input-item-title">起止日期：</div>
          <div className="order-date-picker">
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
              style={{ width: "146px" }}
              picker="date"
              format="YYYY-MM-DD"
            />
            <span className="order-least">至</span>
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
              style={{ width: "146px" }}
              picker="date"
              format="YYYY-MM-DD"
            />
          </div>
        </div>
        <div className="order-top-input-item">
          <div className="order-top-input-item-title">项目ID：</div>
          <Select
            value={stateData?.appId ? stateData?.appId : null}
            style={{ width: "146px" }}
            placeholder="全部"
            optionFilterProp="children"
            showSearch
            onChange={(value) => getState(value, "appId")}
            filterOption={filterOption}
          >
            {packList &&
              packList.map((item, index) => {
                return (
                  <Option key={index} value={item.Device_Sid}>
                    {item.Device_name}
                  </Option>
                );
              })}
          </Select>
        </div>
        <div className="order-top-input-item">
          <div className="order-top-input-item-title">分组：</div>
          <Select
            value={stateData?.group_id ? stateData?.group_id : null}
            style={{ width: "146px" }}
            placeholder="全部"
            optionFilterProp="children"
            showSearch
            onChange={(value) => getState(value, "group_id")}
            filterOption={filterOption}
          >
            {groupList &&
              groupList.map((item, index) => {
                return (
                  <Option key={index} value={item.Device_gid}>
                    {item.Device_Name}
                  </Option>
                );
              })}
          </Select>
        </div>

        <div className="order-top-input-item">
          <div className="order-top-input-item-title">用户名：</div>
          <Input
            placeholder="请输入用户名"
            style={{ width: "160px" }}
            value={stateData?.account}
            onChange={(even) => getState(even.target.value, "account")}
          />
        </div>
        <div className="order-top-input-item">
          <div className="order-top-input-item-title">订单号：</div>
          <Input
            placeholder="请输入订单号"
            style={{ width: "160px" }}
            value={stateData?.order_id}
            onChange={(even) => getState(even.target.value, "order_id")}
          />
        </div>
        <div className="order-top-input-item">
          <div className="order-top-input-item-title">是否使用：</div>
          <Select
            value={stateData?.status ? stateData?.status : null}
            style={{ width: "146px" }}
            placeholder="使用状态"
            optionFilterProp="children"
            showSearch
            onChange={(value) => getState(value, "status")}
            filterOption={filterOption}
          >
            <Option value={"0"}>使用过</Option>
            <Option value={"1"}>未使用</Option>
          </Select>
        </div>
        <div className="order-top-input-item">
          <div className="order-top-input-item-title">是否售后：</div>
          <Select
            value={stateData?.aftersaleed ? stateData?.aftersaleed : null}
            style={{ width: "146px" }}
            placeholder="是否售后"
            optionFilterProp="children"
            showSearch
            onChange={(value) => getState(value, "aftersaleed")}
            filterOption={filterOption}
          >
            <Option value={""}>全部</Option>
            <Option value={"0"}>未售后</Option>
            <Option value={"1"}>已售后</Option>
          </Select>
        </div>
        <Button
          type="primary"
          style={{ margin: "24px 0 0 0" }}
          onClick={() => queryBtn()}
        >
          查询
        </Button>
        <Button style={{ margin: "24px 0 0 16px" }} onClick={() => resetting()}>
          重置
        </Button>
      </div>
      <div className="order-top-batch">
        {/* <Button
          className="batch-export"
          style={{ color: "#fff" }}
          onClick={() => showModalStatus(true, "showExport")}
        >
          订单导出
        </Button> */}
        {/* <Button
          className="batch-group"
          style={{ color: "#FF9100" }}
          onClick={() => showModalStatus(true, "showGroup")}
        >
          批量分组
        </Button>
        <Button
          className="batch-delete"
          style={{ color: "#FF6363" }}
          onClick={() => showModalStatus(true, "showDelete")}
        >
          批量删除
        </Button> */}
      </div>
    </div>
  );
}
