import { useState, useEffect } from "react";
import { produce } from "immer";
import { getaccounttable } from "../../api/user";
import { myaccountdata } from "../../utils/columns";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { Table, Input, Button, Modal } from "antd";
export default function Aechatscan() {
  const [isModalOpen, setIsModalOpen] = useState(false); //模态框
  const [height, setHeight] = useState(600);
  const [seek, setSeek] = useState(""); //搜索
  const [data, setData] = useState({
    loading: false, //表格加载
    Tabledata: [], //表格数据
    deadData: [], //死号数据
  });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  const xuanran = (val) => {
    getaccounttable({
      order_id: val ? (seek ? seek : "1") : "1",
    }).then((res) => {
      if (res) {
        setData(
          produce(data, (draftState) => {
            draftState.Tabledata = res.data?.data ? res.data.data : [];
            draftState.deadData = res.data?.error ? res.data.error : [];
            draftState.loading = false;
          })
        );
      }
    });
  };
  const cashSearch = (isReset) => {
    console.log(isReset);
    if (isReset) {
      xuanran();
      setData(
        produce(data, (draftState) => {
          draftState.loading = true;
        })
      );
      setSeek("");
    } else {
      setData(
        produce(data, (draftState) => {
          draftState.loading = true;
        })
      );
      xuanran(true);
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
          <li>
            <p>订单号/用户查询：</p>
            <div style={{ marginTop: "8px" }}>
              <Input
                style={{ width: "350px" }}
                allowClear
                value={seek}
                onChange={(e) => {
                  setSeek(e.target.value);
                }}
                placeholder="请输入相关订单号/用户名称"
              />
            </div>
          </li>
          <li>
            <Button
              type="primary"
              onClick={() => {
                cashSearch(false);
              }}
              style={{ marginLeft: "16px", marginTop: "24px" }}
            >
              查询
            </Button>
            <Button
              className="resetting"
              style={{ marginLeft: "16px", marginTop: "24px" }}
              onClick={() => {
                cashSearch(true);
              }}
            >
              重置
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
        {data.deadData.length > 0 ? (
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            type="primary"
          >
            死号查询
          </Button>
        ) : (
          <></>
        )}

        <Table
          loading={data.loading} //表格加载
          scroll={{
            x: 600,
            y: height,
          }}
          pagination={false}
          rowKey="account"
          dataSource={data.Tabledata}
          columns={[
            ...myaccountdata,
            {
              title: <div className="text-center">状态</div>,
              render(_, row) {
                return (
                  <div>
                    {row.status === 0 ? (
                      <p style={{ color: "#52C41A" }}>正常</p>
                    ) : (
                      <p style={{ color: "red" }}>失效</p>
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      </section>
      <Modal
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
        open={isModalOpen}
      >
        <Table
          scroll={{
            y: 700,
          }}
          style={{ marginTop: "20px" }}
          pagination={false}
          rowKey="app_name"
          dataSource={data.deadData}
          columns={[
            {
              title: <div>项目</div>,
              render(_, row) {
                return <div>{row.app_name}</div>;
              },
            },
            {
              title: <div>死号数量</div>,
              render(_, row) {
                return <div>{row.count}</div>;
              },
            },
          ]}
        />
      </Modal>
    </div>
  );
}
