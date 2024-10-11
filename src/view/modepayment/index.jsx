import React, { useState, useEffect } from "react";
import { message, Table, Select, Switch, Button, Modal, Input } from "antd";
import { payprice, setpayprice, addpayprice } from "../../api/count";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { settlement } from "../../utils/columns";
import "./mod.less";
export default function Equipment() {
  const [dataList, setDataList] = useState([]); //表格数据
  const [goldWay, setGoldWay] = useState("-1"); //选项选中的值
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

  const showModal = () => {
    setpaydesignation("");
    setpayway("");
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
          id: my_id + "",
          pay_name: paydesignation,
          url: payway,
          price,
          remark,
          mch_wx_key,
          wx_app_id,
          xuliehao,
          notify_url,
        }).then((result) => {
          const { code, msg } = result || {};
          if (code === 200) {
            getList();
            setIsModalOpen("");
            setremark("");
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
          pay_name: paydesignation,
          pay_type: payway,
          url: payway,
          price,
          remark,
          mch_wx_key,
          wx_app_id,
          xuliehao,
          notify_url,
          is_use: 0,
        }).then((result) => {
          const { code, msg } = result || {};
          if (code === 200) {
            getList();
            message.success("新增成功");
            setIsModalOpen("");
            setpaydesignation("");
            setpayway("");
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
    let result = await payprice({ is_use: goldWay });
    const { code, msg, data } = result || {};
    if (code === 200) {
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
                { value: "-1", label: "全部" },
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
          rowKey="id"
          dataSource={dataList}
          columns={[
            ...settlement,
            {
              title: "状态控制",
              render: (record) => (
                <>
                  <Switch
                    checked={record.is_use === 0 ? true : false}
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked
                    onChange={() => {
                      setLoading(true);
                      const is_use = record.is_use === 0 ? 1 : 0;
                      setpayprice({ is_use, id: record.id }).then((result) => {
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
                      setpaydesignation(record.pay_name);
                      setpayway(record.url);
                      setprice(record.price);
                      setremark(record.remark);
                      setmy_id(record.id);
                      setmch_wx_key(record.mch_wx_key);
                      setwx_app_id(record.wx_app_id);
                      setxuliehao(record.xuliehao);
                      setnotify_url(record.notify_url);
                      console.log(record, "record");
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
                <p>wx_app_id：</p>
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
