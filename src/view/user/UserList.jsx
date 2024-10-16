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
import { getThaliList, permissions } from "../../api/thali";
import { userListColumns } from "../../utils/columns";
import "./UserList.less";
import useAppStore from "../../store";

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
  const [add_use, setadd_use] = useState(""); //充值额
  const [pay_use, setpay_use] = useState(""); //消费额

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
  const userInfo = useAppStore((state) => state.userInfo);

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
      Pagenum: str ? 1 : current,
      Pagesize: str ? 10 : pageSize,
      username: str ? "" : username,
    });
    const { code, data, msg } = result || {};
    // eslint-disable-next-line eqeqeq
    if (code) {
      if (data.length) {
        setDataList([...data]);
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
    const { Device_Sid, Device_state } = record;
    setInterdictLoading(true);
    let result = await setInterdict({
      // username: account,
      // disable: disable === 0 ? 1 : 0,
      Sid: Device_Sid, //标识
      State: Device_state === "正常" ? 1 : 0, //状态0开启1 关闭
      Adminsid: userInfo.Device_Sid, //操作员sid
    });

    const { code } = result || {};
    // eslint-disable-next-line eqeqeq
    if (code == 200) {
      setInterdictLoading(false);
      message.destroy();
      message.success("操作成功");
      getList();
    }
  };
  const resetPassword = async (record) => {
    const { Device_Sid } = record;
    setInterdictLoading(true);
    let result = await setPasswod({
      Sid: Device_Sid, //标识
      Pass: "0", //重置密码
      Adminsid: userInfo.Device_Sid, //操作员sid
    });
    const { code } = result || {};
    // eslint-disable-next-line eqeqeq
    if (code == 200) {
      setInterdictLoading(false);
      message.destroy();
      message.success("重置成功");
      getList();
    } else {
      message.error(result?.msg);
    }
  };

  const changeMoney = (item) => {
    setBalance(item.balance);
    setpay_use(item.pay_use);
    setadd_use(item.add_use);
    setMoneyItem({ ...item });
    setIsModalOpen(true);
  };
  const moneyHandleOk = async () => {
    if (!moneyItem.account || !balance || !add_use || !pay_use) {
      message.destroy();
      return message.error("请输入完整信息");
    }
    setConfirmLoading(true);
    let result = await addBalance({
      username: moneyItem.account,
      balance,
      add_use,
      pay_use,
    });
    const { code, msg } = result || {};
    message.destroy();
    if (code === 200) {
      message.success(msg);
      setIsModalOpen(false);
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

  const setas = (val) => {
    const { Device_Sid, Device_type } = val;

    //是否设为管理
    permissions({
      // id: val.id,
      // status: val.permissions === 0 ? 0 : val.permissions === 2 ? 1 : "",

      Sid: Device_Sid, //标识
      Type: Device_type.includes("管理") ? 0 : 1, //1是管理员 0是普通用户
      Adminsid: userInfo.Device_Sid, //操作员sid
    }).then((res) => {
      if (res.code === 200) {
        getList();
        message.success("操作成功");
      } else {
        message.warning(res.message);
      }
    });
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
                                  {/* <Button
                                    size="small"
                                    type="primary"
                                    style={{ marginRight: "5px" }}
                                    onClick={() => changeMoney(record)}
                                  >
                                    修改余额
                                  </Button> */}
                                  {/* <Button
                                    size="small"
                                    style={{ marginRight: "5px" }}
                                    onClick={() => getUser(record)}
                                  >
                                    项目管理
                                  </Button> */}
                                </>
                              )}

                              {record.Device_state === "正常" && (
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
                              {record.Device_state === "禁用" && (
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
                                onConfirm={() => resetPassword(record)}
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
                              <Button
                                style={{ marginLeft: "5px" }}
                                size="small"
                                type="primary"
                                onClick={() => setas(record)}
                              >
                                {/* {record.permissions === 0
                                  ? "取消管理"
                                  : record.permissions === 2
                                  ? "设为管理"
                                  : "-"} */}
                                {record.Device_type.includes("管理")
                                  ? "取消管理"
                                  : "设为管理"}
                              </Button>
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
        <ul className="myyue">
          <li>
            <p style={{ width: "80px" }}>余额：</p>
            <Input
              value={balance}
              onChange={(even) => setBalance(even.target.value)}
              style={{ margin: "5px 0" }}
              placeholder="请输入修改的余额"
            />
          </li>
          <li>
            <p style={{ width: "80px" }}>充值额：</p>
            <Input
              value={add_use}
              onChange={(even) => setadd_use(even.target.value)}
              style={{ margin: "5px 0" }}
              placeholder="请输入充值额"
            />
          </li>
          <li>
            <p style={{ width: "80px" }}>消费额：</p>
            <Input
              value={pay_use}
              onChange={(even) => setpay_use(even.target.value)}
              style={{ margin: "5px 0" }}
              placeholder="请输入消费额"
            />
          </li>
        </ul>
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
