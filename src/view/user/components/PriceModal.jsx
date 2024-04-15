import React, { useEffect, useState } from "react";
import { Button, Form, InputNumber, Select,  message } from "antd";
import { getUserAll } from "../../../api/user";
import { getProjectPackList } from "../../../api/project";
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function PriceModal({getFinish}) {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]); //用户
  const [pack, setPack] = useState([]); //项目类型
  const [price, setPrice] = useState([]); //项目

  useEffect(() => {
    async function getUserListAll() {
      let result = await getUserAll();
      if (result?.code===200) {
        if (result?.data && result.data.length > 0) {
          setUserList([...result?.data]);
        }
      } else {
        message.destroy();
        message.error(result?.msg);
      }
    }
    async function getProjectPack() {
      let result = await getProjectPackList();
      const { code, data, msg } = result || {};
      if (code===200) {
        if (data.pack && data.pack.length > 0) {
          setPack([...data?.pack]);
        }
        if (data.price && data.price.length > 0) {
          setPrice([...data?.price]);
        }
      } else {
        message.destroy();
        message.error(msg);
      }
    }
    getUserListAll();
    getProjectPack();
  }, []);

  const onFinish = (values) => {
    getFinish(values)
    form.resetFields();
  };
  return (
    <div className="price-modal">
      <div className="set-modal-border"></div>
      <div className="set-price">
        通过设置，可针对性控制单个用户看到该项目时的价格。点击该用户配置-筛选项目-选择类型-点击保存即可。
      </div>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name="user_id"
          label="用户"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{ height: "35px" }}
            placeholder="请选择用户"
            showSearch
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
            allowClear
          >
            {userList &&
              userList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.account}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          name="price_id"
          label="项目"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{ height: "35px" }}
            placeholder="请选择项目"
            showSearch
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
            allowClear
          >
            {price &&
              price.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.app_name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          name="pack_id"
          label="项目类型"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{ height: "35px" }}
            placeholder="请选择项目"
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
            showSearch
            allowClear
          >
            {pack &&
              pack.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          label="单价"
          name="price"
          rules={[
            {
              required: true,
              message: "请输入单价",
            },
          ]}
        >
          <InputNumber style={{ height: "35px",width:'100%' }} placeholder="请输入单价" />
        </Form.Item>
        {/* <Form.Item
          label="类型"
          name="type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value="0"> 全部 </Radio>
            <Radio value="1"> open </Radio>
            <Radio value="2"> pc </Radio>
            <Radio value="3"> ck </Radio>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item {...tailLayout}>
          <Button
            style={{ width: "375px", height: "40px" }}
            type="primary"
            htmlType="submit"
          >
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
