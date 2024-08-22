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
} from "../../api/project";
import { projectColumns } from "../../utils/columns";

import "./Project.less";
const { TextArea } = Input;
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
    console.log("触发handleChange", e.target.value, children);
    setValue(e.target.value);

    changeValue(record.id, e.target.value);
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

const EditableTable = forwardRef(({ data, fetchAliases }, ref) => {
  const [editingKey, setEditingKey] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editId, setEditId] = useState("");

  useImperativeHandle(ref, () => ({
    cancel: () => {
      setEditingKey("");
    },
  }));
  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    setEditingKey(record.id);
  };
  const changeValue = (id, value) => {
    setEditValue(value);
    setEditId(id.toString());
  };

  const save = async () => {
    try {
      await updateProjectAlias({
        id: editId,
        name: editValue,
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
      className: "flex-center",
      title: "别名",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        isEditing(record) ? (
          <EditableCell
            title="别名"
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();
  const [currentItem, setCurrentItem] = useState([]); // 设置当前选中的项
  const [aliasTableData, setAliasTableData] = useState([]); // 别名表格数据

  useEffect(() => {
    // 根据 modalType 进行数据加载
    if (modalType === "view" && isModalVisible) {
      fetchAliases();
    }
  }, [modalType, isModalVisible]);

  const showModal = (type, item) => {
    if (type === "view") {
    }
    setModalType(type);
    setCurrentItem(item); // 设置当前选中的项
    setIsModalVisible(true);
  };
  const fetchAliases = async () => {
    try {
      const response = await getProjectAlias({ app_id: currentItem.app_id }); // 查询别名接口
      setAliasTableData(response.data);
    } catch (error) {
      message.error("加载别名失败");
    }
  };

  const handleAddAlias = async (values) => {
    try {
      await addProjectAlias({
        app_id: currentItem.app_id,
        name: values.text,
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
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  // 获取list
  const getList = async () => {
    setLoading(true);
    const { pageSize, current } = tableParams.pagination;
    let result = await getProjectList({
      page: current,
      limit: pageSize,
      is_qq: 2,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      let list = data?.data;
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
    const { wx_app_id, data } = projectDetails;
    const item = data[index];
    if (str) {
      if (item) {
        setPopupLoading(true);
        let result = await getChangePrice({
          price_id: wx_app_id,
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
          price_id: wx_app_id,
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
  return (
    <>
      <div className="project-content">
        <div className="project-content-main">
          <div className="project-content-main-title">项目管理</div>
          <Table
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            scroll={{
              x: 900,
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
                title: "订单ID",
                dataIndex: "wx_app_id",
              },
              ...projectColumns,
              // {
              //   title: "操作",
              //   width: 200,
              //   render: (record) => (
              //     <span
              //       className="project-edit"
              //       onClick={() => projectEdit(record)}
              //     >
              //       编辑
              //     </span>
              //   ),
              // },
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
                    <Button
                      type="text"
                      className="project-edit"
                      onClick={() => projectEdit(record)}
                    >
                      编辑
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
                      style={
                        subItem?.is_share === 0
                          ? { color: "blue" }
                          : { color: "red" }
                      }
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
                      <span>{subItem?.is_share === 0 ? "启用" : "禁用"}</span>
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
                name="text"
                rules={[{ required: true, message: "请输入内容!" }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          ) : (
            <EditableTable
              ref={editableTableRef}
              data={aliasTableData}
              fetchAliases={fetchAliases}
            />
          )}
        </Modal>
      </div>
    </>
  );
}
