import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {  Button, Table, message, Select, Modal } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getMailList } from "../../api/mail";
import ReleaseMsg from "./components/ReleaseMsg.jsx";
import DetailModal from "./components/DetailModal.jsx";
import "./Mail.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function Mail() {
  const role = sessionStorage.getItem("role") || "role"; //用户信息
  const navigate = useNavigate();
  const [releaseDetail, setReleaseDetail] = useState({}); //回复的信息详情
  const [releaseDetailShow, setReleaseDetailShow] = useState(false); //回复的信息详情
  const [releaseShow, setReleaseShow] = useState(false); //显示发布弹窗
  const [height, setHeight] = useState(600);
  const [state, setState] = useState({
    is_user: "-1",
  });
  const [loading, setLoading] = useState(false); //加载
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    // 初始化数据包括后续更新
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (account) => {
    const { current, pageSize } = tableParams.pagination;
    const { is_user } = state;
    setLoading(true);
    let result = await getMailList({
      page: account ? 1 : current,
      limit: account ? 10 : pageSize,
      is_user: account ? "-1" : is_user,
    });
    const { code, msg, data } = result || {};
    if (code === 200) {
      setDataList([...data?.data]);
      setTotal(data?.total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  const scanSearch = () => {
    let pagination = { ...tableParams.pagination, current: 1 };
    setTableParams({
      pagination: { ...pagination },
    });
    getList();
  };

  const resetting = () => {
    let pagination = { ...tableParams.pagination, current: 1 };
    setState({
      ...state,
      is_user: "-1",
    });
    setTableParams({
      ...tableParams.pagination,
      pagination: {
        ...pagination,
        current: 1,
      },
    });
    getList("reset");
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };

  const cancelRelease = (str) => {
    if (str) {
      setReleaseShow(false);
    } else {
      setReleaseShow(false);
      setState((data) => ({
        ...data,
        is_user: "-1",
      }));
      getList("query");
    }
  };

  const checkPeply = (record) => {
    const {id}=record||{}
    if (role === "role") {
      setReleaseDetail({ ...record });
      setReleaseDetailShow(true);
    } else {
      if(id){
        navigate("/layouts/mail/config",{
          state: { id: id },
        });
      }
    }
  };

  const cancelDetail = (str) => {
    if (str) {
      setReleaseDetailShow(false);
      return;
    }
    getList();
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <ContentLayouts
        top={
          <div className="mail-top">
            <div className="mail-top-item">
              <div className="mail-top-item-title">状态：</div>
              <div className="mail-item-data-time">
                <Select
                  value={state?.is_user}
                  showSearch
                  style={{ width: "146px", height: "32px" }}
                  placeholder="全部"
                  optionFilterProp="children"
                  onChange={(value) => setState({ ...state, is_user: value })}
                  filterOption={filterOption}
                  options={[
                    {
                      value: "-1",
                      label: "全部",
                    },
                    {
                      value: "1",
                      label: "已读",
                    },
                    {
                      value: "0",
                      label: "未读",
                    },
                  ]}
                />
              </div>
            </div>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => scanSearch()}
            >
              查询
            </Button>
            <Button
              className="resetting"
              icon={<SyncOutlined />}
              style={{ marginLeft: "16px" }}
              onClick={() => resetting()}
            >
              重置
            </Button>
            {role !== "role" && (
              <Button
                type="primary"
                style={{ marginLeft: "16px" }}
                onClick={() => setReleaseShow(true)}
              >
                发布信息
              </Button>
            )}
          </div>
        }
        content={
          <div className="mail-content">
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
                  dataIndex: "title",
                },
                {
                  title: "内容",
                  dataIndex: "content",
                },
                {
                  title: "时间",
                  dataIndex: "create_time",
                },
                {
                  title: "状态",
                  dataIndex: role === "role" ? "is_user" : "is_admin",
                  render: (record) => (
                    <span>{record === 0 ? "未读" : "已读"}</span>
                  ),
                },
                {
                  title: "操作",
                  render: (record) => (
                    <Button type="dashed" onClick={() => checkPeply(record)}>
                      查看回复
                    </Button>
                  ),
                },
              ]}
              dataSource={dataList}
            />
            <Modal
              title="发布信息"
              open={releaseShow}
              width={500}
              footer={null}
              destroyOnClose
              onCancel={() => setReleaseShow(false)}
            >
              {releaseShow && <ReleaseMsg cancelRelease={cancelRelease} />}
            </Modal>
            <Modal
              title="回复"
              open={releaseDetailShow}
              width={500}
              footer={null}
              destroyOnClose
              onCancel={() => {
                setReleaseDetail({});
                setReleaseDetailShow(false);
              }}
            >
              {releaseDetailShow && (
                <DetailModal
                  releaseDetail={releaseDetail}
                  cancelDetail={cancelDetail}
                />
              )}
            </Modal>
          </div>
        }
      ></ContentLayouts>
    </>
  );
}
