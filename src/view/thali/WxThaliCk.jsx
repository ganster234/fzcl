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
  const [wxCkLoading, setWxCkLoading] = useState(false);
  const [height, setHeight] = useState(550);
  const [state, setState] = useState({
    start_time: new Date(),
    end_time: new Date(),
    open_task_id: "", //任务编号
    name: "", //用户名称
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
      is_op: "2", //1：open,2ck
      is_qq: "2", //没有这个参数就是QQ，有就是微信
      name: str ? "" : name,
      open_task_id: str ? "" : open_task_id,
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
      start_time: dayjs(str ? new Date() : start_time).format("YYYY-MM-DD"),
      end_time: dayjs(str ? new Date() : end_time).format("YYYY-MM-DD"),
    };
    let result = await getOpenList(param);
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      setDataList([...data?.data]);
      setTotal(data?.total);
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
    if (current === 1 && pageSize === 10) {
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
                x: 1500,
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
                  title: "ID",
                  dataIndex: "id",
                  width: 100,
                },
                {
                  title: "创建时间",
                  dataIndex: "create_time",
                },
                {
                  title: "任务编号（双击复制）",
                  width: 300,
                  dataIndex: "openid_task_id",
                  render: (record) => (
                    <span
                      onDoubleClick={() => copy(record)}
                      className="wx-ckid-task-id"
                    >
                      {record}
                    </span>
                  ),
                },
                ...openColumns,
                {
                  title: "任务状态",
                  dataIndex: "status",
                  render: (record) => (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        className={
                          record
                            ? "wx-ck-task-status wx-ck-task-status-active"
                            : "wx-ck-task-status"
                        }
                      >
                        {record ? "已完成" : "进行中"}
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
