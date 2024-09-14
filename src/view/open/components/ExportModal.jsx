import React, { useState } from "react";
import { Input, Spin, Radio, Button, message } from "antd";

import { getUserOpen } from "../../../api/open";
import { exportRaw } from "../../../utils/utils";

export default function ExportModal({ setExport }) {
  const userInfo = JSON.parse(sessionStorage.getItem("globalState"))?.state
    .userInfo;
  console.log(userInfo, "45545454");
  const [exportLoading, setExportLoading] = useState(false);
  const [state, setState] = useState({
    openid_task_id: "",
    type: 3,
  });

  const cancelExport = () => {
    setState({
      openid_task_id: "",
      type: 3,
    });
    setExport(false);
  };

  const comExport = async () => {
    message.destroy();
    if (!state.openid_task_id) {
    }
    if (!state.type) {
      return message.error("请选择下载类型");
    }
    setExportLoading(true);
    let result = await getUserOpen({ ...state });
    const { code, data, msg } = result || {};
    if (code === 200) {
      exportRaw(state.openid_task_id, data, true);
      setState({
        openid_task_id: "",

        type: 3,
      });
      setExport(false);
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
      {/* <div className="export-modal-item">
        <Radio.Group
          onChange={(even) => setState({ ...state, type: even.target.value })}
          value={state.type}
        >
          <Radio value={1}>登录器 </Radio>
          <Radio value={3}>open+token格式</Radio>
        </Radio.Group>
      </div> */}
      {userInfo.upload_op ? (
        <p style={{ color: "red" }}>
          提示：当前操作即将扣除{userInfo.upload_op}元，是否继续？
        </p>
      ) : (
        <></>
      )}

      <div className="export-modal-item export-modal-item-btn">
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
