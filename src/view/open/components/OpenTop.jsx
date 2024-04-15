import React from "react";
import { Input, Button, DatePicker } from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function OpenTop({
  state,
  setStatus,
  openQuery,
  openReset,
  changeModal,
  changeExport,
  saleChange,
}) {
  const endDisabledDay = (current) => {
    return current && (current < dayjs(state.start_time) || current > dayjs());
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
  };

  return (
    <div className="open-top">
      <div className="open-top-input-btn">
        <div className="open-top-input-item">
          <div className="open-top-input-item-texts">起止日期：</div>
          <div className="open-top-date-picker">
            <DatePicker
              value={dayjs(state?.start_time)}
              disabledDate={disabledDate}
              onChange={(value) => {
                if (value) {
                  setStatus(value, "start_time");
                } else {
                  setStatus(new Date(), "start_time");
                }
              }}
              className="search-date-picker"
              style={{ width: "146px", height: "32px" }}
              picker="date"
              format="YYYY-MM-DD"
            />
            <span className="open-least">至</span>
            <DatePicker
              value={dayjs(state?.end_time)}
              disabledDate={endDisabledDay}
              onChange={(value) => {
                if (value) {
                  setStatus(value, "end_time");
                } else {
                  setStatus(new Date(), "end_time");
                }
              }}
              className="search-date-picker"
              style={{ width: "146px", height: "32px" }}
              picker="date"
              format="YYYY-MM-DD"
            />
          </div>
        </div>
        <div className="open-top-input-item">
          <div className="open-top-input-item-texts">用户名称：</div>
          <Input
            value={state?.name}
            onChange={(even) => setStatus(even.target.value, "name")}
            style={{ width: "220px", height: "32px" }}
            placeholder="请输入用户名称"
          />
        </div>
        <div className="open-top-input-item">
          <div className="open-top-input-item-texts">任务编号：</div>
          <Input
            value={state?.open_task_id}
            onChange={(even) => setStatus(even.target.value, "open_task_id")}
            style={{ width: "220px", height: "32px" }}
            placeholder="请输入任务编号"
          />
        </div>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          style={{ marginBottom: "24px" }}
          onClick={() => openQuery()}
        >
          查询
        </Button>
        <Button
          className="resetting"
          icon={<SyncOutlined />}
          style={{ marginLeft: "16px", marginBottom: "24px" }}
          onClick={() => openReset()}
        >
          重置
        </Button>
      </div>
      <div className="create-open-export">
        <Button
          type="primary"
          className="create-btn"
          onClick={() => changeModal()}
        >
          创建任务
        </Button>
        <Button
          className="open-export"
          style={{ color: "#ff9100" }}
          onClick={() => changeExport()}
        >
          open导出
        </Button>
        <Button
          style={{ marginLeft: "15px", borderRadius: "26px" }}
          onClick={() => saleChange(true)}
        >
          售后
        </Button>
      </div>
    </div>
  );
}
