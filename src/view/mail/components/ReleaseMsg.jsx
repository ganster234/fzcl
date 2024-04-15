import React, { useState } from "react";
import { Input, Button, message, Spin } from "antd";

import { getMailAdd } from "../../../api/mail.js";

import "./ReleaseMsg.less";

const { TextArea } = Input;

export default function ReleaseMsg({ cancelRelease }) {
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [state, setState] = useState({
    title: "",
    content: "",
  });

  const releaseBtn = async () => {
    const { title, content } = state;
    message.destroy()
    if (!title) {
      return message.error("请输入发布标题");
    }
    if (!content) {
      return message.error("请输入发布内容");
    }
    setReleaseLoading(true);
    let result = await getMailAdd({ title, content });
    if (result?.code === 200) {
      message.success("发布成功");
      cancelRelease();
      setReleaseLoading(false);
    } else {
      message.success(result?.msg);
      setReleaseLoading(false);
    }
  };
  return (
    <>
      <Spin spinning={releaseLoading}>
        <div className="release-msg-item">
          <Input
            placeholder="请输入发布标题"
            value={state?.title}
            onChange={(even) => {
              setState((item) => ({ ...item, title: even.target.value }));
            }}
          />
        </div>
        <div className="release-msg-item">
          <TextArea
            placeholder="请输入发布内容"
            style={{ height: 120, resize: "none" }}
            value={state?.content}
            onChange={(even) => {
              setState((item) => ({ ...item, content: even.target.value }));
            }}
          />
        </div>
        <div className="release-msg-item release-msg-item-btn">
          <Button onClick={() => cancelRelease("reset")}>取消</Button>
          <Button
            type="primary"
            style={{ marginLeft: "16px" }}
            onClick={() => releaseBtn()}
          >
            确认
          </Button>
        </div>
      </Spin>
    </>
  );
}
