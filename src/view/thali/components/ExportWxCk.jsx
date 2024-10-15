import React, { useState } from "react";
import { Spin, Input, Radio, Button, message } from "antd";

import { getUserOpen } from "../../../api/open";
import { exportRaw } from "../../../utils/utils";

import "./ExportWxCk.less";

export default function ExportWxCk({ closeExport }) {
  const [exportLoading, setExportLoading] = useState(false);
  const [state, setState] = useState({
    openid_task_id: "",
  });

  const cancelExport = () => {
    setState({
      openid_task_id: "",
    });
    closeExport(false);
  };

  const comExport = async () => {
    message.destroy();
    if (!state.openid_task_id) {
      return message.error("请输入内容");
    }

    setExportLoading(true);
    let result = await getUserOpen({ Sid: state.openid_task_id });
    const { code, data, msg } = result || {};
    console.log(result, "result234");
    if (code === "200") {
      exportRaw(state.openid_task_id, data, true);
      setState({
        openid_task_id: "",
      });
      closeExport(false);
    } else {
      message.error(msg);
    }
    setExportLoading(false);
  };

  return (
    <Spin spinning={exportLoading}>
      <div>
        <Input
          value={state.openid_task_id}
          onChange={(even) =>
            setState((data) => ({ ...data, openid_task_id: even.target.value }))
          }
          style={{ width: "300px" }}
          placeholder="请输入任务编号"
        ></Input>
      </div>
      <div className="wx-ck-export-item">
        {/* <Radio.Group
          onChange={(even) => setState({ ...state, type: even.target.value })}
          value={state.type}
        >
          <Radio value={1}> 登录器 </Radio>
          <Radio value={2}> 东鹏登录器 </Radio>
          <Radio value={3}>open+token格式</Radio>
        </Radio.Group> */}
      </div>
      <div className="wx-ck-export-item wx-ck-export-item-btn">
        <Button onClick={() => cancelExport()}>取消</Button>
        <Button
          type="primary"
          style={{ marginLeft: "20px" }}
          onClick={() => comExport()}
        >
          确认
        </Button>
      </div>
    </Spin>
  );
}
