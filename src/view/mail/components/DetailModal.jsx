/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input, Button, Empty, Spin, message } from "antd";

import { setMailMsg, setAddContent } from "../../../api/mail";

import "./DetailModal.less";

export default function ReleaseDetail({ releaseDetail, cancelDetail }) {
  const [detailLoading, setDetailLoading] = useState(false); //加载中
  const [user_cocntent, setUserCocntent] = useState(""); //回复信息
  const [detailList, setDetailList] = useState([]); //回复LIST
  useEffect(() => {
    getMailDetail();
  }, []);

  const getMailDetail = async () => {
    const { middle_id } = releaseDetail;
    setDetailLoading(true);
    let result = await setMailMsg({ middle_id });
    message.destroy();
    if (result?.code === 200) {
      setDetailList([...result?.data]);
    } else {
      message.error(result?.msg);
    }
    setDetailLoading(false);
  };

  const signMsg = async () => {
    const { middle_id } = releaseDetail;
    if (!middle_id) {
      return;
    }
    if (!user_cocntent) {
      return message.error("请输入回复信息");
    }
    setDetailLoading(true);
    let { code, msg } = await setAddContent({
      user_cocntent,
      middle_id: middle_id + "",
    });
    if (code === 200) {
      message.success("回复成功");
      setUserCocntent("");
      getMailDetail();
      cancelDetail();
    } else {
      message.error(msg);
    }
    setDetailLoading(false);
  };
  return (
    <>
      <Spin spinning={detailLoading}>
        <div className="msg-detail-list">
          {detailList && detailList.length > 0 && (
            <>
              {detailList.map((item, index) => {
                return (
                  <div key={index} className="msg-detail-list-item">
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#323232",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{item?.account}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#999999",
                          fontWeight: "normal",
                        }}
                      >
                        {item?.create_time}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#353535",
                        fontWeight: "400",
                      }}
                    >
                      {item?.user_cocntent}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {detailList && detailList.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
        <div className="msg-detail-input-text">
          <Input
            value={user_cocntent}
            onChange={(even) => setUserCocntent(even.target.value)}
            maxLength={120}
            placeholder="请输入回复信息"
          />
        </div>
        <div className="msg-detail-input-text msg-detail-input-btn">
          <Button onClick={() => cancelDetail("cancel")}>取消</Button>
          <Button
            type="primary"
            style={{ marginLeft: "15px" }}
            onClick={() => signMsg()}
          >
            回复
          </Button>
        </div>
      </Spin>
    </>
  );
}
