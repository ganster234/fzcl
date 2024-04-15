import React from "react";

export default function ThaliItem({ changeStatus, data }) {
  const setStatus = () => {
    changeStatus();
  };
  return (
    <div
      className="thali-content-item"
      onClick={setStatus}
      style={{
        border: data.status ? "1px solid #327DFC" : "1px solid #d9d9d9",
      }}
    >
      <img src={data?.logoPath} alt="" className="thali-item-logo-path" />
      <div className="thali-item-details">
        <div className="thali-item-app-name">{data?.appName}</div>
        <div className="inventory-price">
          <span>库存：{data?.availableNum}</span>
          <span className="thali-item-pirce-color">￥{data?.defaultAppPrice}</span>
        </div>
      </div>
    </div>
  );
}
