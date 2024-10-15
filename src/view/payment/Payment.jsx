import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, Table, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getPayList } from "../../api/pay";
import { payColumns } from "../../utils/columns";
import dayjs from "dayjs";
import "./Payment.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function Payment() {
  const Userid = sessionStorage.getItem("user");
  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [aggregate, setaggregate] = useState(0); //总计
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [state, setState] = useState({
    start_time: new Date(), //开始时间
    end_time: new Date(), //结束时间
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
    let result = await getPayList({
      Userid,
      Stime: state.start_time && dayjs(state.start_time).format("YYYY-MM-DD"),
      Etime: state.end_time && dayjs(state.end_time).format("YYYY-MM-DD"),
      Pagenum: current,
      Pagesize: pageSize,
      // account: account ? "" : state.account,
    });
    const { code, data, msg } = result || {};
    if (code) {
      console.log(result, "resultresultresult");
      setDataList([...data]);
      // setTotal(data?.list.total);
      // setaggregate(data?.total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  const endDisabledDay = (current) => {
    return current && (current < dayjs(state.start_time) || current > dayjs());
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
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
      start_time: new Date(), //开始时间
      end_time: new Date(), //结束时间
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
  return (
    <ContentLayouts
      top={
        <div className="payment-top">
          <div className="payment-top-item">
            <div className="payment-top-item-title">起止日期：</div>
            <div className="payment-item-data-time">
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
        </div>
      }
      content={
        <div className="payment-content">
          <Table
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell className="bg-[#FAFAFA]" index={0}>
                    <p className=" text-[12px] ">
                      总计：<span>{aggregate}</span>
                    </p>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 1000,
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
            columns={[...payColumns]}
            dataSource={dataList}
          />
        </div>
      }
    ></ContentLayouts>
  );
}
