import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { Table, message, Spin, Button, Modal, Form, Input, Switch } from "antd";
import { Popup } from "antd-mobile";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import {
  getProjectList,
  getChangeShare,
  getChangePrice,
  addProjectAlias,
  updateProjectAlias,
  getProjectAlias,
  reporteddata,
  modifyTheQuery,
  modifyTheAmountQuery,
} from "../../api/project";
import { projectColumns } from "../../utils/columns";
import ProMolde from "./ProMolde";
import { useLocation } from "react-router-dom";
import "./Project.less";
import useAppStore from "../../store";

//可编辑逻辑
const EditableCell = ({
  title,
  editable,
  children,
  record,
  changeValue,
  ...restProps
}) => {
  const [value, setValue] = useState(children);
  const handleChange = (e) => {
    setValue(e.target.value);
    changeValue(record.Device_Sid, e.target.value, title);
  };
  const handleBlur = async () => {};

  const inputNode = (
    <Input
      // className="flex-center"
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      autoFocus
    />
  );

  return <td {...restProps}>{editable ? inputNode : children}</td>;
};

const EditableTable = forwardRef(({ data, fetchAliases, currentItem }, ref) => {
  const [editingKey, setEditingKey] = useState("");
  const [editValue, setEditValue] = useState({});
  const location = useLocation();
  useImperativeHandle(ref, () => ({
    cancel: () => {
      setEditingKey("");
    },
  }));
  const isEditing = (record) => record.Device_Sid === editingKey;

  const edit = (record) => {
    setEditingKey(record.Device_Sid);
    console.log(record, "record");
  };
  const changeValue = (Device_Sid, value, title) => {
    const currentData = data.find((item) => item.Device_Sid === Device_Sid);
    if (currentData) {
      currentData[title] = value;
    }
    console.log(currentData, "currentData");

    setEditValue({ ...currentData });
  };

  const save = async () => {
    console.log(editValue, currentItem, "editValue");
    // const { app_id, id, name, real_id } = editValue;
    const {
      Device_appid,
      Device_Sid,
      Device_name,
      Device_realid,
      Device_Psid,
    } = editValue;

    try {
      await updateProjectAlias({
        Sid: Device_Sid,
        Psid: Device_Psid,
        Rid: Device_realid,
        Aid: Device_appid, //app_id
        Name: Device_name,
      });
      message.success("修改成功");
      await fetchAliases();
      // 刷新数据
    } catch (error) {
      message.error("修改失败");
    }
    cancel();
  };

  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: "别名",
      dataIndex: "Device_name",
      key: "Device_name",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell
            title="Device_name"
            editable
            record={record}
            children={text}
            changeValue={changeValue}
          />
        ) : (
          text
        ),
    },
    {
      title: "Device_appid",
      dataIndex: "Device_appid",
      key: "Device_appid",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell
            title="Device_appid"
            editable
            record={record}
            children={text}
            changeValue={changeValue}
          />
        ) : (
          text
        ),
    },
    {
      title: "Device_realid",
      dataIndex: "Device_realid",
      key: "Device_realid",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell
            title="Device_realid"
            editable
            record={record}
            children={text}
            changeValue={changeValue}
          />
        ) : (
          text
        ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button onClick={() => save()} style={{ marginRight: 8 }}>
              保存
            </Button>
          </>
        ) : (
          <Button onClick={() => edit(record)}>修改</Button>
        );
      },
    },
  ];

  return (
    <Table
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      rowKey="Device_Sid"
      dataSource={data}
      columns={columns}
      pagination={false}
    />
  );
});
export default function Project() {
  const [app_name, setapp_name] = useState(""); //输入查询
  const [loading, setLoading] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [height, setHeight] = useState(436);
  const [detailsShow, setSetailsShow] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  //弹框
  const editableTableRef = useRef(null);
  const seedMolde = useRef(null); //子组件弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();

  const [currentItem, setCurrentItem] = useState([]); // 设置当前选中的项
  const [aliasTableData, setAliasTableData] = useState([]); // 别名表格数据

  const location = useLocation();
  const userInfo = useAppStore((state) => state.userInfo);

  useEffect(() => {
    // 根据 modalType 进行数据加载
    if (modalType === "view" && isModalVisible) {
      fetchAliases();
      setTableParams({
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      });
    }
  }, [modalType, isModalVisible]);

  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    // window.location.reload();
    // You can add any logic here that should run on route change
  }, [location]);

  const showModal = (type, item) => {
    if (type === "view") {
    }
    console.log(item, "item");
    setModalType(type);
    setCurrentItem(item); // 设置当前选中的项
    setIsModalVisible(true);
  };
  const fetchAliases = async () => {
    try {
      const response = await getProjectAlias({
        Psid: currentItem.Device_Sid,
      }); // 查询别名接口
      setAliasTableData(response.data);
    } catch (error) {
      message.error("加载别名失败");
    }
  };

  const handleAddAlias = async (values) => {
    console.log("handleAddAlias", values);
    console.log(userInfo, "userInfo", currentItem);
    const { alias, real_id } = values;
    try {
      const AddAliasParams = {
        Sid: userInfo.Device_Sid, //用户sid
        Psid: currentItem.Device_Sid, //项目sid
        Name: alias, //别名
        Rid: real_id, //real_id
        Aid:
          location.pathname === "/layouts/platform/project"
            ? currentItem.Device_appid
            : currentItem.Device_wxappid,
      };
      // return console.log(AddAliasParams, "AddAliasParams");
      await addProjectAlias({ ...AddAliasParams }); // 新增项目别名
      message.success("新增别名成功");
      await fetchAliases(); // 刷新别名数据
      setIsModalVisible(false);
    } catch (error) {
      message.error("新增别名失败");
    }
  };

  const handleOk = async () => {
    try {
      if (modalType === "add") {
        const values = await form.validateFields();
        await handleAddAlias(values);
      }
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (modalType === "add") {
      form.resetFields();
    }
    if (editableTableRef.current) {
      editableTableRef.current.cancel();
    }
  };

  // 初始化
  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect() + 88);
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getList();
  }, [JSON.stringify(tableParams), location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // 获取list
  const getList = async (val) => {
    setLoading(true);
    const { pageSize, current } = tableParams.pagination;
    let result = await getProjectList({
      Name: val === "重置" ? "" : app_name,
      Pagenum: val ? 1 : current,
      Pagesize: val ? 10 : pageSize,
      Type: location.pathname === "/layouts/platform/project" ? "1" : "2", // "Type": "1", //0 全部 1 Q 2 W
    });
    const { code, data, msg } = result || {};
    // eslint-disable-next-line eqeqeq
    if (code) {
      // let list = data;
      // list.forEach((element, i) => {
      //   element.data.forEach((item, index) => {
      //     element["key"] = i;
      //     element["distribution_price" + (index + 1)] = item.distribution_price;
      //   });
      // });
      setTotal(data?.total);
      setDataList([...data]);
      setLoading(false);
    } else {
      message.destroy();
      message.open({
        type: "error",
        content: msg,
      });
    }
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  const projectEdit = async (id) => {
    const { code, data, msg } = await modifyTheAmountQuery({
      Psid: id,
    });
    console.log(data, "data");
    // eslint-disable-next-line eqeqeq
    if (code == 200) {
      setProjectDetails((item) => ({ ...item, data }));
      setSetailsShow(true);
    } else {
      message.error(msg || "");
    }
  };

  const changeInputValue = (index, even) => {
    const { data } = projectDetails;
    let list = [...data];
    list[index].Device_money = even;
    setProjectDetails((item) => ({
      ...item,
      data: [...list],
    }));
  };

  const inputDetailBlur = async (index, str, subItem, checked) => {
    setPopupLoading(true);
    console.log(checked, "str_______", str);

    const editData = {
      Sid: subItem.Device_Sid,
      Psid: subItem.Device_Psid,
      Pmoney: subItem.Device_money,
      // State: subItem.Device_state,
      State: str === "switch" ? (checked ? "0" : "1") : subItem.Device_state,
    };

    // return console.log(editData, "editData");
    let result = await getChangePrice({
      ...editData,
    });
    message.destroy();
    // eslint-disable-next-line eqeqeq
    if (result?.code) {
      message.success("修改成功");
      await projectEdit(subItem.Device_Psid);
    } else {
      message.error(result?.msg || "");
    }
    setPopupLoading(false);
    getList();
    // }
    // } else {
    // if (item) {
    //   setPopupLoading(true);
    //   let result = await getChangeShare({
    //     price_id: app_id,
    //     package_id: item.id,
    //     is_share: item?.is_share,
    //   });
    //   message.destroy();
    //   if (result?.code === 200) {
    //     message.success("修改成功");
    //     const { data } = projectDetails;
    //     let list = [...data];
    //     list[index].is_share = list[index].is_share === 0 ? 1 : 0;
    //     setProjectDetails((item) => ({
    //       ...item,
    //       data: [...list],
    //     }));
    //   } else {
    //     message.error(result?.msg || "");
    //   }
    // }
    // }
  };
  const inquire = (val) => {
    if (val === "重置") {
      setapp_name("");
    }
    getList(val);
  };

  const handleEdit = async (id) => {
    const { code, data, msg } = await modifyTheQuery({
      Sid: id,
    });
    console.log(data, "data");

    // eslint-disable-next-line eqeqeq
    if (code == 200) {
      seedMolde.current.setaddState("修改项目");
      seedMolde.current.childFunction(data[0]);
    } else {
      message.error(msg || "");
    }
  };
  const handleClickReport = async (record) => {
    const res = await reporteddata({
      Sid: record.Device_Sid,
    });
    // eslint-disable-next-line eqeqeq
    if (res?.code == 200) {
      message.success("上报成功");
    } else {
      message.error(res?.msg || "");
    }
    console.log(res);

    // .then((res) => {
    //   message.info(res.msg);
    // });
  };
  return (
    <>
      <div className="project-content">
        <div className="project-content-main">
          <div className="project-content-main-title">
            <p>项目名称查询:</p>
            <div style={{ display: "flex" }}>
              <Input
                value={app_name}
                onChange={(val) => setapp_name(val.target.value)}
                style={{ width: "200px" }}
                placeholder="请输入项目名称"
                allowClear
              ></Input>
              <Button
                onClick={() => inquire("查询")}
                style={{ margin: "0 10px" }}
                type="primary"
              >
                查询
              </Button>
              <Button
                style={{ margin: "0 10px" }}
                onClick={() => inquire("重置")}
              >
                重置
              </Button>
              <ProMolde ref={seedMolde} getList={getList}></ProMolde>
            </div>
          </div>

          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 770,
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
              {
                title: "APP_id",
                dataIndex:
                  location.pathname !== "/layouts/platform/project"
                    ? "Device_wxappid"
                    : "Device_appid",
              },

              ...projectColumns,
              {
                title: "操作",
                width: 300,
                render: (record) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {location.pathname !== "/layouts/platform/project" ? (
                      <Button
                        type="text"
                        onClick={() => {
                          handleClickReport(record);
                        }}
                        style={{ marginTop: "5px" }}
                        size="small"
                      >
                        上报
                      </Button>
                    ) : (
                      <></>
                    )}

                    <Button
                      type="text"
                      className="project-edit"
                      onClick={() => {
                        // seedMolde.current.setaddState("修改项目");
                        // seedMolde.current.childFunction(record);
                        handleEdit(record.Device_Sid);
                      }}
                    >
                      修改
                    </Button>
                    <Button
                      type="text"
                      className="project-edit"
                      onClick={() => projectEdit(record.Device_Sid)}
                    >
                      编辑价格
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        showModal("view", record);
                      }}
                      style={{ color: "blue" }}
                    >
                      查看别名
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        showModal("add", record);
                      }}
                      style={{ color: "orange" }}
                    >
                      新增别名
                    </Button>
                  </div>
                ),
              },
            ]}
            dataSource={dataList}
          />
        </div>
        <Popup
          visible={detailsShow}
          onMaskClick={() => {
            setTimeout(() => {
              setSetailsShow(false);
            }, 300);
          }}
          onClose={() => {
            setSetailsShow(false);
          }}
          bodyStyle={{
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            padding: "20px 0 ",
            overflowY: "scroll",
            minHeight: "60vh",
          }}
        >
          <Spin spinning={popupLoading}>
            {projectDetails?.data &&
              projectDetails?.data.map((subItem, index) => {
                return (
                  <div className="popup-details-item" key={index}>
                    <span className="popup-details-item-title">
                      {subItem?.Device_name}:
                    </span>
                    <span className="popup-details-item-content">
                      <span className="popup-details-item-content-main">
                        <Input
                          value={subItem?.Device_money}
                          // eslint-disable-next-line eqeqeq
                          readOnly={subItem?.Device_state == 1}
                          onChange={(even) => {
                            changeInputValue(index, even.target.value);
                          }}
                          onBlur={() => inputDetailBlur(index, "blur", subItem)}
                        />
                      </span>
                    </span>
                    {/* <span
                      onClick={() => inputDetailBlur(index)}
                      className="popup-details-item-right"
                    >
                      <img
                        src={
                          subItem?.is_share === 0
                            ? require("../../assets/image/project/active-radio.png")
                            : require("../../assets/image/project/radio.png")
                        }
                        alt=""
                        className="popup-details-item-icon"
                      />
                      <span
                        style={
                          subItem?.is_share === 0
                            ? { color: "blue" }
                            : { color: "red" }
                        }
                      >
                        {subItem?.is_share === 0 ? "启用123" : "禁用"}
                      </span>
                    </span> */}
                    <Switch
                      onChange={(checked) => {
                        inputDetailBlur(index, "switch", subItem, checked);
                      }}
                      checked={subItem.Device_state === "0" ? true : false}
                      // eslint-disable-next-line eqeqeq
                      checkedChildren="启用"
                      unCheckedChildren="禁用"
                      defaultChecked
                    />
                  </div>
                );
              })}
          </Spin>
        </Popup>
        <Modal
          title={modalType === "add" ? "新增别名" : "查看别名"}
          footer={modalType === "view" ? null : undefined}
          open={isModalVisible}
          onOk={modalType === "add" ? handleOk : undefined}
          onCancel={handleCancel}
          width={800}
        >
          {modalType === "add" ? (
            <Form form={form} layout="vertical">
              <Form.Item
                name="alias"
                label="别名"
                rules={[{ required: true, message: "请输入内容!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="real_id"
                label="real_id"
                rules={[{ required: true, message: "请输入内容!" }]}
              >
                <Input />
              </Form.Item>
            </Form>
          ) : (
            <EditableTable
              ref={editableTableRef}
              data={aliasTableData}
              currentItem={currentItem}
              fetchAliases={fetchAliases}
            />
          )}
        </Modal>
      </div>
    </>
  );
}
