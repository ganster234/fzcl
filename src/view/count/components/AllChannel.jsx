import React from "react";
import { Table, Select } from "antd";

const { Option } = Select;

export default function AllChannel({ loading, dataList }) {
  const filterOption = (input, option) =>
    (option?.value ?? "").toLowerCase().includes(input.toLowerCase());

  // 计算总量总计
  const totalAge = dataList.reduce(
    (acc, item) => Number(acc) + Number(item.totalNum),
    0
  );
  // 计算总金额总计
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
        rowKey={(record) => record.user_id}
        loading={loading}
        pagination={false}
        columns={[
          {
            title: "账号",
            dataIndex: "account",
          },
          {
            title: "总量",
            dataIndex: "totalNum",
          },
          {
            title: "总金额",
            dataIndex: "totalAmount",
          },
          {
            title: "项目",
            render: (record) => (
              <Select
                style={{ width: "160px" }}
                optionFilterProp="children"
                showSearch
                filterOption={filterOption}
              >
                {record.app_lst &&
                  record.app_lst.map((item, index) => {
                    return (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    );
                  })}
              </Select>
            ),
          },
        ]}
        // 在表格底部渲染总计
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {Number(totalAge).toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {Number(totalAmount).toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
        dataSource={dataList}
      />
    </>
  );
}
