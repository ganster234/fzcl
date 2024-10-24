import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Input,
  Button,
  Table,
  message,
  Tooltip,
  Popconfirm,
  Modal,
  Select,
} from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import {
  getUsdtList,
  setUpdate,
  updateAddr,
  setUpdateUsdt,
} from "../../api/process";
import { experience } from "../../utils/columns";
import dayjs from "dayjs";
import "../payment/Payment.less";
import { FormOutlined } from "@ant-design/icons";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function Payment() {
  const Userid = sessionStorage.getItem("user");
  const role = sessionStorage.getItem("role");
  const [addr, setaddr] = useState(""); //交易单号i
  const [password, setpassword] = useState(""); //密码
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remark, setremark] = useState(""); //备注
  const [money, setmoney] = useState(""); //修改金额
  const [status, setstatus] = useState("-1"); //状态查询

  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [aggregate, setaggregate] = useState(0); //总计
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [state, setState] = useState({
    start_time: new Date(), //开始时间
    end_time: new Date(), //结束时间
    account: "", //账号名称
  });

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
    // return console.log(state, "state", account, "account");
    setLoading(true);
    let result = await getUsdtList({
      // ...state,
      // status: account ? "-1" : status,
      // start_time: account
      //   ? dayjs().format("YYYY-MM-DD")
      //   : dayjs(state.start_time).format("YYYY-MM-DD"),
      // end_time: account
      //   ? dayjs().format("YYYY-MM-DD")
      //   : dayjs(state.end_time).format("YYYY-MM-DD"),
      // page: account ? 1 : current,
      // limit: account ? 10 : pageSize,
      // account: account ? "" : state.account,
      Usersid: Userid,
      Name: account ? "" : state.account, //名称
      Stime: account
        ? dayjs().format("YYYY-MM-DD")
        : dayjs(state.start_time).format("YYYY-MM-DD"), //开始时间
      Etime: account
        ? dayjs().format("YYYY-MM-DD")
        : dayjs(state.end_time).format("YYYY-MM-DD"), //结束时间
      State: account ? "-1" : status, //状态0派单中 1失败 2成功
      Pagenum: account ? 1 : current, //页数
      Pagesize: account ? 10 : pageSize, //显示数
    });
    const { code, data, msg, pagenum, total } = result || {};
    console.log(data);
    if (code) {
      setDataList([...data]);
      setTotal(pagenum);
      setaggregate(total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  const endDisabledDay = (current) => {
    return current && (current < dayjs(state.start_time) || current > dayjs());
  };
  const disabledDate = (current) => {
    return current && current > dayjs();
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
      start_time: new Date(), //开始时间
      end_time: new Date(), //结束时间
      account: "", //账号名称
    });
    setstatus("-1");
    setTableParams({
      pagination: {
        ...pagination,
        current: 1,
      },
    });
    getList("reset");
  };
  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  const audit_culo = (status, id) => {
    if (password) {
      setUpdate({
        status,
        id,
        remark,
        password,
      }).then((res) => {
        if (res.code === 200) {
          getList();
          setremark("");
          setpassword("");
        } else {
          message.warning(res.msg);
        }
      });
    } else {
      message.warning("请输入审核密码");
    }
  };
  const handleOk = () => {
    //审核
    if (addr) {
      updateAddr({
        id: isModalOpen,
        addr,
      }).then((res) => {
        if (res.code === 200) {
          getList();
          setaddr("");
          setIsModalOpen(false);
          message.success("操作成功");
        } else {
          message.warning(res.msg);
        }
      });
    } else {
      message.warning("请输入交易单号");
    }
  };
  const gaimoney = (id) => {
    if (money) {
      setUpdateUsdt({
        id,
        money,
      }).then((res) => {
        if (res.code === 200) {
          getList();
          message.success("操作成功");
        } else {
          message.warning(res.msg);
        }
      });
    } else {
      message.warning("请输入金额");
    }
  };
  return (
    <ContentLayouts
      top={
        <div className="payment-top">
          <div className="payment-top-item">
            <div className="payment-top-item-title">起止日期：</div>
            <div className="payment-item-data-time">
              <DatePicker
                value={dayjs(state?.start_time)}
                disabledDate={disabledDate}
                className="search-date-picker"
                onChange={(even) => {
                  if (even) {
                    setState({ ...state, start_time: even });
                  } else {
                    setState({ ...state, start_time: new Date() });
                  }
                }}
                picker="date"
                format="YYYY-MM-DD"
              />
              <span className="least">至</span>
              <DatePicker
                value={dayjs(state?.end_time)}
                disabledDate={endDisabledDay}
                className="search-date-picker"
                onChange={(even) => {
                  if (even) {
                    setState({ ...state, end_time: even });
                  } else {
                    setState({ ...state, end_time: new Date() });
                  }
                }}
                picker="date"
                format="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="payment-top-item">
            <div className="payment-top-item-title">账号名称：</div>
            <div className="payment-item-data-time">
              <Input
                value={state.account}
                onChange={(even) =>
                  setState({ ...state, account: even.target.value })
                }
                placeholder="请输入账号名称"
              />
            </div>
          </div>
          <div className="payment-top-item">
            <div className="payment-top-item-title">状态查询：</div>
            <div className="payment-item-data-time">
              <Select
                style={{ width: 120 }}
                value={status}
                onChange={(val) => setstatus(val)}
                options={[
                  { value: "-1", label: "全部" },
                  { value: "0", label: "待审核" },
                  { value: "1", label: "通过" },
                  { value: "2", label: "失败" },
                ]}
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
        </div>
      }
      content={
        <div className="payment-content">
          <Table
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell className="bg-[#FAFAFA]" index={0}>
                    <p className=" text-[12px] ">
                      总计：<span>{aggregate}</span>
                    </p>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 1000,
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
              // {
              //   title: "操作",
              //   render: (record) => (
              //     <div
              //       style={{
              //         display: "flex",
              //         justifyContent: "center",
              //         alignItems: "center",
              //       }}
              //     >
              //       {role === "superAdmin" && record.status === 0 ? (
              //         <Popconfirm
              //           title="提示"
              //           description={
              //             <div>
              //               <p>当前操将审核该单充值状态</p>
              //               <Input
              //                 value={remark}
              //                 onChange={(val) => setremark(val.target.value)}
              //                 placeholder="请输入备注（非必填）"
              //               ></Input>
              //               <Input.Password
              //                 style={{ marginTop: "10px" }}
              //                 value={password}
              //                 onChange={(val) => setpassword(val.target.value)}
              //                 placeholder="输入审核密码（必填）"
              //               ></Input.Password>
              //             </div>
              //           }
              //           onConfirm={() => audit_culo(1, record.id)}
              //           onCancel={() => audit_culo(2, record.id)}
              //           okText="通过"
              //           cancelText="驳回"
              //         >
              //           <Button type="primary" danger size="small">
              //             审核
              //           </Button>
              //         </Popconfirm>
              //       ) : (
              //         <></>
              //       )}
              //       {role === "superAdmin" ? (
              //         <Popconfirm
              //           title="提示"
              //           description={
              //             <div>
              //               <p>当前操将修改充值金额</p>
              //               <Input
              //                 value={money}
              //                 onChange={(val) => setmoney(val.target.value)}
              //                 placeholder="输入金额"
              //               ></Input>
              //             </div>
              //           }
              //           onConfirm={() => gaimoney(record.id)}
              //           okText="确定"
              //           cancelText="取消"
              //         >
              //           <Button
              //             onClick={() => setmoney(record.money)}
              //             style={{
              //               margin: "0 10px",
              //             }}
              //             type="primary"
              //             size="small"
              //           >
              //             修改金额
              //           </Button>
              //         </Popconfirm>
              //       ) : (
              //         <></>
              //       )}
              //       <div
              //         style={{
              //           display: "flex",
              //           justifyContent: "center",
              //         }}
              //       >
              //         <Tooltip placement="topLeft" title="修改交易单号">
              //           <p
              //             onClick={() => {
              //               setaddr(record.addr);
              //               setIsModalOpen(record.id);
              //             }}
              //             style={{ cursor: "pointer", fontSize: "20px" }}
              //           >
              //             <FormOutlined />
              //           </p>
              //         </Tooltip>
              //       </div>
              //     </div>
              //   ),
              // },
              ...experience,
            ]}
            dataSource={dataList}
          />
          <Modal
            title="修改交易单号"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={() => setIsModalOpen(false)}
            width={600}
          >
            <Input
              placeholder=" 输入交易单号 "
              value={addr}
              allowClear
              onChange={(val) => setaddr(val.target.value)}
            ></Input>
          </Modal>
        </div>
      }
    ></ContentLayouts>
  );
}
