import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Input, message, Spin, Select, Table, Modal } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import {
  setAddApplication,
  getAddApplication,
  addApplicationModify,
} from "../../api/project";
import useAppStore from "../../store";
import "./AddProject.less";
import "../payment/Payment.less";

import { addProjectTable } from "../../utils/columns";
import { getResidueHeightByDOMRect } from "../../utils/utils";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});
// 未对接完成
export default function AddProject() {
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);

  const addForm = useRef();
  const [form] = Form.useForm();

  const [addProjectLoading, setAddProjectLoading] = useState(false);
  const [type, setType] = useState("0");
  const [state, setState] = useState({
    account: "", //项目名称
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    // 初始化获取数据
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (account) => {
    const { current, pageSize } = tableParams.pagination;
    setLoading(true);
    let result = await getAddApplication({
      Pagenum: current,
      Pagesize: pageSize,
      Name: account ? "" : state.account,
      // Name: account ? "" : state.account,
    });
    const { code, data, msg } = result || {};
    // eslint-disable-next-line eqeqeq
    if (code) {
      console.log(data, "data");

      setDataList([...data]);
      setTotal(data?.total);
    } else {
      message.destroy();
      message.error(result?.msg);
    }
    setLoading(false);
  };

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
    if (result?.code == 200) {
      await getList();
      message.success("提交成功");
      setIsModalOpen(false);
      // 重置表单字段
      form.resetFields();
    } else {
      message.error(result?.msg);
    }
    setAddProjectLoading(false);
  };
  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  //查询
  const scanSearch = () => {
    let pagination = { ...tableParams.pagination, current: 1 };
    setTableParams({
      pagination: { ...pagination },
    });
    getList();
  };
  //重置
  const resetting = () => {
    let pagination = { ...tableParams.pagination, current: 1 };
    setState({
      ...state,
      account: "", //账号名称
    });
    setTableParams({
      pagination: {
        ...pagination,
        current: 1,
      },
    });
    getList("reset");
  };
  const handleOk = () => {
    console.log("handleOk");
    form.submit();
  };
  const handClickReview = async (record, type) => {
    const modifyParams = {
      Sid: record.Device_Sid, //标识
      State: type === "review" ? "1" : "2", //0审核中  1 已审核  2 拒绝
      Shsid: userInfo.Device_Sid,
      Shname: userInfo.Device_name,
    };
    const res = await addApplicationModify({
      ...modifyParams,
    });
    console.log(res, "res");
    const { code, msg } = res || {};
    // eslint-disable-next-line eqeqeq
    if (code == 200) {
      await getList();
      message.success("操作成功");
    } else {
      message.error(msg);
    }
  };

  return (
    <ContentLayouts
      top={
        <div className="payment-top">
          <Modal
            title="新增账号白名单"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={() => setIsModalOpen(false)}
          >
            <div className="add-project-content">
              <Spin spinning={addProjectLoading}>
                <Form
                  // ref={addForm}
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  form={form}
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
                    {/* <Button type="primary" htmlType="submit">
                      提交
                    </Button> */}
                  </Form.Item>
                </Form>
              </Spin>
            </div>
          </Modal>
          <div className="payment-top-item">
            <div className="payment-top-item-title">项目名称：</div>
            <div className="payment-item-data-time">
              <Input
                value={state.account}
                onChange={(even) =>
                  setState({ ...state, account: even.target.value })
                }
                placeholder="请输入项目名称"
              />
            </div>
          </div>
          <Button type="primary" icon={<SearchOutlined />} onClick={scanSearch}>
            查询
          </Button>
          <Button
            className="resetting"
            icon={<SyncOutlined />}
            style={{ marginLeft: "16px" }}
            onClick={resetting}
          >
            重置
          </Button>
          <Button
            className="resetting"
            type="primary"
            style={{ marginLeft: "16px" }}
            onClick={() => setIsModalOpen(true)}
          >
            新增
          </Button>
        </div>
      }
      content={
        <div className="payment-content">
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              y: height,
            }}
            rowKey={(record) => record.Device_Sid}
            loading={loading}
            pagination={{
              ...tableParams.pagination,
              total: total,
              hideOnSinglePage: false,
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
            columns={[
              ...addProjectTable,
              {
                title: "操作",
                render: (record) =>
                  // <Button
                  //   size="small"
                  //   type="primary"
                  //   danger
                  //   // onClick={() => romveAant(record)}
                  // >
                  //   删除
                  // </Button>
                  record.Device_state === "0" && (
                    <div div className="btns">
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => handClickReview(record, "review")}
                      >
                        已审核
                      </Button>

                      <Button
                        size="small"
                        type="primary"
                        danger
                        onClick={() => handClickReview(record, "reject")}
                      >
                        拒绝
                      </Button>
                    </div>
                  ),
              },
            ]}
            dataSource={dataList}
          />
        </div>
      }
    ></ContentLayouts>
  );
}
