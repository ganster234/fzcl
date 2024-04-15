import React from "react";
import { Button, DatePicker, Input } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function DealSearch({
  data,
  changeState,
  searchResetting,
  str,
  changeRelease,
}) {
  const endDisabledDay = (current) => {
    return current && (current < dayjs(data.start_time) || current > dayjs());
  };
  return (
    <div className="search-header">
      <div className="search-input">
        <div className="search-input-item search-input-item-right">
          <div className="search-input-text">起止日期：</div>
          <div className="search-input-main">
            <DatePicker
              className="search-date-picker"
              picker="date"
              format="YYYY-MM-DD"
              value={data.start_time}
              onChange={(value) => {
                if(value){
                  changeState(value, "start_time")
                }else{
                  changeState(new Date(), "start_time")
                }
              }}
            />
            <span className="least">至</span>
            <DatePicker
              disabledDate={endDisabledDay}
              className="search-date-picker"
              picker="date"
              format="YYYY-MM-DD"
              value={data.end_time}
              onChange={(value) =>{
                if(value){
                  changeState(value, "end_time")
                }else{
                  changeState(new Date(), "end_time")
                }
              }}
            />
          </div>
        </div>
        <div className="search-input-item search-input-item-right">
          <div className="search-input-text">发布人：</div>
          <div className="search-input-main">
            <Input
              style={{ width: "200px" }}
              value={data.name}
              onChange={(even) => changeState(even.target.value, "name")}
              placeholder="请输入发布人"
            />
          </div>
        </div>
        <div className="search-input-item search-input-item-right">
          <div className="search-input-text">接单人：</div>
          <div className="search-input-main">
            <Input
              style={{ width: "200px" }}
              value={data.order_name}
              onChange={(even) => changeState(even.target.value, "order_name")}
              placeholder="请输入发布人"
            />
          </div>
        </div>
        <div className="search-input-item search-input-item-right">
          <div className="search-input-text">项目名称：</div>
          <div className="search-input-main">
            <Input
              style={{ width: "200px" }}
              value={data.price_name}
              onChange={(even) => changeState(even.target.value, "price_name")}
              placeholder="请输入项目名称"
            />
          </div>
        </div>
        <div className="search-input-item search-input-item-left search-input-item-btn">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => searchResetting()}
          >
            查询
          </Button>
          <Button
            className="resetting"
            icon={<SyncOutlined />}
            onClick={() => searchResetting("resetting")}
          >
            重置
          </Button>
        </div>
      </div>
      {str && (
        <div className="search-btn">
          <Button
            type="primary"
            style={{ borderRadius: "26px" }}
            onClick={() => changeRelease(true)}
          >
            发布需求
          </Button>
        </div>
      )}
    </div>
  );
}
