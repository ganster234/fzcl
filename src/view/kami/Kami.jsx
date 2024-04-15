import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { kamiColumns } from "../../utils/columns";
import { getCardList } from "../../api/kami";

import "./Kami.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function Kami() {
  const [height, setHeight] = useState(600);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [state, setState] = useState({
    start_time: new Date(),
    end_time: new Date(),
  });
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
  const getList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    const { start_time, end_time } = state;
    let param = {
      start_time: dayjs(str ? new Date() : start_time).format("YYYY-MM-DD"),
      end_time: dayjs(str ? new Date() : end_time).format("YYYY-MM-DD"),
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
    };
    setLoading(true);
    let result = await getCardList(param);
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

  const endDisabledDay = (current) => {
    return current && (current < dayjs(state.start_time) || current > dayjs());
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
  };

  const scanSearch = () => {
    const { pagination } = tableParams;
    if (pagination.current !== 1 || pagination.pageSize !== 10) {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      }));
    } else {
      getList();
    }
  };

  const kamiReset = () => {
    const { pagination } = tableParams;
    setState((item) => ({
      ...item,
      start_time: new Date(),
      end_time: new Date(),
    }));
    if (pagination.current !== 1 || pagination.pageSize !== 10) {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      }));
    } else {
      getList("kami");
    }
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  return (
    <>
      <ContentLayouts
        top={
          <div className="kami-top">
            <div className="kami-top-item">
              <div className="kami-top-item-title">起止日期：</div>
              <div className="start-end-time">
                <DatePicker
                  value={dayjs(state?.start_time)}
                  disabledDate={disabledDate}
                  className="search-date-picker"
                  picker="date"
                  onChange={(value) => {
                    if (value) {
                      setState((item) => ({ ...item, start_time: value }));
                    } else {
                      setState((item) => ({ ...item, start_time: new Date() }));
                    }
                  }}
                  format="YYYY-MM-DD"
                />
                <span className="least">至</span>
                <DatePicker
                  value={dayjs(state?.end_time)}
                  disabledDate={endDisabledDay}
                  onChange={(value) => {
                    if (value) {
                      setState((item) => ({ ...item, end_time: value }));
                    } else {
                      setState((item) => ({ ...item, end_time: new Date() }));
                    }
                  }}
                  className="search-date-picker"
                  picker="date"
                  format="YYYY-MM-DD"
                />
              </div>
            </div>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={scanSearch}
            >
              查询
            </Button>
            <Button
              icon={<SyncOutlined />}
              style={{ marginLeft: "16px" }}
              onClick={() => kamiReset()}
            >
              重置
            </Button>
          </div>
        }
        content={
          <div className="kami-content">
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
              columns={[
                ...kamiColumns,
                {
                  title: "状态",
                  dataIndex: "status",
                  render: (record) => (
                    <div>
                      {record === 0 && "未使用"}
                      {record === 1 && "已使用"}
                    </div>
                  ),
                },
              ]}
              dataSource={dataList}
            />
          </div>
        }
      />
    </>
  );
}
