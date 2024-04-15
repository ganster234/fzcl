import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import dayjs from "dayjs";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getSanList } from "../../api/scan";
import { scanColumns } from "../../utils/columns";
import "./Scan.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});
const ScanHead = React.lazy(async () => {
  const item = await import("./components/ScanHead");
  return item;
});
// 扫码日志
export default function Scan() {
  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    start_time: new Date(),
    end_time: new Date(),
    app_id: "", //app_id
    order_id: "", //order_id
    account: "", //account
    first_auth: "", //首次扫码
    auth_state: "", //扫码状态
  });
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
    // 初始化获取数据
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  //获取组件中的搜索项
  const getState = (value, str) => {
    setState({
      ...state,
      [str]: value,
    });
  };

  const getList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    const { app_id, order_id, account, first_auth, auth_state } = state;
    setLoading(true);
    let result = await getSanList({
      ...state,
      app_id: str ? "" : app_id,
      order_id: str ? "" : order_id,
      account: str ? "" : account,
      first_auth: str ? "" : first_auth,
      auth_state: str ? "" : auth_state,
      start_time: dayjs(str ? new Date() : state.start_time).format(
        "YYYY-MM-DD"
      ),
      end_time: dayjs(str ? new Date() : state.end_time).format("YYYY-MM-DD"),
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
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

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };

  const scanSearch = () => {
    const { pagination } = tableParams;
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getList();
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      }));
    }
  };
  const resetting = () => {
    const { pagination } = tableParams;
    setState({
      ...state,
      start_time: new Date(),
      end_time: new Date(),
      app_id: "", //app_id
      order_id: "", //order_id
      account: "", //account
      first_auth: "", //首次扫码
      auth_state: "", //扫码状态
    });
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getList("resst");
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      }));
    }
  };
  return (
    <ContentLayouts
      top={
        <ScanHead
          state={state}
          getState={getState}
          scanSearch={scanSearch}
          resetting={resetting}
        ></ScanHead>
      }
      content={
        <div className="scan-content">
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 1500,
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
            columns={[...scanColumns]}
            dataSource={[...dataList]}
          />
        </div>
      }
    ></ContentLayouts>
  );
}
