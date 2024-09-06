import React, { useState, useEffect } from "react";
import { Input, Button, Table, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getIp, addIp, delIp } from "../../api/pay";
import { iPtable } from "../../utils/columns";
import { Modal } from "antd";
import "../payment/Payment.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function Payment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [entermessage, setentermessage] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [state, setState] = useState({
    account: "", //账号名称
  });

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    // 初始化获取数据
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (account) => {
    const { current, pageSize } = tableParams.pagination;
    setLoading(true);
    let result = await getIp({
      page: current,
      limit: pageSize,
      account: account ? "" : state.account,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      setDataList([...data?.data]);
      setTotal(data?.total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  //查询
  const scanSearch = () => {
    let pagination = { ...tableParams.pagination, current: 1 };
    setTableParams({
      pagination: { ...pagination },
    });
    getList();
  };
  //重置
  const resetting = () => {
    let pagination = { ...tableParams.pagination, current: 1 };
    setState({
      ...state,
      account: "", //账号名称
    });
    setTableParams({
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
  const romveAant = (val) => {
    delIp({
      id: val.id + "",
    }).then((res) => {
      if (res.code === 200) {
        getList();
        setIsModalOpen(false);
        message.success("操作成功");
      }
    });
  };
  const handleOk = () => {
    if (entermessage) {
      addIp({
        account: entermessage,
      }).then((res) => {
        if (res.code === 200) {
          getList();
          setIsModalOpen(false);
          message.success("操作成功");
        }
      });
    } else {
      message.warning("请输入账号名称");
    }
  };
  return (
    <ContentLayouts
      top={
        <div className="payment-top">
          <Modal
            title="新增账号白名单"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={() => setIsModalOpen(false)}
          >
            <Input
              placeholder="请输入用户名称"
              value={entermessage}
              onChange={(val) => setentermessage(val.target.value)}
            ></Input>
          </Modal>
          <div className="payment-top-item">
            <div className="payment-top-item-title">账号名称：</div>
            <div className="payment-item-data-time">
              <Input
                value={state.account}
                onChange={(even) =>
                  setState({ ...state, account: even.target.value })
                }
                placeholder="请输入账号名称"
              />
            </div>
          </div>
          <Button type="primary" icon={<SearchOutlined />} onClick={scanSearch}>
            查询
          </Button>
          <Button
            className="resetting"
            icon={<SyncOutlined />}
            style={{ marginLeft: "16px" }}
            onClick={resetting}
          >
            重置
          </Button>
          <Button
            className="resetting"
            type="primary"
            style={{ marginLeft: "16px" }}
            onClick={() => setIsModalOpen(true)}
          >
            新增
          </Button>
        </div>
      }
      content={
        <div className="payment-content">
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
              ...iPtable,
              {
                title: "操作",
                render: (record) => (
                  <Button
                    size="small"
                    type="primary"
                    danger
                    onClick={() => romveAant(record)}
                  >
                    删除
                  </Button>
                ),
              },
            ]}
            dataSource={dataList}
          />
        </div>
      }
    ></ContentLayouts>
  );
}
