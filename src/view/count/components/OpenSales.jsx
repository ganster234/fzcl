import React, { useState } from "react";
import { Table, Button, Modal } from "antd";

export default function OpenSales({ dataList, loading }) {
  const [openIsModal, setOpenIsModal] = useState(false);
  const [openItem, setOpenItem] = useState({});
  const openDetails = (data) => {
    setOpenIsModal(true);
    setOpenItem(data);
  };

  const totalMoney = dataList.reduce(
    (acc, item) => Number(acc) + Number(item.money),
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
            title: "金额",
            dataIndex: "money",
            render: (record) => <>{Number(record).toFixed(2)}</>,
          },
          {
            title: "操作",
            render: (record) => (
              <Button type="primary" onClick={() => openDetails(record)}>
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
              <Table.Summary.Cell index={1}>{totalMoney}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
        dataSource={dataList}
      />
      <Modal
        title={openItem?.account}
        open={openIsModal}
        footer={null}
        width={800}
        destroyOnClose
        onCancel={() => {
          setOpenIsModal(false);
          setOpenItem({});
        }}
      >
        <Table
          scroll={{
            y: 300,
          }}
          rowKey={() => Math.random()}
          pagination={false}
          columns={[
            {
              title: "项目名称",
              dataIndex: "name",
              className: "replace-color",
            },
            {
              title: "金额",
              dataIndex: "money",
              className: "replace-color",
            },
            {
              title: "任务数量",
              dataIndex: "num",
              className: "replace-color",
            },
            {
              title: "成功数量",
              dataIndex: "requests_num",
              className: "replace-color",
            },
            {
              title: "时间",
              dataIndex: "create_time",
              width: 160,
              className: "replace-color",
            },
          ]}
          dataSource={openItem?.data}
        />
      </Modal>
    </>
  );
}
