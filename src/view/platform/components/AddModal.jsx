import React from "react";
import { Button, Form, Input } from "antd";

export default function AddModal({ addOk }) {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    addOk(values);
    form.resetFields();
  };
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 18,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="项目名称"
        name="app_name"
        rules={[
          {
            required: true,
            message: "请输入项目名称!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="APPID"
        name="app_id"
        rules={[
          {
            required: true,
            message: "请输入APPID!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="封面地址"
        name="logo_path"
        rules={[
          {
            required: true,
            message: "请输入封面地址!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
