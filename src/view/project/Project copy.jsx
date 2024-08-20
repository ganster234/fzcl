import React, { useState, useEffect } from "react";
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();
  const [currentItem, setCurrentItem] = useState([]); // 设置当前选中的项
  const [aliases, setAliases] = useState([]); // 存储别名数据

  const [currentAliasId, setCurrentAliasId] = useState(null); // 当前别名的ID
  const [aliasTableData, setAliasTableData] = useState([]); // 别名表格数据

  useEffect(() => {
    // 根据 modalType 进行数据加载
    if (modalType === "view" && isModalVisible) {
      fetchAliases();
    }
  }, [modalType, isModalVisible]);

  const showModal = (type, item) => {
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

  const handleUpdateAlias = async (id, name) => {
    try {
      // await axios.post("/api/updateProjectAlias", { id, name });
      message.success("修改别名成功");
      fetchAliases(); // 刷新别名数据
    } catch (error) {
      message.error("修改别名失败");
    }
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === "add") {
        await handleAddAlias(values);
      }
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const aliasColumns = [
    { title: "别名", dataIndex: "name", key: "name" },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          style={{ color: "red" }}
          onClick={() => handleUpdateAlias(record.id)}
        >
          修改别名
        </Button>
      ),
    },
  ];
  //可编辑
  // const mergedColumns: TableProps<Item>['columns'] = aliasColumns.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record: Item) => ({
  //       record,
  //       inputType: col.dataIndex === 'age' ? 'number' : 'text',
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       editing: isEditing(record),
  //     }),
  //   };
  // });
  const mergedColumns = aliasColumns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
    }),
  }));

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
    const { id, data } = projectDetails;
    const item = data[index];
    console.log(item, projectDetails);
    if (str) {
      if (item) {
        setPopupLoading(true);
        let result = await getChangePrice({
          price_id: projectDetails.app_id,
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
          price_id: id,
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

  //可编辑
  return (
    <>
      <div className="project-content">
        <div className="project-content-main">
          <div className="project-content-main-title">项目管理</div>
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
                title: "订单ID",
                dataIndex: "app_id",
              },
              ...projectColumns,
              {
                title: "操作",
                width: 300,
                render: (record) => (
                  // <span
                  //   className="project-edit"
                  //   onClick={() => projectEdit(record)}
                  // >
                  //   编辑
                  // </span>
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
                      // style={{ color: "orange" }}
                    >
                      编辑
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        // setModalType("view");
                        // setIsModalVisible(true);
                        showModal("view", record);
                      }}
                      style={{ color: "blue" }}
                    >
                      查看别名
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        // setModalType("add");
                        // setIsModalVisible(true);
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
                    <span className="popup-details-item-right">
                      <img
                        src={
                          subItem?.is_share === 0
                            ? require("../../assets/image/project/active-radio.png")
                            : require("../../assets/image/project/radio.png")
                        }
                        alt=""
                        className="popup-details-item-icon"
                      />
                      <span onClick={() => inputDetailBlur(index)}>
                        {subItem?.is_share === 0 ? "启用" : "禁用"}
                      </span>
                    </span>
                  </div>
                );
              })}
          </Spin>
        </Popup>
        {/* <Modal
            title={modalType === "add" ? "新增别名" : "修改别名"}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="text"
                rules={[{ required: true, message: "请输入内容!" }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal> */}
        <Modal
          title={modalType === "add" ? "新增别名" : "查看别名"}
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
            <Table
              dataSource={aliasTableData}
              columns={mergedColumns}
              rowKey="id"
              pagination={false}
              rowClassName="editable-row"
            />
          )}
        </Modal>
      </div>
    </>
  );
}
