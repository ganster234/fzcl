import React, { useState, useEffect } from "react";
import { message, Table, Select, Switch, Button, Modal, Input } from "antd";
import { payprice, setpayprice, addpayprice } from "../../api/count";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { settlement } from "../../utils/columns";
import "./mod.less";
export default function Equipment() {
  const [dataList, setDataList] = useState([]); //表格数据
  const [goldWay, setGoldWay] = useState(""); //选项选中的值
  const [height, setHeight] = useState(600); //表格高度
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState("");

  const [paydesignation, setpaydesignation] = useState(""); //支付名称
  const [payway, setpayway] = useState(""); //支付类型
  const [remark, setremark] = useState(""); //备注
  const [price, setprice] = useState(""); //充值额
  const [my_id, setmy_id] = useState(""); //状态
  const [mch_wx_key, setmch_wx_key] = useState(""); //商户号
  const [wx_app_id, setwx_app_id] = useState(""); //wx_app_id
  const [xuliehao, setxuliehao] = useState(""); //序列号
  const [notify_url, setnotify_url] = useState(""); //回调地址
  const [fenclass, setfenclass] = useState({}); //分类

  const showModal = () => {
    setpaydesignation("");
    setpayway("");
    setprice("");
    setremark("");
    setmy_id("");
    setmch_wx_key("");
    setwx_app_id("");
    setxuliehao("");
    setnotify_url("");
    setIsModalOpen("新增支付");
  };

  const handleOk = () => {
    if (isModalOpen === "修改支付") {
      if (
        paydesignation === "" ||
        price === "" ||
        remark === "" ||
        payway === ""
      ) {
        message.warning("请完成填写相关内容");
      } else {
        setpayprice({
          Sid: my_id + "",
          Type: fenclass.Device_type,
          Name: paydesignation,
          Money: price,
          Remark: remark,
          Bussid: mch_wx_key,
          Appid: wx_app_id,
          Number: xuliehao,
          Api: notify_url,
          Url: payway,
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
      if (
        paydesignation === "" ||
        price === "" ||
        remark === "" ||
        payway === ""
      ) {
        message.warning("请完成填写相关内容");
      } else {
        addpayprice({
          ///////////
          Name: paydesignation,
          Type: payway,
          Money: price,
          Remark: remark,
          Bussid: mch_wx_key,
          Appid: wx_app_id,
          Number: xuliehao,
          Api: notify_url,
        }).then((result) => {
          const { code, msg } = result || {};
          if (code === 200) {
            getList();
            message.success("新增成功");
            setIsModalOpen("");
          } else {
            message.error(msg);
          }
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
    let result = await payprice({ State: goldWay });
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
          <li
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
                { value: "", label: "全部" },
                { value: "0", label: "开启" },
                { value: "1", label: "关闭" },
              ]}
            />
          </li>
          <li style={{ marginLeft: "20px" }}>
            <Button type="primary" onClick={() => showModal()}>
              新增支付
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
            ...settlement,
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
                      const is_use = record.Device_state === "0" ? "1" : "0";
                      setpayprice({
                        State: is_use,
                        Sid: record.Device_Sid,
                      }).then((result) => {
                        const { code, msg } = result || {};
                        if (code === 200) {
                          getList();
                          message.success("修改成功");
                          setLoading(false);
                        } else {
                          setLoading(false);
                          message.error(msg);
                        }
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
                      // console.log(record, "recordrecord");
                      setpaydesignation(record.Device_name);
                      setpayway(record.Device_url);
                      setprice(record.Device_money);
                      setremark(record.Device_remark);
                      setmy_id(record.Device_Sid);
                      setmch_wx_key(record.Device_bussid);
                      setwx_app_id(record.Device_appid);
                      setxuliehao(record.Device_munber);
                      setnotify_url(record.Device_api);
                      setfenclass(record);
                      setIsModalOpen("修改支付");
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
          <li>
            <p>支付名称：</p>
            <Input
              value={paydesignation}
              onChange={(val) => setpaydesignation(val.target.value)}
            ></Input>
          </li>
          <li>
            <p> {isModalOpen === "新增支付" ? "支付类型：" : "URL："}</p>
            <Input
              value={payway}
              onChange={(val) => setpayway(val.target.value)}
            ></Input>
          </li>
          {/* isModalOpen === "修改支付"  */}
          {true ? (
            <>
              <li>
                <p>充值额：</p>
                <Input
                  value={price}
                  onChange={(val) => setprice(val.target.value)}
                ></Input>
              </li>
              <li>
                <p>备注：</p>
                <Input
                  value={remark}
                  onChange={(val) => setremark(val.target.value)}
                ></Input>
              </li>
              <li>
                <p>商户号：</p>
                <Input
                  value={mch_wx_key}
                  onChange={(val) => setmch_wx_key(val.target.value)}
                ></Input>
              </li>
              <li>
                <p>app_id：</p>
                <Input
                  value={wx_app_id}
                  onChange={(val) => setwx_app_id(val.target.value)}
                ></Input>
              </li>
              <li>
                <p>序列号：</p>
                <Input
                  value={xuliehao}
                  onChange={(val) => setxuliehao(val.target.value)}
                ></Input>
              </li>
              <li>
                <p>回调地址：</p>
                <Input
                  value={notify_url}
                  onChange={(val) => setnotify_url(val.target.value)}
                ></Input>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </Modal>
    </div>
  );
}
