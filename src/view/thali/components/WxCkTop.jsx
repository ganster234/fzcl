import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Modal, message } from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { setAftermarket } from "../../../api/open";
import ExportWxCk from "./ExportWxCk";

import "./WxCkTop.less";

export default function WxCkTop({ state, changeState, ckQueryReset }) {
  const [exportWxCk, setExportWxCk] = useState(false);
  const [saleWxCk, setSaleWxCk] = useState(false);
  const [saleWxCkNumber, setSaleWxCkNumber] = useState("");
  const [saleWxCkConfirmLoading, setSaleWxCkConfirmLoading] = useState(false);
  
  // useEffect(() => {
  //   const { state } = location;
  //   if (state?.app_id && state?.num) {
  //     setCreateTask(true);
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const endDisabledDay = (current) => {
    return current && (current < dayjs(state.Stime) || current > dayjs());
  };

  const disabledDate = (current) => {
    return current && current > dayjs();
  };


  const comSale = async () => {
    if (!saleWxCkNumber) {
      return message.error("请输入任务编号");
    }
    setSaleWxCkConfirmLoading(true);
    let result = await setAftermarket({
      openid_task_id: saleWxCkNumber,
      is_qq: "2",
    });
    if (result?.code === 200) {
      message.success("提交成功");
      setSaleWxCkConfirmLoading(false);
      setSaleWxCk(false);
    } else {
      message.error(result?.msg);
    }
    setSaleWxCkConfirmLoading(false);
  };

  return (
    <>
      <div className="wx-ck-top">
        <div className="wx-ck-top-input-btn">
          <div className="wx-ck-top-input-item">
            <div className="wx-ck-top-input-item-texts">起止日期：</div>
            <div className="wx-ck-top-date-picker">
              <DatePicker
                value={dayjs(state?.Stime)}
                disabledDate={disabledDate}
                onChange={(value) => {
                  if (value) {
                    changeState("Stime", value);
                  } else {
                    changeState("Stime", new Date());
                  }
                }}
                className="search-date-picker"
                style={{ width: "146px", height: "32px" }}
                picker="date"
                format="YYYY-MM-DD"
              />
              <span className="wx-ck-least">至</span>
              <DatePicker
                value={dayjs(state?.Etime)}
                disabledDate={endDisabledDay}
                onChange={(value) => {
                  if (value) {
                    changeState("Etime", value);
                  } else {
                    changeState("Etime", new Date());
                  }
                }}
                className="search-date-picker"
                style={{ width: "146px", height: "32px" }}
                picker="date"
                format="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="wx-ck-top-input-item">
            <div className="wx-ck-top-input-item-texts">用户名称：</div>
            <Input
              value={state?.Username}
              onChange={(even) => changeState("name", even.target.value)}
              style={{ width: "220px", height: "32px" }}
              placeholder="请输入用户名称"
            />
          </div>
          <div className="wx-ck-top-input-item">
            <div className="wx-ck-top-input-item-texts">任务编号：</div>
            <Input
              value={state?.Sid}
              onChange={(even) =>
                changeState("open_task_id", even.target.value)
              }
              style={{ width: "220px", height: "32px" }}
              placeholder="请输入任务编号"
            />
          </div>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ marginBottom: "24px" }}
            onClick={() => ckQueryReset()}
          >
            查询
          </Button>
          <Button
            className="resetting"
            icon={<SyncOutlined />}
            style={{ marginLeft: "16px", marginBottom: "24px" }}
            onClick={() => ckQueryReset("reset")}
          >
            重置
          </Button>
        </div>
        <div className="create-wx-ck-export">
          <Button
            className="wx-ck-export"
            style={{ color: "#ff9100" }}
            onClick={() => setExportWxCk(true)}
          >
            ck导出
          </Button>
          {/* <Button
            style={{ marginLeft: "15px", borderRadius: "26px" }}
            onClick={() => setSaleWxCk(true)}
          >
            售后
          </Button> */}
        </div>
      </div>
      <Modal
        title="ck导出"
        open={exportWxCk}
        width={450}
        footer={null}
        destroyOnClose
        onCancel={() => setExportWxCk(false)}
      >
        {exportWxCk && <ExportWxCk closeExport={() => setExportWxCk(false)} />}
      </Modal>
      <Modal
        title="售后"
        open={saleWxCk}
        width={450}
        destroyOnClose
        confirmLoading={saleWxCkConfirmLoading}
        onOk={() => comSale()}
        onCancel={() => {
          setSaleWxCkNumber("");
          setSaleWxCk(false);
        }}
      >
        <div style={{ color: "red", padding: "12px 0", textAlign: "center" }}>
          提示：请勿乱提交售后，如果非法售后账号将被封停。
        </div>
        <div>
          <Input
            placeholder="请输入任务编号"
            value={saleWxCkNumber}
            onChange={(even) => setSaleWxCkNumber(even.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
