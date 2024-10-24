import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, Table, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getRecharge } from "../../api/recharge";
import { rechargeColumns } from "../../utils/columns";
import dayjs from "dayjs";
import "./Recharge.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

// 充值列表
export default function Recharge() {
  const Userid = sessionStorage.getItem("user");
  const [height, setHeight] = useState(550);
  const [state, setState] = useState({
    start_time: new Date(), //开始时间
    end_time: new Date(), //结束时间
    account: "", //账号名称
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [totalMoney, setTotalMoney] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });

  const endDisabledDay = (current) => {
    return current && (current < dayjs(state.start_time) || current > dayjs());
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
  };

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect() - 60);
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect() - 60);
    };
    // 初始化数据包括后续更新
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (account) => {
    const { current, pageSize } = tableParams.pagination;
    console.log(state, "state");

    setLoading(true);
    let result = await getRecharge({
      // ...state,
      // start_time:
      //   state.start_time && dayjs(state.start_time).format("YYYY-MM-DD"),
      // end_time: state.end_time && dayjs(state.end_time).format("YYYY-MM-DD"),
      // page: current,
      // limit: pageSize,
      // account: account ? "" : state.account,
      Usersid: Userid,
      Name: account ? "" : state.account, //名称
      Stime: account
        ? dayjs().format("YYYY-MM-DD")
        : dayjs(state.start_time).format("YYYY-MM-DD"), //开始时间
      Etime: account
        ? dayjs().format("YYYY-MM-DD")
        : dayjs(state.end_time).format("YYYY-MM-DD"), //结束时间
      Pagenum: account ? 1 : current, //页数
      Pagesize: account ? 10 : pageSize, //显示数
    });
    const { code, msg, data, pagenum, total } = result || {};
    if (code) {
      setDataList([...data]);
      // setTotal(data?.total);
      // setTotalMoney(data?.total_money);
      setTotal(pagenum);
      setTotalMoney(total);
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
      start_time: new Date(), //开始时间
      end_time: new Date(), //结束时间
      account: "", //账号名称
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
  return (
    <ContentLayouts
      top={
        <div className="recharge-top">
          <div className="recharge-top-item">
            <div className="recharge-top-item-title">起止日期：</div>
            <div className="recharge-item-data-time">
              <DatePicker
                value={dayjs(state?.start_time)}
                disabledDate={disabledDate}
                className="search-date-picker"
                onChange={(even) => {
                  if (even) {
                    setState({ ...state, start_time: even });
                  } else {
                    setState({ ...state, start_time: new Date() });
                  }
                }}
                picker="date"
                format="YYYY-MM-DD"
              />
              <span className="least">至</span>
              <DatePicker
                value={dayjs(state?.end_time)}
                disabledDate={endDisabledDay}
                className="search-date-picker"
                onChange={(even) => {
                  if (even) {
                    setState({ ...state, end_time: even });
                  } else {
                    setState({ ...state, end_time: new Date() });
                  }
                }}
                picker="date"
                format="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="recharge-top-item">
            <div className="recharge-top-item-title">账号名称：</div>
            <div className="recharge-item-data-time">
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
        </div>
      }
      content={
        <div className="recharge-content">
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 1500,
              y: height,
            }}
            rowKey={(record) => record.Device_Sid}
            loading={loading}
            pagination={{
              ...tableParams.pagination,
              total: total,
              hideOnSinglePage: false,
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
            columns={[...rechargeColumns]}
            // 在表格底部渲染总计
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    {totalMoney}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}></Table.Summary.Cell>
                  <Table.Summary.Cell index={4}></Table.Summary.Cell>
                  <Table.Summary.Cell index={5}></Table.Summary.Cell>
                  <Table.Summary.Cell index={6}></Table.Summary.Cell>
                  <Table.Summary.Cell index={7}></Table.Summary.Cell>
                  <Table.Summary.Cell index={8}></Table.Summary.Cell>
                  <Table.Summary.Cell index={9}></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
            dataSource={dataList}
          />
        </div>
      }
    ></ContentLayouts>
  );
}
