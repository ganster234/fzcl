import React, { useState } from "react";
import { Table, Button, Modal } from "antd";

export default function WeekSales({ loading, dataList }) {
  const [salesShow, setSalesShow] = useState(false);
  const [salesItem, setSalesItem] = useState({});
  const salesDetails = (data) => {
    setSalesShow(true);
    setSalesItem(data);
  };

  const totalAmount = dataList.reduce(
    (acc, item) => Number(acc) + Number(item.totalAmount),
    0
  );
  return (
    <>
      <Table
        rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
        scroll={{
          x: 1000,
          y: 470,
        }}
        rowKey={() => Math.random()}
        loading={loading}
        pagination={false}
        columns={[
          {
            title: "账号",
            dataIndex: "account",
          },
          {
            title: "总金额",
            dataIndex: "totalAmount",
            render: (record) => <>{Number(record).toFixed(2)}</>,
          },
          {
            title: "操作",
            render: (record) => (
              <Button type="primary" onClick={() => salesDetails(record)}>
                查看详情
              </Button>
            ),
          },
        ]}
        // 在表格底部渲染总计
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{Number(totalAmount).toFixed(2)}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
        dataSource={dataList}
      />
      <Modal
        title={salesItem?.account}
        open={salesShow}
        width={1000}
        footer={null}
        onCancel={() => {
          setSalesShow(false);
          setSalesItem({});
        }}
      >
        <Table
          scroll={{
            y: 600,
          }}
          rowKey={() => Math.random()}
          pagination={false}
          columns={[
            {
              title: "订单ID",
              dataIndex: "order_id",
              className: "replace-color",
              width: 300,
              render: (record) => (
                <div>
                  {record &&
                    record.map((item, index) => {
                      return <div key={index}>{item}</div>;
                    })}
                </div>
              ),
            },
            {
              title: "项目名",
              dataIndex: "app_name",
              className: "replace-color",
            },
            {
              title: "套餐名称",
              dataIndex: "package_name",
              className: "replace-color",
              render: (record) => <span>{record ? record : "--"}</span>,
            },
            {
              title: "售后金额",
              dataIndex: "amount",
              className: "replace-color",
              render: (record) => <span>{record ? record : "--"}</span>,
            },
            {
              title: "售后日期",
              dataIndex: "date",
              className: "replace-color",
              render: (record) => <span>{record ? record : "--"}</span>,
            },
          ]}
          dataSource={salesItem?.data}
        />
      </Modal>
    </>
  );
}
