import React, { useEffect, useState } from "react";
import { Input, Button, Table, message, Modal, Popconfirm } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getGroupList, postAddGroup, getDelGroup } from "../../api/group";
import { groupColumns } from "../../utils/columns";
import "./Group.less";
import useAppStore from "../../store";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

export default function Group() {
  const [height, setHeight] = useState(550);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addGroupName, setAddName] = useState("");
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
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
    let result = await getGroupList({
      Pagenum: current,
      Pagesize: pageSize,
      name: str ? "" : groupName,
      Sid: userInfo.Device_Sid, //用户sid
    });
    const { code, data, msg } = result || {};
    if (code) {
      setDataList([...data]);
      setTotal(data?.total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  const scanSearch = () => {
    // if (!groupName) {
    //   message.destroy();
    //   return message.error("请输入查询名称");
    // }
    anewList();
  };

  const anewList = (srt = "") => {
    const { pagination } = tableParams;
    if (pagination.current === 1 || pagination.current === "1") {
      getList(srt);
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

  const resetting = () => {
    setGroupName(() => "");
    anewList("str");
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  //添加分组
  const addGroup = async () => {
    if (!addGroupName) {
      message.destroy();
      return message.error("请输入要添加的分组名称");
    }
    setConfirmLoading(true);
    let result = await postAddGroup({
      Sid: userInfo.Device_Sid, //用户sid
      Name: addGroupName, //"分组名称"
    });
    message.destroy();
    // eslint-disable-next-line eqeqeq
    if (result?.code == 200) {
      setAddName(() => "");
      message.success("添加成功");
      setIsModalOpen(false);
      getList();
    } else {
      message.error(result.msg);
    }
    setConfirmLoading(false);
  };

  const confirmDelete = async (record) => {
    // return console.log(record, "record", record.Device_sid);

    if (!record.Device_sid) {
      return;
    }
    let result = await getDelGroup({
      // id: record.id
      Sid: record.Device_sid, //用户sid
      Gid: record.Device_gsid, //分组sid
    });
    message.destroy();
    // eslint-disable-next-line eqeqeq
    if (result?.code == 200) {
      message.success(result?.msg);
      await getList();
    } else {
      message.error(result?.msg);
    }
  };

  return (
    <ContentLayouts
      top={
        <div className="group-top">
          <div className="group-top-item">
            <div className="group-top-item-title">分组名称：</div>
            <div className="group-item-data-time">
              <Input
                value={groupName}
                onChange={(even) => setGroupName(even.target.value)}
                placeholder="请输入分组名称"
              />
            </div>
          </div>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={scanSearch}
            style={{ marginLeft: "16px" }}
          >
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
            type="primary"
            style={{ marginLeft: "18px", borderRadius: "26px" }}
            onClick={() => setIsModalOpen(true)}
          >
            添加套餐分组
          </Button>
        </div>
      }
      content={
        <div className="group-content">
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 1500,
              y: height,
            }}
            rowKey={(record) => record.Device_gid}
            loading={loading}
            pagination={{
              ...tableParams.pagination,
              total: total,
              hideOnSinglePage: false,
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
            columns={[
              ...groupColumns,
              {
                title: "操作",
                width: "150",
                render: (record) => (
                  <div>
                    <Popconfirm
                      title="提示"
                      description="确定要删除吗?"
                      onConfirm={() => confirmDelete(record)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <span className="group-delete">删除</span>
                    </Popconfirm>
                  </div>
                ),
              },
            ]}
            dataSource={dataList}
          />
          <Modal
            title="添加分组"
            confirmLoading={confirmLoading}
            open={isModalOpen}
            onOk={addGroup}
            destroyOnClose
            onCancel={() => {
              setIsModalOpen(false);
              setAddName("");
            }}
          >
            <div className="group-modal-input">
              <span className="group-modal-input-title">项目名称:</span>
              <Input
                value={addGroupName}
                onChange={(even) => setAddName(even.target.value)}
                placeholder="请输入项目名称"
                style={{ width: "220px" }}
              ></Input>
            </div>
          </Modal>
        </div>
      }
    ></ContentLayouts>
  );
}
