import React, { useState, useRef } from "react";
import { Button, Radio, Form, Input, Spin, message,  } from "antd";
import { setAddTrust } from "../../../api/trust";

export default function DepositModal({ changeDepositShow }) {
  const [depositLoading, setDepositLoading] = useState(false);
  const addForm = useRef();
  const onFinish = async (values) => {
    const { password, comPassword } = values;
    if (password !== comPassword) {
      message.destroy();
      return message.error("两次输入密码不一致");
    }
    setDepositLoading(true);
    let result = await setAddTrust({
      ...values,
      id: "0",
    });
    if (result?.code===200) {
      message.success("添加成功");
      changeDepositShow(false, "str");
      addForm.current.resetFields();
    } else {
      message.error(result?.msg);
    }
    setDepositLoading(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Spin spinning={depositLoading}>
      <div>
        <div className="deposit-bor"></div>
        <div className="risk-warning">
          风险提示：您理解并同意，你需要确保账号密码的真实性和可用性，途中不可修改账号密码。单笔交易售后时间为7天，再此期间此笔交易款将被冻结直至售后截止。您已知悉上诉风险提示。
        </div>
        <Form
          ref={addForm}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="qq号"
            name="username"
            rules={[
              {
                required: true,
                message: "请输入账号!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="再次确认密码"
            name="comPassword"
            rules={[
              {
                required: true,
                message: "两次输入不一致!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="GUID"
            name="guid"
            rules={[
              {
                required: true,
                message: "请输入GUID!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={[
              {
                required: true,
                message: "请选择类型!",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={-1}> 全部 </Radio>
              <Radio value={1}> open </Radio>
              <Radio value={2}> 代销 </Radio>
              <Radio value={3}> ck </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "375px", height: "40px" }}
            >
              保存托管
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}
