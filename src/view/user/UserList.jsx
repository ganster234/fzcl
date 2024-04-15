import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Popconfirm,
  Spin,
  Modal,
  Input,
  Select,
} from "antd";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import {
  getUserList,
  setInterdict,
  addBalance,
  addUserProject,
  getUserProject,
  setIncome,
  setPasswod,
} from "../../api/user";
import { getThaliList } from "../../api/thali";
import { userListColumns } from "../../utils/columns";
import "./UserList.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

const { Option } = Select;

// 用户列表
export default function UserList() {
  const [height, setHeight] = useState(650);
  const role = sessionStorage.getItem("role"); //用户信息
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thailList, setThailList] = useState([]);
  const [selectThailList, setSelectThailList] = useState([]);
  const [userProjectLoading, setUserProjectLoading] = useState(false);
  const [userProjectShow, setUserProjectShow] = useState(false);
  const [balance, setBalance] = useState("");
  const [moneyItem, setMoneyItem] = useState({});
  const [interdictLoading, setInterdictLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [username, setUsername] = useState("");

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    // 初始化获取数据
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    setLoading(true);
    let result = await getUserList({
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
      username: str ? "" : username,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      if (data?.data) {
        setDataList([...data.data]);
        setTotal(data?.total);
        setLoading(false);
      }
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };

  const interdict = async (record) => {
    const { account, disable } = record;
    setInterdictLoading(true);
    let result = await setInterdict({
      username: account,
      disable: disable === 0 ? 1 : 0,
    });

    const { code } = result || {};
    if (code === 200) {
      setInterdictLoading(false);
      message.destroy();
      message.success("操作成功");
      getList();
    }
  };

  const changeMoney = (item) => {
    setMoneyItem({ ...item });
    setIsModalOpen(true);
  };
  const moneyHandleOk = async () => {
    if (!moneyItem.account || !balance) {
      message.destroy();
      return message.error("请输入修改金额");
    }
    setConfirmLoading(true);
    let result = await addBalance({ username: moneyItem.account, balance });
    const { code, msg } = result || {};
    message.destroy();
    if (code === 200) {
      message.success(msg);
      setIsModalOpen(false);
      setBalance(" ");
      getList();
    } else {
      message.success(msg);
    }
    setConfirmLoading(false);
  };

  const search = () => {
    const { pagination } = tableParams;
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getList();
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      }));
    }
  };

  const resetting = () => {
    setUsername("");
    const { pagination } = tableParams;
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getList("reset");
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      }));
    }
  };

  // 用户管理项目获取必要的参数
  const getUser = async (record) => {
    setMoneyItem({ ...record });
    setUserProjectShow(true);
    setUserProjectLoading(true);
    let result = await getThaliList();
    const { appPriceList } = result?.data || {};
    if (result.code === 200) {
      setThailList([...appPriceList]);
    } else {
      message.error(result?.msg);
    }
    let getResult = await getUserProject({ user_id: record.id });
    if (getResult?.code === 200) {
      setSelectThailList([...getResult?.data]);
    } else {
      message.error(getResult.msg);
    }
    setUserProjectLoading(false);
  };

  // 用户管理项目接口
  const comUserProject = async () => {
    const { id } = moneyItem;
    if (!id) {
      return;
    }
    if (selectThailList && selectThailList.length === 0) {
      return message.error("请选择管理的项目");
    }
    setUserProjectLoading(true);
    let result = await addUserProject({
      user_id: id + "",
      price_id: JSON.stringify(selectThailList),
    });
    if (result?.code === 200) {
      message.success("修改成功");
      setMoneyItem({});
      setSelectThailList([]);
      getList();
      setUserProjectShow(false);
    } else {
      message(result?.msg);
    }
    setUserProjectLoading(false);
  };

  const handleChange = (value) => {
    setSelectThailList([...value]);
  };

  const setupIncome = async (record, str) => {
    let result = await setIncome({
      id: record.id + "",
      status: str ? "1" : "0",
    });
    if (result?.code === 200) {
      message.success("设置成功");
      getList();
    } else {
      message.error(result?.msg);
    }
  };
  return (
    <Spin tip="提交中..." spinning={interdictLoading} size="large">
      <ContentLayouts
        top={
          <div className="user-list-top">
            <div className="user-list-input">
              <div>
                <div className="user-list-input-item-title">用户名称：</div>
                <Input
                  value={username}
                  onChange={(even) => setUsername(even.target.value)}
                  placeholder="请输入用户名称"
                />
              </div>

              <Button
                type="primary"
                style={{ marginLeft: "15px" }}
                onClick={search}
              >
                查询
              </Button>
              <Button style={{ marginLeft: "15px" }} onClick={resetting}>
                重置
              </Button>
            </div>
          </div>
        }
        content={
          <div className="user-content">
            <div className="user-list">
              <Table
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                scroll={{
                  x: 1400,
                  y: height,
                }}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                  ...tableParams.pagination,
                  total: total,
                  hideOnSinglePage: false,
                  showSizeChanger: true,
                }}
                onChange={handleTableChange}
                columns={[
                  ...userListColumns,
                  {
                    title: "操作",
                    width: 400,
                    render: (record) => (
                      <div>
                        {role &&
                          (role === "admin" || role === "superAdmin") && (
                            <>
                              {role && role === "superAdmin" && (
                                <>
                                  {record.income_use === 0 && (
                                    <Popconfirm
                                      title="提示"
                                      description="是否为当前账号设置代理？"
                                      onConfirm={() =>
                                        setupIncome(record, "setup")
                                      }
                                      okText="确认"
                                      cancelText="取消"
                                    >
                                      <Button
                                        size="small"
                                        type="primary"
                                        style={{
                                          background: "#95de64",
                                          marginRight: "5px",
                                        }}
                                      >
                                        设为代理
                                      </Button>
                                    </Popconfirm>
                                  )}
                                  {record.income_use === 1 && (
                                    <Popconfirm
                                      title="提示"
                                      description="是否取消当前账号代理？"
                                      onConfirm={() => setupIncome(record)}
                                      okText="确认"
                                      cancelText="取消"
                                    >
                                      <Button
                                        type="primary"
                                        style={{
                                          marginRight: "5px",
                                        }}
                                        danger
                                      >
                                        取消代理
                                      </Button>
                                    </Popconfirm>
                                  )}
                                  <Button
                                    size="small"
                                    type="primary"
                                    style={{ marginRight: "5px" }}
                                    onClick={() => changeMoney(record)}
                                  >
                                    修改余额
                                  </Button>
                                  <Button
                                    size="small"
                                    style={{ marginRight: "5px" }}
                                    onClick={() => getUser(record)}
                                  >
                                    项目管理
                                  </Button>
                                </>
                              )}

                              {record.disable === 0 && (
                                <Popconfirm
                                  title="提示"
                                  description="是否确认禁用当前账号？"
                                  onConfirm={() => interdict(record)}
                                  okText="确认"
                                  cancelText="取消"
                                >
                                  <Button size="small" type="primary" danger>
                                    禁用
                                  </Button>
                                </Popconfirm>
                              )}
                              {record.disable === 1 && (
                                <Button
                                  size="small"
                                  type="primary"
                                  style={{ background: "#95de64" }}
                                  onClick={() => interdict(record)}
                                >
                                  启用
                                </Button>
                              )}
                              <Popconfirm
                                title="提示"
                                description="当前操作将重置用户密码是否继续？"
                                onConfirm={async () => {
                                  let result = await setPasswod({
                                    user_id: [record.id],
                                  });
                                  // console.log(666, record, result);
                                  if (result?.code === 200) {
                                    message.success("重置成功");
                                  } else {
                                    message.error(result?.msg);
                                  }
                                }}
                                okText="确认"
                                cancelText="取消"
                              >
                                <Button
                                  style={{ marginLeft: "5px" }}
                                  size="small"
                                  danger
                                >
                                  重置密码
                                </Button>
                              </Popconfirm>
                            </>
                          )}
                        {role && role === "role" && <>--</>}
                      </div>
                    ),
                  },
                ]}
                dataSource={dataList}
              />
            </div>
          </div>
        }
      ></ContentLayouts>
      <Modal
        title="修改余额"
        width={360}
        open={isModalOpen}
        onOk={moneyHandleOk}
        confirmLoading={confirmLoading}
        destroyOnClose
        onCancel={() => {
          setMoneyItem({});
          setIsModalOpen(false);
        }}
      >
        <Input
          value={balance}
          onChange={(even) => setBalance(even.target.value)}
          style={{ margin: "20px 0" }}
          placeholder="请输入修改的余额"
        />
      </Modal>
      <Modal
        title="项目管理"
        width={600}
        open={userProjectShow}
        onOk={comUserProject}
        destroyOnClose
        onCancel={() => {
          setMoneyItem({});
          setSelectThailList([]);
          setUserProjectShow(false);
        }}
      >
        <Spin tip="加载中..." spinning={userProjectLoading} size="large">
          <div className="user-list-modal-list-item">
            <div className="user-list-modal-list-item-title">用户账号</div>
            <Input value={moneyItem?.account} placeholder="...." disabled />
          </div>
          <div className="user-list-modal-list-item">
            <div className="user-list-modal-list-item-title">项目名称</div>
            <Select
              mode="multiple"
              value={[...selectThailList]}
              style={{ width: "100%" }}
              placeholder="请选择项目"
              onChange={handleChange}
              optionLabelProp="label"
            >
              {thailList &&
                thailList.map((item, index) => {
                  return (
                    <Option key={index} value={item?.id} label={item?.appName}>
                      {item?.appName}
                    </Option>
                  );
                })}
            </Select>
          </div>
        </Spin>
      </Modal>
    </Spin>
  );
}
