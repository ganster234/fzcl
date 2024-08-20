import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import {
  getProjectList,
  getChangeShare,
  getChangePrice,
  addProjectAlias,
  updateProjectAlias,
  getProjectAlias,
} from "../../api/project";
const { TextArea } = Input;

const EditableCell = ({ title, editable, children, record, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(children);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = async () => {
    setEditing(false);
    if (value !== children) {
      // 触发保存请求
      try {
        await axios.post("/api/updateProjectAlias", {
          id: record.id,
          name: value,
        });
        message.success("修改成功");
      } catch (error) {
        message.error("修改失败");
      }
    }
  };

  const inputNode = (
    <Input
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      autoFocus
    />
  );

  return <td {...restProps}>{editable ? inputNode : children}</td>;
};

const EditableTable = ({ data, setData }) => {
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    setEditingKey(record.id);
  };

  const save = async (id) => {
    try {
      await axios.post("/api/updateProjectAlias", {
        id,
        name: data.find((item) => item.id === id).name,
      });
      message.success("修改成功");
      setEditingKey("");
      // 刷新数据
      const response = await axios.get("/api/getAliases");
      setData(response.data);
    } catch (error) {
      message.error("修改失败");
    }
  };

  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell title="Name" editable record={record} children={text} />
        ) : (
          text
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button onClick={cancel}>取消</Button>
          </>
        ) : (
          <Button onClick={() => edit(record)}>修改</Button>
        );
      },
    },
  ];

  return (
    <Table
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      rowKey="id"
      dataSource={data}
      columns={columns}
      pagination={false}
    />
  );
};

const MyTable = () => {
  const [mainData, setMainData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();
  const [aliasTableData, setAliasTableData] = useState([]);

  useEffect(() => {
    if (modalType === "view" && isModalVisible) {
      fetchAliases();
    }
  }, [modalType, isModalVisible]);

  const fetchAliases = async () => {
    try {
      // const response = await axios.get("/api/getAliases");
      const response = await getProjectAlias({ app_id: currentItem.app_id }); // 查询别名接口

      setAliasTableData(response.data);
    } catch (error) {
      message.error("加载别名失败");
    }
  };

  const handleAddAlias = async (values) => {
    try {
      await axios.post("/api/addProjectAlias", { name: values.text });
      message.success("新增别名成功");
      setIsModalVisible(false);
      fetchAliases(); // 刷新别名数据
    } catch (error) {
      message.error("新增别名失败");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === "add") {
        await handleAddAlias(values);
      }
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Table
        dataSource={mainData}
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Age", dataIndex: "age", key: "age" },
        ]}
        title={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="default"
              onClick={() => {
                setModalType("view");
                setIsModalVisible(true);
              }}
              style={{ color: "blue" }}
            >
              查看别名
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setModalType("add");
                setIsModalVisible(true);
              }}
              style={{ color: "green" }}
            >
              新增别名
            </Button>
          </div>
        )}
      />

      <Modal
        title={modalType === "add" ? "新增别名" : "查看别名"}
        visible={isModalVisible}
        onOk={modalType === "add" ? handleOk : undefined}
        onCancel={handleCancel}
        width={800}
      >
        {modalType === "add" ? (
          <Form form={form} layout="vertical">
            <Form.Item
              name="text"
              label="内容"
              rules={[{ required: true, message: "请输入内容!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        ) : (
          <EditableTable data={aliasTableData} setData={setAliasTableData} />
        )}
      </Modal>
    </>
  );
};

export default MyTable;
