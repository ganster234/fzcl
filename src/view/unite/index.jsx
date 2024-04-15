import React, { useState, useEffect } from "react";
import { produce } from "immer";
import { getjoint, addjoint, romvejoint } from "../../api/user";
import { getThaliList } from "../../api/thali";

import {
  Pagination,
  Input,
  Button,
  Popconfirm,
  Modal,
  Radio,
  message,
} from "antd";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { Table, Select } from "antd";
import { jointManagement } from "../../utils/columns";
import "./unite.less";
export default function Equipment() {
  const [association, setAssociation] = useState([]); //联合项目数据
  const [slet, setslet] = useState([]); //选择后数据
  const [app_name, setapp_name] = useState(""); //联合项目名称
  const [app_id, setapp_id] = useState(""); //联合项目数据
  const [type, settype] = useState("1"); //联合项目类型

  const [height, setHeight] = useState(600); //表格高度
  const [isModalOpen, setIsModalOpen] = useState(false); //模态框显示隐藏
  const [seek, setSeek] = useState(""); //搜索
  const [data, setData] = useState({
    loading: false, //表格加载
    Tabledata: [], //表格数据
    pageNumber: 1, //页码
    pageSize: 10, //一页多少条
    total: 0, //总条数
  });
  useEffect(() => {
    getThaliList().then((res) => {
      if (res.code === 200) {
        const filteredArray = res.data.appPriceList.map((item) => ({
          value: item.appId,
          label: item.appName,
        }));
        setAssociation(filteredArray);
      }
    });
  }, []);
  useEffect(() => {
    setData(
      produce(data, (draftState) => {
        draftState.loading = true;
      })
    );
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    xuanran();
  }, [data.pageNumber, data.pageSizem, seek]);
  const xuanran = () => {
    getjoint({
      app_id: seek,
      page: data.pageNumber,
      limit: data.pageSize,
    }).then((res) => {
      if (res.code === 200) {
        setData(
          produce(data, (draftState) => {
            draftState.Tabledata = res.data.data;
            draftState.total = res.data.total;
            draftState.loading = false;
          })
        );
      }
    });
  };

  const handleChange = (value, ali) => {
    //联合项目选择
    setslet(ali);
    setapp_id(`${value}`);
  };
  const handleinquire = (value) => {
    setSeek(value);
    setData(
      produce(data, (draftState) => {
        draftState.pageNumber = 1;
      })
    );
  };
  const romveFun = (val) => {
    //删除按钮
    console.log(val, "66666666");
    romvejoint({
      id: val.id,
    }).then((res) => {
      if (res.code === 200) {
        xuanran();
        message.success("删除成功");
      } else {
        message.warning(res.msg);
      }
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = () => {
    //模态框确定按钮
    // console.log(app_id, type, app_name);
    if (app_id && app_name) {
      addjoint({
        app_name,
        app_id,
        type,
      }).then((res) => {
        if (res.code === 200) {
          if (data.pageNumber === 1) {
            xuanran();
          } else {
            setData(
              produce(data, (draftState) => {
                draftState.pageNumber = 1;
              })
            );
          }
          message.success("创建成功");
          setIsModalOpen(false);
          setslet([]);
          setapp_id("");
          setapp_name("");
        } else {
          message.warning(res.msg);
        }
      });
    } else {
      message.warning("请填写完整信息");
    }
  };
  return (
    <div>
      <nav style={{ backgroundColor: "white", borderRadius: "6px" }}>
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            listStyle: "none",
            padding: "20px",
          }}
        >
          <li style={{ marginLeft: "20px" }}>
            <p>项目查询：</p>
            <div style={{ marginTop: "8px" }}>
              <Select
                showSearch
                placeholder="请选择项目"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                value={seek}
                style={{ width: "300px" }}
                onChange={handleinquire}
                tokenSeparators={[","]}
                options={association}
              />
            </div>
          </li>
          <li>
            <Button
              type="primary"
              style={{ marginTop: "30px", marginLeft: "20px" }}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              创建
            </Button>
          </li>
        </ul>
      </nav>
      <section
        style={{
          backgroundColor: "white",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "6px",
        }}
      >
        <Table
          loading={data.loading} //表格加载
          scroll={{
            x: 600,
            y: height,
          }}
          pagination={false}
          rowKey="id"
          dataSource={data.Tabledata}
          columns={[
            ...jointManagement,
            {
              title: "项目类型",
              render: (record) => <div>{record.type === 1 ? "QQ" : "-"}</div>,
            },
            {
              title: "操作",
              render: (record) => (
                <Popconfirm
                  placement="bottomRight"
                  title="提示"
                  description="当前操作将删除当前数据，是否继续？"
                  onConfirm={() => {
                    romveFun(record);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button size="small" type="primary" danger>
                    删除
                  </Button>
                </Popconfirm>
              ),
            },
          ]}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            current={data.pageNumber}
            onChange={(page, pageSize) => {
              setData(
                produce(data, (draftState) => {
                  draftState.pageNumber = page;
                  draftState.pageSize = pageSize;
                })
              );
            }}
            pageSize={10}
            defaultCurrent={data.pageNumber}
            total={data.total}
          />
        </div>
      </section>
      <Modal
        title="创建联合项目"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ul className="MODul">
          <li>
            <p>项目名称：</p>
            <Input
              value={app_name}
              onChange={(e) => {
                setapp_name(e.target.value);
              }}
              allowClear
              placeholder="请输入创建联合项目名称"
            />
          </li>
          <li>
            <p>选择项目：</p>
            <Select
              placeholder="请选择联合项目"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              value={slet}
              mode="multiple"
              style={{ width: "100%" }}
              onChange={handleChange}
              tokenSeparators={[","]}
              options={association}
            />
          </li>
          <li>
            <p>项目类型：</p>
            <div style={{ width: "100%" }}>
              <Radio.Group
                onChange={(val) => {
                  settype(val.target.value);
                }}
                value={type}
              >
                <Radio value={"1"}>QQ</Radio>
              </Radio.Group>
            </div>
          </li>
        </ul>
      </Modal>
    </div>
  );
}
