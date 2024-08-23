/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { message, Table, Button } from "antd";
import dayjs from "dayjs";

import { getOpenCode, setUpdateCode } from "../../api/thali";
import { getResidueHeightByDOMRect, exportRaw } from "../../utils/utils";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function WxTakeCode() {
  const [height, setHeight] = useState(0);
  const [codeLoading, setCodeLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
    getCodeList();
  }, [JSON.stringify(tableParams.pagination)]);

  const getCodeList = async () => {
    const { current, pageSize } = tableParams.pagination || {};
    setCodeLoading(true);
    let { data, code, msg } = await getOpenCode({
      page: current,
      limit: pageSize,
    });
    message.destroy();
    if (code === 200) {
      setDataList(data?.data);
      setTotal(data?.total);
    } else {
      message.error(msg);
    }
    setCodeLoading(false);
  };

  const handleTableChange = (pagination) => {
    const { pageSize } = pagination;
    if (pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
      setTableParams({
        pagination: {
          pageSize,
          current: 1,
        },
      });
    } else {
      setTableParams({ pagination });
    }
  };

  const derive = (record) => {
    const { order_id, code, app_name, create_time } = record;
    if (order_id && code && app_name) {
      exportRaw(
        create_time,
        app_name + "----" + order_id + "----" + code,
        true
      );
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const batchExport = () => {
    message.destroy();
    let list = [];
    dataList.forEach((item) => {
      if (selectedRowKeys.includes(item.order_id)) {
        list.push(item.order_id + "----" + item.code);
      }
    });
    setCodeLoading(true);
    if (selectedRowKeys.length > 0) {
      exportRaw(dayjs(new Date()).format("YYYY-MM-DD"), list, true);
      setSelectedRowKeys([]);
    } else {
      message.error("请选择导出数据");
    }
    setCodeLoading(false);
  };

  // 更新Code
  const setChangeCode = async (orderId) => {
    setCodeLoading(true);
    let { code, msg } = await setUpdateCode({ order_id: orderId.join(",") });
    if (code === 200) {
      message.success("申请更新成功");
      setSelectedRowKeys([]);
    } else {
      message.error(msg || "更新失败");
    }
    setCodeLoading(false);
  };
  return (
    <>
      <ContentLayouts
        top={
          <div style={{ padding: "10px" }}>
            <Button
              type="primary"
              disabled={!hasSelected}
              onClick={batchExport}
            >
              批量导出
            </Button>
            {/* <Button
              type="primary"
              style={{ marginLeft: "15px" }}
              disabled={!hasSelected}
              onClick={()=>setChangeCode(selectedRowKeys)}
            >
              批量更新
            </Button> */}
          </div>
        }
        content={
          <div className="scan-content">
            <Table
              rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
              scroll={{
                x: 1200,
                y: height,
              }}
              rowSelection={rowSelection}
              rowKey={(record) => record.order_id}
              loading={codeLoading}
              pagination={{
                ...tableParams.pagination,
                total: total,
                hideOnSinglePage: false,
                showSizeChanger: true,
              }}
              onChange={handleTableChange}
              columns={[
                {
                  title: "订单编号",
                  dataIndex: "order_id",
                },
                {
                  title: "项目名称",
                  dataIndex: "app_name",
                },
                {
                  title: "订单时间",
                  dataIndex: "create_time",
                },
                {
                  title: "操作",
                  render: (record) => (
                    <>
                      <Button
                        type="primary"
                        disabled={!record.code}
                        onClick={() => derive(record)}
                      >
                        {record.code ? "导出" : "进行中"}
                      </Button>

                      <Button
                        style={{ marginLeft: "10px" }}
                        onClick={() => setChangeCode([record.order_id])}
                      >
                        更新
                      </Button>
                    </>
                  ),
                },
              ]}
              dataSource={[...dataList]}
            />
          </div>
        }
      ></ContentLayouts>
    </>
  );
}
