import React, { useState, useEffect } from "react";
import { Modal, message, Select, Table, Input, Button } from "antd";
import dayjs from "dayjs";

import {
  getOrderList,
  setDelOrder,
  setGroup,
  setOneDay,
} from "../../api/order";
import { getGroupListNoPage } from "../../api/group";
import { getProjectPackList } from "../../api/project";
import OrderTop from "./components/OrderTop";
import { orderColumns } from "../../utils/columns";
import { exportRaw, getResidueHeightByDOMRect } from "../../utils/utils";
import trustIcon from "../../assets/image/trust/trust-icon.png";

import "./Order.less";

const { Option } = Select;

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

// 订单列表，批量分组接口未完成
export default function Order() {
  // 搜索需要的参数
  const [state, setState] = useState({
    start_time: new Date(), //开始时间
    end_time: new Date(), //结束时间
    appId: "", //项目ID
    group_id: "", //分组
    order_id: "", //订单号
    status: "", //使用
    account: "", //用户名
    aftersaleed: "", //售后
  });
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState(440);
  const [exportName, setExportName] = useState(""); //导出文件名
  const [groupList, setGroupList] = useState([]); //分组数组
  const [batchGroupId, setBatchGroupId] = useState(null);
  const [packList, setPackList] = useState([]); //项目id
  const [showModal, setShowModal] = useState({
    showExport: false, //导出
    showGroup: false, //分组
    showDelete: false, //删除
  });

  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]); //数据
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //选中数组
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const Userid = sessionStorage.getItem("user");

  //获取分组
  useEffect(() => {
    // 获取分组ID
    const getGroup = async () => {
      let result = await getGroupListNoPage({
        Sid: Userid,
        Name: "", //名称
        Pagenum: "1",
        Pagesize: "999",
      });
      message.destroy();
      if (result?.code) {
        setGroupList([...result?.data]);
      } else {
        message.error(result?.msg);
      }
    };
    // 获取项目ID
    const getPackList = async () => {
      let result = await getProjectPackList({
        Type: "0", //0 全部 1 Q 2 W
        App: "", // 1不是  0 是
        Web: "", // 1不是  0 是
      });
      const { code, data, msg } = result || {};
      message.destroy();
      if (code) {
        // if (data?.price && data?.price.length > 0) {
        //   setPackList([...data?.price]);
        // }
        setPackList([...data]);
      } else {
        message.error(msg);
      }
    };
    if (packList && packList.length === 0) {
      getPackList();
    }
    if (groupList && groupList.length === 0) {
      getGroup();
    }
    setHeight(getResidueHeightByDOMRect());
    //高度自适应
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getOrder();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  // 获取订单列表
  const getOrder = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    const {
      start_time,
      end_time,
      appId,
      group_id,
      status,
      order_id,
      account,
      aftersaleed,
    } = state;
    console.log("state", state);
    let parma = {
      // appId: str ? "" : appId + "",
      // group_id: str ? "" : group_id + "",
      // status: str ? "" : status + "",
      // order_id: str ? "" : order_id + "",
      // aftersaleed: str ? "" : aftersaleed + "",
      // start_time: str
      //   ? dayjs().format("YYYY-MM-DD")
      //   : start_time && dayjs(start_time).format("YYYY-MM-DD"),
      // end_time: str
      //   ? dayjs().format("YYYY-MM-DD")
      //   : end_time && dayjs(end_time).format("YYYY-MM-DD"),
      // account: str ? "" : account + "",
      // page: current,
      // limit: pageSize,
      Psid: str ? "" : appId + "", //项目sid
      Gsid: str ? "" : group_id + "", //分组sid
      Username: str ? "" : account + "", //用户名
      Sid: str ? "" : order_id + "", //订单号
      State: str ? "" : status + "", //状态  0未使用  1已使用
      Type: str ? "" : aftersaleed + "", //售后 0未售后  1 已售后
      Stime: str
        ? dayjs().format("YYYY-MM-DD")
        : start_time && dayjs(start_time).format("YYYY-MM-DD"),
      Etime: str
        ? dayjs().format("YYYY-MM-DD")
        : end_time && dayjs(end_time).format("YYYY-MM-DD"),
      Pagenum: current,
      Pagesize: pageSize,
    };
    setLoading(true);
    let result = await getOrderList(parma);
    const { code, data, msg, pagenum } = result || {};
    if (code) {
      setTotal(pagenum);
      setDataList([...data]);
    } else {
      message.error(msg);
    }
    setLoading(false);
  };

  //改变state数据
  const getState = (item, str) => {
    setState((data) => ({ ...data, [str]: item }));
  };

  //控制弹窗
  const showModalStatus = (item, str) => {
    setShowModal((data) => ({
      ...data,
      [str]: item,
    }));
  };

  //查询
  const queryBtn = (str) => {
    const { pagination } = tableParams;
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getOrder(str);
    } else {
      setTableParams({
        pagination: {
          ...pagination,
          current: 1,
          pageSize: 10,
        },
      });
    }
  };

  // 重置
  const resetting = () => {
    setState({
      start_time: new Date(), //开始时间
      end_time: new Date(), //结束时间
      appId: "",
      price_id: "", //项目ID
      group_id: "", //分组
      order_id: "", //订单号
      status: "", //使用
      account: "", //用户名
      aftersaleed: "",
    });
    queryBtn("str");
  };

  //切换分页
  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    fixed: true,
    getCheckboxProps: (record) => ({
      disabled: record.status === 1,
      // Column configuration not to be checked
      name: record.username,
    }),
  };

  //删除订单
  const delOrder = async () => {
    message.destroy();
    if (selectedRowKeys && selectedRowKeys.length === 0) {
      return message.error("请选择要删除的订单");
    }
    let result = await setDelOrder({ orderId: selectedRowKeys });
    if (result?.code === 200) {
      message.success(result?.msg);
      setShowModal((data) => ({ ...data, showDelete: false }));
      setSelectedRowKeys([]);
      getOrder();
    } else {
      message.error(result?.msg);
    }
  };

  // 导出订单
  const exportOrder = () => {
    message.destroy();
    if (selectedRowKeys && selectedRowKeys.length === 0) {
      return message.error("请选择导出数据");
    }
    if (!exportName) {
      return message.error("请输入导出文件名");
    }
    let list = [];
    dataList.forEach((item) => {
      selectedRowKeys.forEach((subItem) => {
        if (item.orderId === subItem) {
          list.push(item.orderId);
        }
      });
    });
    exportRaw(
      exportName,
      list.join(`
`),
      true
    );
    message.success("导出成功");
    setExportName("");
    setSelectedRowKeys([]);
    list = [];
    setShowModal((data) => ({ ...data, showExport: false }));
  };

  // 修改分组
  const changeGroup = async () => {
    message.destroy();
    if (selectedRowKeys && selectedRowKeys.length === 0) {
      return message.error("请选择要分组的数据");
    }
    if (!batchGroupId) {
      return message.error("请选择要操作的分组");
    }
    let result = await setGroup({
      order_id: selectedRowKeys,
      group_id: batchGroupId,
    });
    if (result?.code === 200) {
      message.success("操作成功");
      setBatchGroupId(null);
      setSelectedRowKeys([]);
      getOrder();
      setShowModal((data) => ({ ...data, showGroup: false }));
    } else {
      message.error(result?.msg);
    }
  };

  //分组弹窗搜索
  const filterOption = (input, option) =>
    (option?.children ?? "").toLowerCase().includes(input.toLowerCase());

  // 订单续费
  const orderRenew = async (order_id) => {
    setLoading(true);
    let { code, msg } = await setOneDay({ order_id });
    if (code === 200) {
      message.success("续费申请成功");
      setLoading(false);
      getOrder();
      return;
    } else {
      message.error(msg || "申请失败，请稍后重试");
    }
    setLoading(false);
  };
  return (
    <ContentLayouts
      top={
        <OrderTop
          stateData={state}
          getState={getState}
          packList={packList}
          groupList={groupList}
          showModalStatus={showModalStatus}
          queryBtn={queryBtn}
          resetting={resetting}
        />
      }
      content={
        <div className="order-content">
          <div className="order-empty-box">
            <img src={trustIcon} alt="" className="order-empty-box-icon" />
            <span className="order-empty-box-select">
              <span>已选</span>
              <span className="order-empty-select-number">
                {selectedRowKeys.length}
              </span>
              <span>项</span>
            </span>
            <span
              className="order-empty-btn"
              onClick={() => setSelectedRowKeys([])}
            >
              清空
            </span>
          </div>
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 1600,
              y: height,
            }}
            rowKey={(record) => record.orderId}
            rowSelection={rowSelection}
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
              //   title: "订单ID",
              //   dataIndex: "id",
              // },
              // {
              //   title: "操作",
              //   render: (record) => (
              //     <>
              //       {record.type === 3 || record.account_type !== 1 ? (
              //         // <Button
              //         //   type="primary"
              //         //   onClick={() => orderRenew(record.orderId)}
              //         // >
              //         //   续费
              //         // </Button>
              //         <>-</>
              //       ) : (
              //         <>-</>
              //       )}
              //     </>
              //   ),
              // },
              // {
              //   title: "用户",
              //   dataIndex: "account",
              // },
              ...orderColumns,
              // {
              //   title: "状态",
              //   dataIndex: "firstAuth",
              //   render: (record) => (
              //     <span style={{ color: record === 1 ? "#666666" : "#327DFC" }}>
              //       {record === 1 ? "未使用" : "已使用"}
              //     </span>
              //   ),
              // },
              // {
              //   title: "自动售后",
              //   dataIndex: "aftersaleed",
              //   render: (record) => (
              //     <span
              //       style={{
              //         color:
              //           record === 1
              //             ? "#666666"
              //             : record === 1
              //             ? "#12C3B1"
              //             : "",
              //       }}
              //     >
              //       {record === 1 ? "已售后" : record === 0 ? "未售后" : "全部"}
              //     </span>
              //   ),
              // },
              // {
              //   title: "备注",
              //   width: 200,
              //   dataIndex: "remark",
              //   render: (record) => <span>{record ? record : "-"}</span>,
              // },
            ]}
            dataSource={dataList}
          />
          {/* 订单导出 */}
          <Modal
            title="提示"
            open={showModal.showExport}
            onOk={() => exportOrder()}
            destroyOnClose
            onCancel={() =>
              setShowModal((data) => ({ ...data, showExport: false }))
            }
          >
            <p
              style={{
                padding: "20px 0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ marginRight: "10px" }}>导出文件名:</span>
              <Input
                value={exportName}
                onChange={(even) => setExportName(even.target.value)}
                style={{ width: "280px" }}
                placeholder="导出文件名"
              />
            </p>
          </Modal>
          {/* 分组 */}
          <Modal
            title="批量分组"
            width={400}
            open={showModal.showGroup}
            onOk={() => changeGroup()}
            destroyOnClose
            onCancel={() => {
              setBatchGroupId(null);
              setShowModal((data) => ({ ...data, showGroup: false }));
            }}
          >
            <div className="batch-group-modal">
              <Select
                value={batchGroupId}
                style={{ width: "260px" }}
                placeholder="全部"
                optionFilterProp="children"
                showSearch
                onChange={(value) => setBatchGroupId(value)}
                filterOption={filterOption}
              >
                {groupList &&
                  groupList.map((item, index) => {
                    return (
                      <Option key={index} value={item.id}>
                        {item.group_name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </Modal>
          {/* 删除 */}
          <Modal
            title="提示"
            open={showModal.showDelete}
            onOk={() => delOrder()}
            destroyOnClose
            onCancel={() =>
              setShowModal((data) => ({ ...data, showDelete: false }))
            }
          >
            <p>是否删除所选订单?</p>
          </Modal>
        </div>
      }
    />
  );
}
