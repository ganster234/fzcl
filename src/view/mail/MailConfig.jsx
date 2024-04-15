/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Button, message, Modal, Spin, Input, Empty } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { setAddMail, setMailMsg, setAddContent } from "../../api/mail";

import "./MailConfig.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function MailConfig() {
  const location = useLocation();
  const navigate = useNavigate();
  const [height, setHeight] = useState(600);
  const [configReleaseShow, setConfigReleaseShow] = useState(false);
  const [releaseConfigDetail, setReleaseConfigDetail] = useState({});
  const [configList, setConfigList] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [user_cocntent, setUserCocntent] = useState("");
  const [loading, setLoading] = useState(false); //加载
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0); // 总条数
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const { id } = location?.state || {};

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    // 初始化数据包括后续更新
    getMailDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getMailDetail = async () => {
    const { pagination } = tableParams;
    if (!id) {
      return;
    }
    setLoading(true);
    let { code, data, msg } =
      (await setAddMail({
        id,
        page: pagination?.current,
        limit: pagination?.pageSize,
      })) || {};
    message.destroy();
    if (code === 200) {
      setDataList([...data?.data]);
      setTotal(data?.total);
    } else {
      message.error(msg);
    }
    setLoading(false);
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  // 获取回复
  const getConfigList = async (record) => {
    const { middle_id } = record;
    setDetailLoading(true);
    let result = await setMailMsg({ middle_id });
    message.destroy();
    if (result?.code === 200) {
      setReleaseConfigDetail({ ...record });
      setConfigReleaseShow(true);
      setConfigList([...result?.data]);
    } else {
      message.error(result?.msg);
    }
    setDetailLoading(false);
  };
  // 回复
  const signMsg = async () => {
    const { middle_id } = releaseConfigDetail;
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
      setReleaseConfigDetail({});
      getMailDetail();
      setConfigReleaseShow(false);
    } else {
      message.error(msg);
    }
    setDetailLoading(false);
  };
  return (
    <>
      <ContentLayouts
        top={
          <div className="mail-config-top">
            <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
          </div>
        }
        content={
          <div className="mail-config-content">
            <Table
              rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
              scroll={{
                y: height,
              }}
              rowKey={(record) => record.id}
              loading={loading}
              pagination={{
                ...tableParams.pagination,
                total: total,
                hideOnSinglePage: false,
                showSizeChanger: true,
              }}
              onChange={handleTableChange}
              columns={[
                {
                  title: "标题",
                  dataIndex: "account",
                },
                {
                  title: "内容",
                  dataIndex: "user_cocntent",
                },
                {
                  title: "时间",
                  dataIndex: "create_time",
                },
                {
                  title: "操作",
                  render: (record) => (
                    <Button type="dashed" onClick={() => getConfigList(record)}>
                      回复
                    </Button>
                  ),
                },
              ]}
              dataSource={dataList}
            />
            <Modal
              title="回复"
              open={configReleaseShow}
              width={500}
              footer={null}
              destroyOnClose
              onCancel={() => {
                setConfigReleaseShow(false);
              }}
            >
              <Spin spinning={detailLoading}>
                <div className="msg-config-list">
                  {configList && configList.length > 0 && (
                    <>
                      {configList.map((item, index) => {
                        return (
                          <div key={index} className="msg-config-list-item">
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

                  {configList && configList.length === 0 && (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
                <div className="msg-config-input-text">
                  <Input
                    value={user_cocntent}
                    onChange={(even) => setUserCocntent(even.target.value)}
                    maxLength={120}
                    placeholder="请输入回复信息"
                  />
                </div>
                <div className="msg-config-input-text msg-config-input-btn">
                  <Button onClick={() => setConfigReleaseShow(false)}>
                    取消
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: "15px" }}
                    onClick={() => signMsg()}
                  >
                    回复
                  </Button>
                </div>
              </Spin>
            </Modal>
          </div>
        }
      ></ContentLayouts>
    </>
  );
}
