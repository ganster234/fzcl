import React from "react";
import { Table, Select } from "antd";

const { Option } = Select;

export default function AllChannel({ loading, dataList }) {
  const filterOption = (input, option) =>
    (option?.value ?? "").toLowerCase().includes(input.toLowerCase());

  // 计算总量总计
  // const totalAge = dataList.reduce(
  //   (acc, item) => Number(acc) + Number(item.totalNum),
  //   0
  // );
  const totalAge = dataList.reduce((acc, item) => {
    const num = parseFloat(item.Device_num);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
  // 计算总金额总计
  const totalAmount = dataList.reduce(
    (acc, item) => Number(acc) + Number(item.Device_money),
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
            dataIndex: "Device_name",
          },
          {
            title: "总量",
            dataIndex: "Device_num",
          },
          {
            title: "总金额",
            dataIndex: "Device_money",
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
                {record.Device_data &&
                  record.Device_data.map((item, index) => {
                    return (
                      <Option key={index} value={item.Device_account}>
                        {item.Device_account}
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
