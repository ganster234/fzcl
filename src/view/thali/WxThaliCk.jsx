import React, { useState, useEffect } from "react";
import { message, Table } from "antd";
import dayjs from "dayjs";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { openColumns } from "../../utils/columns";
import { getOpenList } from "../../api/open";

import WxCkTop from "./components/WxCkTop";

import "./WxThaliCk.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function WxThaliCk() {
  const Userid = sessionStorage.getItem("user");
  const [wxCkLoading, setWxCkLoading] = useState(false);
  const [height, setHeight] = useState(550);
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

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    (() => {
      getWxList();
    })();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  //获取list
  const getWxList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    const { name, open_task_id, start_time, end_time } = state;
    setWxCkLoading(true);
    let param = {
      ...state,
      Userid,
      // 判断有无参数进来有就取没有就取本页面的
      Sid: state.Sid,
      Pagenum: current + "",
      Pagesize: pageSize + "",
      Stime: state.Stime && dayjs(state.Stime).format("YYYY-MM-DD"),
      Etime: state.Stime && dayjs(state.Etime).format("YYYY-MM-DD"),
      Lytype: "2",
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
    setWxCkLoading(false);
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

  const query = (str) => {
    const { current, pageSize } = tableParams.pagination;
    if (current === 1) {
      getWxList(str);
    } else {
      getWxList(str);
    }
  };

  //str:false查询,str:true重置
  const ckQueryReset = (str) => {
    if (str) {
      setState({
        start_time: new Date(),
        end_time: new Date(),
        open_task_id: "", //任务编号
        name: "", //用户名称
      });
      setTableParams({
        pagination: {
          current: 1,
          pageSize: 10,
        },
      });
      query(str);
    } else {
      query();
    }
  };
  return (
    <>
      <ContentLayouts
        top={
          <WxCkTop
            state={state}
            changeState={(str, data) => {
              setState((item) => ({ ...item, [str]: data }));
            }}
            ckQueryReset={ckQueryReset}
          />
        }
        content={
          <div className="wx-ck-content">
            <Table
              rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
              scroll={{
                x: 1000,
                y: height,
              }}
              rowKey={() => Math.random()}
              loading={wxCkLoading}
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
                  render: (record) => (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        className="open-task-status"
                        style={{
                          color: record === "已完成" ? "#12C3B1" : "#666666",
                          border:
                            record === "已完成"
                              ? "1px solid #12c3b1"
                              : "1px solid #666666",
                        }}
                      >
                        {record}
                      </div>
                    </div>
                  ),
                },
              ]}
              dataSource={dataList}
            />
          </div>
        }
      />
    </>
  );
}
