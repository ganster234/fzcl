import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, message, Modal, Input, Button } from "antd";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { renew } from "../../utils/area";
import {
  getOpenList,
  setAftermarket,
  setRenew,
  setRenewUpdate,
} from "../../api/open";
import { openColumns } from "../../utils/columns";
import OpenTop from "./components/CkTop";
import ExportModal from "./components/ExportModal";
import dayjs from "dayjs";
import "./Ck.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

// 提取Ck
export default function Ck() {
  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [saleShow, setSaleShow] = useState(false); //售后
  const [saleNumber, setSaleNumber] = useState("");
  const [saleConfirmLoading, setSaleConfirmLoading] = useState(false);
  const [state, setState] = useState({
    Stime: new Date(),
    Etime: new Date(),
    Sid: "", //任务编号
    Username: "", //用户名称
    Type: "2", //1op,2ck
  });
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const Userid = sessionStorage.getItem("user");

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    (() => {
      openList();
    })();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  //获取list
  const openList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    setLoading(true);
    let param = {
      ...state,
      Userid,
      // 判断有无参数进来有就取没有就取本页面的
      Sid:  state.Sid,
      Pagenum: current + "",
      Pagesize: pageSize + "",
      Stime: state.Stime && dayjs(state.Stime).format("YYYY-MM-DD"),
      Etime: state.Stime && dayjs(state.Etime).format("YYYY-MM-DD"),
      Lytype: "1",
    };
    if (str) {
      param = {
        ...param,
        Userid,
        page: 1,
        Sid: "", //任务编号
        Username: "", //用户名称
        Stime: "",
        Etime: "",
        Type: "2",
      };
    }
    let result = await getOpenList(param);
    const { code, data, msg } = result || {};
    message.destroy();
    if (code) {
      setDataList([...data]);
      setTotal(Number(result.pagenum));
    } else {
      message.error(msg);
    }
    setLoading(false);
  };

  const openQuery = () => {
    changeCurrentGetList("");
  };
  //查询或者是重置，是第一页就直接调用接口，不是第一页就改变页数触发请求
  const changeCurrentGetList = (str) => {
    const { pagination } = tableParams;
    if (pagination.current === 1) {
      openList(str);
    } else {
      setTableParams(() => {
        return {
          pagination: {
            ...pagination,
            current: 1,
          },
        };
      });
    }
  };

  const openReset = () => {
    setState({
      ...state,
      Stime: new Date(),
      Etime: new Date(),
      Sid: "", //任务编号
      Username: "", //用户名称
    });
    changeCurrentGetList("str");
  };

  const setStatus = (data, str) => {
    setState({
      ...state,
      [str]: data,
    });
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };

  const copy = (data) => {
    let copyInput = document.createElement("input"); //创建input元素
    document.body.appendChild(copyInput); //向页面底部追加输入框
    copyInput.setAttribute("value", data); //添加属性，将url赋值给input元素的value属性
    copyInput.select(); //选择input元素
    document.execCommand("Copy"); //执行复制命令
    message.destroy();
    message.success("复制成功");
    //复制之后再删除元素，否则无法成功赋值
    copyInput.remove(); //删除动态创建的节点
  };

  const changeExport = () => {
    setExportOpen(true);
  };

  const setExport = (data) => {
    setExportOpen(data);
  };
  const saleChange = (data) => {
    setSaleShow(data);
  };

  const comSale = async () => {
    if (!saleNumber) {
      return message.error("请输入任务编号");
    }
    setSaleConfirmLoading(true);
    let result = await setAftermarket({ openid_task_id: saleNumber });
    if (result?.code === 200) {
      message.success("提交成功");
      setSaleConfirmLoading(false);
      setSaleShow(false);
    } else {
      message.error(result?.msg);
    }
    setSaleConfirmLoading(false);
  };

  // 续费
  const renewBtn = async (openid_task_id) => {
    if (!openid_task_id) {
      return message.error("订单ID不存在,请联系客服");
    }
    setLoading(true);
    let { code, msg } = await setRenew({ openid_task_id });
    if (code === 200) {
      message.success("续费申请成功");
      openList();
    } else {
      message.error(msg || "续费失败，请联系客服");
    }
    setLoading(false);
  };
  //更新
  const renewUpdate = async (openid_task_id) => {
    if (!openid_task_id) {
      return message.error("订单ID不存在,请联系客服");
    }
    setLoading(true);
    let { code, msg } = await setRenewUpdate(openid_task_id);
    if (code === 200) {
      message.success("更新open中,请稍等片刻");
      openList();
    } else {
      message.error(msg || "更新open失败,请联系客服");
    }
    setLoading(false);
  };

  return (
    <ContentLayouts
      top={
        <OpenTop
          state={state}
          setStatus={setStatus}
          openQuery={openQuery}
          openReset={openReset}
          changeExport={changeExport}
          saleChange={saleChange}
        />
      }
      content={
        <div className="open-content">
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 1000,
              y: height,
            }}
            rowKey={() => Math.random()}
            loading={loading}
            pagination={{
              ...tableParams.pagination,
              total: total,
              hideOnSinglePage: false,
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
            columns={[
              {
                title: "创建时间",
                dataIndex: "Device_time",
              },
              {
                title: "用户名称",
                dataIndex: "Device_user",
              },
              {
                title: "任务编号（双击复制）",
                width: 300,
                dataIndex: "Device_Sid",
                render: (record) => (
                  <span
                    onDoubleClick={() => copy(record)}
                    className="openid-task-id"
                  >
                    {record}
                  </span>
                ),
              },
              ...openColumns,
              {
                title: "任务状态",
                dataIndex: "Device_remark",
              },
              // {
              //   title: "操作",
              //   width: 220,
              //   render: (record) => (
              //     <>
              //       {renew[record.package_id] && (
              //         <div className="open-task-package">
              //           {/* <Button
              //             type="primary"
              //             onClick={() => renewBtn(record.openid_task_id)}
              //           >
              //             续费
              //           </Button> */}
              //           <Button
              //             onClick={() => renewUpdate(record.openid_task_id)}
              //           >
              //             更新open
              //           </Button>
              //         </div>
              //       )}
              //       {!renew[record.package_id] && "-"}
              //     </>
              //   ),
              // },
            ]}
            dataSource={dataList}
          />
          <Modal
            title="ck导出"
            open={exportOpen}
            width={450}
            footer={null}
            destroyOnClose
            onCancel={() => setExportOpen(false)}
          >
            {exportOpen && <ExportModal setExport={setExport} />}
          </Modal>
          <Modal
            title="售后"
            open={saleShow}
            width={450}
            destroyOnClose
            confirmLoading={saleConfirmLoading}
            onOk={() => comSale()}
            onCancel={() => {
              setSaleNumber("");
              setSaleShow(false);
            }}
          >
            <div
              style={{ color: "red", padding: "12px 0", textAlign: "center" }}
            >
              提示：请勿乱提交售后，如果非法售后账号将被封停。
            </div>
            <div>
              <Input
                placeholder="请输入任务编号"
                value={saleNumber}
                onChange={(even) => setSaleNumber(even.target.value)}
              />
            </div>
          </Modal>
        </div>
      }
    />
  );
}
