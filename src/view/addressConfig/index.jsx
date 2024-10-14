import React, { useState, useEffect } from "react";
import { message, Table,  Switch, Button, Modal, Input } from "antd";
import {
  getUrlList,
  addConfigUrl,
  setConfigUrl,
} from "../../api/addressConfig";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import { urlConfigColumns } from "../../utils/columns";
import "./mod.less";
export default function Equipment() {
  const [dataList, setDataList] = useState([]); //表格数据
  const [goldWay, setGoldWay] = useState("-1"); //选项选中的值
  const [height, setHeight] = useState(600); //表格高度
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState("");

  const [urlName, setUrlName] = useState(""); //url名称
  const [urlKey, setUrlKey] = useState(""); //配置key
  const [urlValue, setUrlValue] = useState(""); //url地址

  const [my_id, setmy_id] = useState(""); //状态

  const showModal = () => {
    setUrlName("");
    setUrlKey("");
    setUrlValue("");
    setIsModalOpen("新增配置url");
  };

  const handleOk = () => {
    if (isModalOpen === "修改配置url") {
      if (urlValue === "") {
        message.warning("请完成填写相关内容");
      } else {
        setConfigUrl({
          Sid: my_id,
          Url: urlValue,
        }).then((result) => {
          const { code, msg } = result || {};
          if (code === 200) {
            getList();
            setIsModalOpen("");
            message.success("修改成功");
          } else {
            message.error(msg);
          }
        });
      }
    } else {
      if (urlKey === "" && urlName === "" && urlValue === "") {
        message.warning("请完成填写相关内容");
      } else {
        // console.log(urlKey, "urlKey", urlName, "urlName", urlValue, "urlValue");

        addConfigUrl({
          Urlname: urlName,
          key: urlKey,
          Url: urlValue,
        }).then((result) => {
          const { code, msg } = result || {};
          if (code === 200) {
            getList();
            message.success("新增成功");
            setIsModalOpen("");
            setUrlName("");
            setUrlKey("");
            setUrlValue("");
          } else {
            message.error(msg);
          }
          console.log(result, "result");
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen("");
  };
  useEffect(() => {
    setLoading(true);
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getList();
  }, [goldWay]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async () => {
    let result = await getUrlList();
    const { code, msg, data } = result || {};
    if (code) {
      setDataList(data);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
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
          {/* <li
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <p>状态查询：</p>
            <Select
              value={goldWay}
              style={{ width: 120 }}
              onChange={(v) => {
                setGoldWay(v);
              }}
              options={[
                { value: "-1", label: "全部" },
                { value: "0", label: "开启" },
                { value: "1", label: "关闭" },
              ]}
            />
          </li> */}
          <li style={{ marginLeft: "20px" }}>
            <Button type="primary" onClick={() => showModal()}>
              新增配置url
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
          loading={loading} //表格加载
          scroll={{
            x: 600,
            y: height,
          }}
          pagination={false}
          rowKey="Device_Sid"
          dataSource={dataList}
          columns={[
            ...urlConfigColumns,
            {
              title: "状态控制",
              render: (record) => (
                <>
                  <Switch
                    checked={record.Device_state === "0" ? true : false}
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked
                    onChange={() => {
                      setLoading(true);
                      const is_share = record.Device_state === "0" ? "1" : "0";
                      setConfigUrl({
                        Sid: record.Device_Sid,
                        State: is_share,
                      }).then((result) => {
                        getList();
                        message.success("修改成功");
                        setLoading(false);
                      });
                    }}
                  />
                </>
              ),
            },
            {
              title: "操作",
              render: (record) => (
                <>
                  <Button
                    onClick={() => {
                      setUrlValue(record.Device_url);
                      setmy_id(record.Device_Sid);
                      setIsModalOpen("修改配置url");
                    }}
                  >
                    修改
                  </Button>
                </>
              ),
            },
          ]}
        />
      </section>
      <Modal
        width={700}
        title={isModalOpen}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ul className="modcss">
          {isModalOpen === "新增配置url" ? (
            <>
              <li>
                <p>url名称：</p>
                <Input
                  value={urlName}
                  onChange={(val) => setUrlName(val.target.value)}
                ></Input>
              </li>
              <li>
                <p>配置key：</p>
                <Input
                  value={urlKey}
                  onChange={(val) => setUrlKey(val.target.value)}
                ></Input>
              </li>
            </>
          ) : (
            <></>
          )}
          <li>
            <p>url地址：</p>
            <Input
              value={urlValue}
              onChange={(val) => setUrlValue(val.target.value)}
            ></Input>
          </li>
        </ul>
      </Modal>
    </div>
  );
}
