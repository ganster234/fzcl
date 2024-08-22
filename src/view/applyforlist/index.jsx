import React, { useState, useEffect } from "react";
import { Table, message } from "antd";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { projectapply } from "../../api/process";
import { apply_show } from "../../utils/columns";
import "../payment/Payment.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function Payment() {
  //   const role = sessionStorage.getItem("role");

  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
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

  const getList = async (account) => {
    const { current, pageSize } = tableParams.pagination;
    setLoading(true);
    let result = await projectapply({
      page: account ? 1 : current,
      limit: account ? 10 : pageSize,
    });
    const { code, data, msg } = result || {};
    console.log(data);
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

  return (
    <ContentLayouts
      content={
        <div className="payment-content">
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 520,
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
            columns={[...apply_show]}
            dataSource={dataList}
          />
        </div>
      }
    ></ContentLayouts>
  );
}
