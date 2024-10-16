import React, { useState } from "react";
import { Table, Button, Modal } from "antd";

export default function CountFronsWx({ loading, dataList, total }) {
  const [fronsShow, setFronsShow] = useState(false);
  const [fronsItem, setFronsItem] = useState({});
  const countDetails = (data) => {
    setFronsShow(true);
    setFronsItem(data);
  };
  // 计算总量总计
  const Device_num = dataList.reduce(
    (acc, item) => Number(acc) + Number(item.Device_num),
    0
  );
  const totalAmount = dataList.reduce(
    (acc, item) => Number(acc) + Number(item.Device_money),
    0
  );
  return (
    <>
      {/* <div className="count-frons-top">
        <span className="count-frons-top-item">
          今日注册总数：<span>{total?.total_num || "0"}</span>
        </span>
        <span className="count-frons-top-item">
          今日SM数：<span>{total?.authentication_num || "0"}</span>
        </span>
        <span className="count-frons-top-item">
          今日售卖数：<span>{total?.sell_num || "0"}</span>
        </span>
        <span className="count-frons-top-item">
          今日缓存数：<span>{total?.cache_num || "0"}</span>
        </span>
      </div> */}
      <Table
        rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
        scroll={{
          x: 1000,
          y: 450,
        }}
        rowKey={(record) => record.Device_pid}
        loading={loading}
        pagination={false}
        columns={[
          {
            title: "项目ID",
            dataIndex: "Device_pid",
          },
          {
            title: "项目名称",
            dataIndex: "Device_pname",
          },
          {
            title: "套餐名称",
            dataIndex: "Device_tname",
            render: (record) => <span>{record ? record : "--"}</span>,
          },
          {
            title: "总量",
            dataIndex: "Device_num",
          },

          {
            title: "总金额",
            dataIndex: "Device_money",
          },
          // {
          //   title: "操作",
          //   render: (record) => (
          //     <Button type="primary" onClick={() => countDetails(record)}>
          //       查看详情
          //     </Button>
          //   ),
          // },
        ]}
        // 在表格底部渲染总计
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                {Number(Device_num).toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {Number(totalAmount).toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
        dataSource={dataList}
      />
      <Modal
        title={fronsItem?.Device_pname}
        open={fronsShow}
        width={700}
        footer={null}
        onCancel={() => {
          setFronsShow(false);
          setFronsItem({});
        }}
      >
        <Table
          scroll={{
            y: 300,
          }}
          rowKey={(record) => Math.random()}
          pagination={false}
          columns={[
            {
              title: "套餐ID",
              dataIndex: "Device_pid",
              className: "replace-color",
            },
            {
              title: "套餐名称",
              dataIndex: "Device_tname",
              className: "replace-color",
              render: (record) => <span>{record ? record : "--"}</span>,
            },
            {
              title: "数量",
              dataIndex: "Num",
              className: "replace-color",
              render: (record) => <span>{record ? record : "--"}</span>,
            },
            {
              title: "金额",
              dataIndex: "Amount",
              className: "replace-color",
              render: (record) => <span>{record ? record : "--"}</span>,
            },
          ]}
          dataSource={fronsItem?.package_name_list}
        />
      </Modal>
    </>
  );
}
