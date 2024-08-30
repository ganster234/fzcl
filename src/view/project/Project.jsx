import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { Table, message, Spin, Button, Modal, Form, Input } from "antd";
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
} from "../../api/project";
import { projectColumns } from "../../utils/columns";
import ProMolde from "./ProMolde";
import { useLocation } from "react-router-dom";
import "./Project.less";

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
    changeValue(record.id, e.target.value, title);
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
  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    setEditingKey(record.id);
  };
  const changeValue = (id, value, title) => {
    const currentData = data.find((item) => item.id === id);
    if (currentData) {
      currentData[title] = value;
    }
    console.log(currentData, "currentData");

    setEditValue({ ...currentData });
  };

  const save = async () => {
    console.log(editValue, currentItem, "editValue");
    const { app_id, id, name, real_id } = editValue;

    try {
      await updateProjectAlias({
        app_id:
          location.pathname !== "/layouts/platform/project"
            ? currentItem.wx_app_id
            : currentItem.app_id,
        id: id.toString(),
        name,
        real_id,
      });
      message.success("修改成功");
      fetchAliases();
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
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell
            title="name"
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
      title: "APP_id",
      dataIndex: "app_id",
      key: "app_id",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell
            title="app_id"
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
      title: "real_id",
      dataIndex: "real_id",
      key: "real_id",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell
            title="real_id"
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
      rowKey="id"
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
    setModalType(type);
    setCurrentItem(item); // 设置当前选中的项
    setIsModalVisible(true);
  };
  const fetchAliases = async () => {
    try {
      const response = await getProjectAlias({
        app_id:
          location.pathname !== "/layouts/platform/project"
            ? currentItem.wx_app_id
            : currentItem.app_id,
      }); // 查询别名接口
      setAliasTableData(response.data);
    } catch (error) {
      message.error("加载别名失败");
    }
  };

  const handleAddAlias = async (values) => {
    const { alias, real_id } = values;
    try {
      await addProjectAlias({
        app_id:
          location.pathname !== "/layouts/platform/project"
            ? currentItem.wx_app_id
            : currentItem.app_id,
        real_id,
        name: alias,
      }); // 新增项目别名
      message.success("新增别名成功");
      setIsModalVisible(false);
      fetchAliases(); // 刷新别名数据
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
      app_name: val === "重置" ? "" : app_name,
      page: val ? 1 : current,
      limit: val ? 10 : pageSize,
      is_qq: location.pathname === "/layouts/platform/project" ? undefined : 2,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      let list = data?.data ;
      list.forEach((element, i) => {
        element.data.forEach((item, index) => {
          element["key"] = i;
          element["distribution_price" + (index + 1)] = item.distribution_price;
        });
      });
      setTotal(data?.total);
      setDataList([...data.data]);
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
  const projectEdit = (record) => {
    setProjectDetails((item) => ({ ...item, ...record }));
    setSetailsShow(true);
  };

  const changeValue = (index, even) => {
    const { data } = projectDetails;
    let list = [...data];
    list[index].distribution_price = even;
    setProjectDetails((item) => ({
      ...item,
      data: [...list],
    }));
  };

  const inputDetailBlur = async (index, str) => {
    const { app_id, data, wx_app_id } = projectDetails;
    const item = data[index];
    console.log(item, projectDetails);
    if (str) {
      if (item) {
        setPopupLoading(true);
        let result = await getChangePrice({
          price_id:
            location.pathname === "/layouts/platform/project"
              ? projectDetails.app_id
              : wx_app_id,
          package_id: item.id,
          price: item.distribution_price,
        });
        message.destroy();
        if (result?.code === 200) {
          message.success("修改成功");
          getList();
        } else {
          message.error(result?.msg || "");
        }
      }
    } else {
      if (item) {
        setPopupLoading(true);
        let result = await getChangeShare({
          price_id: app_id,
          package_id: item.id,
          is_share: item?.is_share,
        });
        message.destroy();
        if (result?.code === 200) {
          message.success("修改成功");
          const { data } = projectDetails;
          let list = [...data];
          list[index].is_share = list[index].is_share === 0 ? 1 : 0;
          setProjectDetails((item) => ({
            ...item,
            data: [...list],
          }));
        } else {
          message.error(result?.msg || "");
        }
      }
    }
    setPopupLoading(false);
  };
  const inquire = (val) => {
    if (val === "重置") {
      setapp_name("");
    }
    getList(val);
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
              {
                title: "APP_id",
                dataIndex:
                  location.pathname !== "/layouts/platform/project"
                    ? "wx_app_id"
                    : "app_id",
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
                        onClick={() => {
                          reporteddata({
                            wx_app_id: record.wx_app_id,
                            app_name: record.app_name,
                          }).then((res) => {
                            message.info(res.msg);
                          });
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
                        seedMolde.current.setaddState("修改项目");
                        seedMolde.current.childFunction(record);
                      }}
                    >
                      修改
                    </Button>
                    <Button
                      type="text"
                      className="project-edit"
                      onClick={() => projectEdit(record)}
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
            setSetailsShow(false);
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
                      {subItem?.name}:
                    </span>
                    <span className="popup-details-item-content">
                      <span className="popup-details-item-content-main">
                        <Input
                          value={subItem?.distribution_price}
                          readOnly={subItem?.is_share === 1}
                          onChange={(even) => {
                            changeValue(index, even.target.value);
                          }}
                          onBlur={() => inputDetailBlur(index, "blur")}
                        />
                      </span>
                    </span>
                    <span
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
                        {subItem?.is_share === 0 ? "启用" : "禁用"}
                      </span>
                    </span>
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
