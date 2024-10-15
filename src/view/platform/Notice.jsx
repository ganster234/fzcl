import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";

import { getNotice, postUpdateNotice } from "../../api/notice";
import { message } from "antd";

import "./Notice.less";
const { TextArea } = Input;

// 公告管理
export default function Notice() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({});
  const getNoticeData = async () => {
    let result = await getNotice();
    message.destroy();
    // return console.log(result, "result");

    // eslint-disable-next-line eqeqeq
    if (result?.code == 200) {
      setState(() => ({ ...result?.data[0] }));
    } else {
      message.error(result?.msg);
    }
  };

  useEffect(() => {
    (() => {
      getNoticeData();
    })();
  }, []);

  const renew = async () => {
    // if (!state.Device_Remark) {
    //   return;
    // }
    setLoading(true);
    let result = await postUpdateNotice({ Remark: state.Device_Remark });
    message.destroy();
    // eslint-disable-next-line eqeqeq
    if (result?.code == 200) {
      message.success("发布成功");
      await getNoticeData();
    } else {
      message.error(result?.msg);
    }
    setLoading(false);
  };
  return (
    <div className="notice">
      <div className="notice-title">最多100字符，为空取消公告</div>
      <div className="notice-main">
        <div className="notice-content-title">公告内容：</div>
        <div className="notice-textarea-btn">
          <TextArea
            value={state.Device_Remark}
            style={{
              height: 260,
              padding: 24,
              resize: "none",
            }}
            onChange={(even) =>
              setState((data) => {
                return { ...data, Device_Remark: even.target.value };
              })
            }
          />
          <Button
            loading={loading}
            type="primary"
            onClick={() => renew()}
            style={{ marginTop: "62px", width: "375px", height: "50px" }}
          >
            发布公告
          </Button>
        </div>
      </div>
    </div>
  );
}
