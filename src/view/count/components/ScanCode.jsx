import React, { useState } from "react";
import { Table, Button, Modal } from "antd";

export default function ScanCode({ dataList, loading }) {
  const [scanIsModal, setScanIsModal] = useState(false);
  const [dataItem, setDataItem] = useState({});
  const lookDetails = (data) => {
    setScanIsModal(true);
    setDataItem(data);
  };

  // 计算总计
  const totalAge = dataList.reduce((acc, item) => acc + item.totals, 0);
  return (
    <>
      <Table
        rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
        scroll={{
          x: 1000,
          y: 470,
        }}
        rowKey={(record) => record.app_id}
        loading={loading}
        pagination={false}
        columns={[
          {
            title: "项目名",
            dataIndex: "app_name",
          },
          {
            title: "总量",
            dataIndex: "totals",
          },
          {
            title: "操作",
            render: (record) => (
              <Button type="primary" onClick={() => lookDetails(record)}>
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
              <Table.Summary.Cell index={1}>{totalAge}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
        dataSource={dataList}
      />
      <Modal
        title={dataItem?.app_name}
        open={scanIsModal}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setScanIsModal(false);
          setDataItem({});
        }}
      >
        <Table
          scroll={{
            y: 300,
          }}
          rowKey={(record) => record.user_id}
          pagination={false}
          columns={[
            {
              title: "账号",
              dataIndex: "account",
              className: "replace-color",
            },
          ]}
          dataSource={dataItem?.data}
        />
      </Modal>
    </>
  );
}
