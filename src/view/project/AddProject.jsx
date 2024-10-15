import React, { useState, useRef } from "react";
import { Button, Form, Input, message, Spin, Select } from "antd";

import { setAddApplication } from "../../api/project";
import useAppStore from "../../store";

import "./AddProject.less";

// 未对接完成
export default function AddProject() {
  const userInfo = useAppStore((state) => state.userInfo); //用户信息

  const addForm = useRef();
  const [addProjectLoading, setAddProjectLoading] = useState(false);
  const [type, setType] = useState("0");
  const onFinish = (values) => {
    //成功时
    console.log("Success:", values, type);
    setAddApp(values, type);
  };
  const onFinishFailed = (errorInfo) => {
    //失败时
    console.log("Failed:", errorInfo);
  };

  const setAddApp = async (param) => {
    setAddProjectLoading(true);
    // return console.log("param, ", param, "type", type, typeof type);
    const { app_name, url } = param;
    let result = await setAddApplication(
      // { ...param, type }
      {
        Name: app_name, //项目名称
        Url: url, //项目地址
        Type: type, //0全部  1 q  2 w
        Usersid: userInfo.Device_Sid, //用户sid
        Username: userInfo.Device_name, //用户账号
      }
    );
    // eslint-disable-next-line eqeqeq
    if (result?.code) {
      message.success("提交成功");
      addForm.current.resetFields();
    } else {
      message.error(result?.msg);
    }
    setAddProjectLoading(false);
  };
  return (
    <div className="add-project-content">
      <Spin spinning={addProjectLoading}>
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
            width: 500,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
            label="项目地址"
            name="url"
            rules={[
              {
                required: true,
                message: "请输入项目地址!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="项目类型">
            <Select
              value={type}
              // style={{ width: "83%" }}
              onChange={(el) => {
                setType(el);
              }}
              options={[
                { value: "0", label: "全部" },
                { value: "1", label: "QQ" },
                { value: "2", label: "微信" },
              ]}
            />
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
      </Spin>
    </div>
  );
}
