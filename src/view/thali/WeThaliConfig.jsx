/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useMemo } from "react";
import {
  message,
  Input,
  Select,
  Modal,
  Button,
  Spin,
  Radio,
  Popconfirm,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store";

import { exportRaw } from "../../utils/utils";
import { getPackDetail, getPlaceOrder, getkucun } from "../../api/thali";
import { getGroupListNoPage, postAddGroup } from "../../api/group";
// 组件
import Insurance from "./components/Insurance";
import "./ThaliConfig.less";
//图片
import thaliActive from "../../assets/image/thali/thali-active.png";

const { Option } = Select;
// 批量新增，批量取消托管接口还没对接

export default function ThaliConfig() {
  const [orderModal, setOrderModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState([]);
  const [insuranceTerms, setInsuranceTerms] = useState(false);
  const thaliInfo = useAppStore((state) => state.thaliInfo);
  const userInfo = useAppStore((state) => state.userInfo);
  const setThaliInfo = useAppStore((state) => state.getThaliInfo);
  const [thaliConfigLoading, setThaliConfigLoading] = useState(false);
  const [selectShow] = useState(false); //保险选中
  const [weeklyCardShow, setWeeklyCardShow] = useState(false); //选中周卡的15级号
  const [scanOpenShow, setScanOpenShow] = useState(true); //选中open还是扫码账号
  // const [exclusive, setExclusive] = useState(true); //是否独享
  const [active, setActive] = useState(0);
  const [inventory, setinventory] = useState(0); //库存

  const [num, setNum] = useState("");
  const navigate = useNavigate();
  const [thaliData, setThaliData] = useState({});
  const [addGroup, setAddGroup] = useState(""); //分组名字
  const [addGroupLoading, setAddGroupLoading] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupList, setGroupList] = useState([]); //分组
  const [groupId, setGroupId] = useState(null); //分组id
  const [condition, setcondition] = useState(false); //类型显示与隐藏
  // const [insureList] = useState(["1", "2", "3"]); //保险份
  // const [insureActive, setInsureActive] = useState("1"); //保险倍数
  const Userid = sessionStorage.getItem("user");
  // 获取路径参数
  const hash = window.location.hash;
  const [path, queryString] = hash.split("?");
  const queryParams = new URLSearchParams(queryString);
  const querData = queryParams.get("data");
  ///////
  const getDetail = async () => {
    const { Device_Sid } = thaliInfo;
    console.log(thaliInfo, "thaliInfothaliInfo");
    if (!Device_Sid) {
      return;
    }
    setThaliConfigLoading(true);
    let result = await getPackDetail({ Sid: Device_Sid });
    const { code, data, msg, money } = result || {};
    message.destroy();
    if (code) {
      //初始化
      setThaliData({ ...data[0], money });
    } else {
      message.error(msg);
    }
    setThaliConfigLoading(false);
  };
  // 获取分组
  const getGroupList = async () => {
    let result = await getGroupListNoPage({
      Sid: Userid,
      Pagenum: "1",
      Pagesize: "200",
    });
    message.destroy();
    if (result?.code) {
      setGroupList([...result?.data]);
    } else {
      message.error(result?.msg);
    }
  };
  useEffect(() => {
    (() => {
      getDetail();
      getGroupList();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 计算获取价格单价
  const price = useMemo(() => {
    let num = 0;
    if (thaliData.money) {
      num = thaliData?.money[active]?.Device_money;
    }
    return num;
  }, [active, thaliData]);

  const activeWeeklyCard = useMemo(() => {
    let show = null;
    return show;
  }, [active]);

  //计算获取类型
  const projectName = useMemo(() => {
    let num = "-";
    if (thaliData?.money?.length > 0) {
      num = thaliData.money[active]?.Device_name;
    }
    return num;
  }, [active, thaliData]);

  // availableNum计算获取库存
  useEffect(() => {
    if (thaliData?.Device_Sid) {
      setThaliConfigLoading(true);
      getkucun({
        Sid: thaliData?.Device_Sid,
        Type: active + 1 + "",
      }).then((res) => {
        console.log(res, "resres");
        setThaliConfigLoading(false);
        if (res.code) {
          setinventory(res.data[0]?.Device_kc);
        }
      });
    }
  }, [weeklyCardShow, scanOpenShow, active, thaliData]);

  //总金额
  const totalNum = useMemo(() => {
    let totalNumber = 0;
    if (num && num > 0 && price && price > 0) {
      totalNumber = num * price;
    }
    return totalNumber;
  }, [num, price]);

  // 应付金额
  const shouldNum = useMemo(() => {
    let totalNumber = 0;
    if (num > 0 && thaliData.money) {
      totalNumber = num * Number(thaliData?.money[active]?.Device_money);
    }

    return totalNumber;
  }, [num, price, selectShow, weeklyCardShow, active, thaliData]); //insureActive,

  const backPage = () => {
    setThaliInfo({});
    navigate(-1);
  };
  //下单
  const placeOrder = async () => {
    const Type =
      thaliData.money[active].Device_id === "4"
        ? "2"
        : scanOpenShow
        ? "4"
        : "3";
    const Typename =
      Type === "1"
        ? "小程序"
        : Type === "2"
        ? "ck"
        : Type === "3"
        ? "扫码"
        : "";
    const fenzu = groupList.filter((item) => {
      return groupId === item.Device_gid;
    });
    // console.log(thaliData, thaliData.money[active].Device_id);
    let param = {
      Userid, //用户sid
      Username: userInfo.Device_name, //用户名称
      Psid: thaliData.Device_Sid, //项目sid
      Pid: thaliData?.Device_appid, //项目id
      Pname: thaliData.Device_name, //项目名称
      Type, //提取项目id  1 open  2 ck  3 sm 4 xcx
      Typename, //提取项目名称
      Kc: inventory, //库存
      Dj: price, //单价
      Gid: groupId, //分组id
      Gname: fenzu[0]?.Device_Name || "", //分组名称
      Num: num, //数量
      Pbid: thaliData?.money[active]?.Device_id, //卡结算单位id
      Pbname: thaliData?.money[active]?.Device_name, //卡结算单名名称
      Ly: JSON.parse(querData).Web === 1 ? "web" : "app", //来源app/web
      Lytype: "2", //来源 q:1 v:2
    };
    if (num > 0) {
      setThaliConfigLoading(true);
      let result = await getPlaceOrder(param);
      const { code, data, msg } = result || {};
      message.destroy();
      if (code === 200) {
        message.success("购买成功");
        setOrderDetail([result.orderId]);
        getDetail();
        setOrderModal(true); //生成订单列表
      } else {
        message.error(msg);
      }
      setThaliConfigLoading(false);
    } else {
      message.error("数量至少为一个");
    }
  };
  //新增分组
  const setGroup = async () => {
    if (!addGroup) {
      message.destroy();
      return message.error("请输入新增分组名");
    }
    setAddGroupLoading(true);
    let result = await postAddGroup({ Sid: Userid, name: addGroup });
    if (result?.code === 200) {
      message.success("新增成功");
      setShowAddGroup(false);
      setAddGroup("");
      getGroupList();
    } else {
      message.error(result?.msg);
    }
    setAddGroupLoading(false);
  };
  //下载订单
  const generateOrder = () => {
    // let orderStrList = "";
    // orderDetail &&
    //   orderDetail.forEach((item) => {
    //     orderStrList += item.order_id + "----" + item.account + "\n";
    //   });
    console.log(orderDetail);
    // exportRaw("订单列表", orderStrList, true);
    setOrderDetail([]);
    setOrderModal(false);
  };
  //切换类型选中项
  const changeActive = (index) => {
    setActive(index);
    setcondition(false);
    // if (thaliData?.pack_id[index]?.package_id === "10006") {
    //   setcondition(false);
    // } else {
    //   setcondition(true);
    // }
  };
  return (
    <Spin spinning={thaliConfigLoading}>
      <div className="thali-config-box">
        <div className="thali-config">
          <div className="thali-seat">
            <LeftOutlined onClick={backPage} />
            <span className="seat-title">基础配置</span>
          </div>
          <div className="project-total-amount">
            <div className="project-details">
              <div className="project-details-item project-details-item-center">
                <div className="project-details-item-title">项目名称：</div>
                <div className="project-details-item-thali-info">
                  {thaliData?.Device_name}
                </div>
              </div>
              <div className="project-details-item">
                <div className="project-details-item-title">套餐介绍：</div>
                <div className="project-details-pack-intro">
                  <div className="pack-intro-title">套餐介绍：</div>
                  <div className="pack-intro-text">
                    {thaliData?.joint_id > 0 ? (
                      <div style={{ color: "red" }}>
                        <span
                          style={{ color: "red" }}
                          className="pack-intro-text-title"
                        >
                          温馨提示：
                        </span>
                        该单1分钟只能扫一次 10分钟3次 1个小时5次
                      </div>
                    ) : (
                      <></>
                    )}
                    <div>
                      <span className="pack-intro-text-title">首扫套餐：</span>
                      首次扫码授权成功，如不成功平台会自动化售后，卡数返还到您的账户点数余额，24小时内可以复扫限制5次。注意是以购买套餐时间起算，并非充值卡密时间。
                    </div>
                    <div>
                      <span className="pack-intro-text-title">日卡套餐：</span>
                      有效期24小时。
                    </div>
                    <div>
                      <span className="pack-intro-text-title">周卡套餐：</span>
                      首次扫码失败会自动返点，七天内出现复扫失败可以售后，超时无售后。
                    </div>
                    <div>
                      <span className="pack-intro-text-title">月卡套餐：</span>
                      首次扫码失败会自动返点，一个月内出现复扫失败可以售后，超时无售后。
                    </div>
                    <div>
                      <span className="pack-intro-text-title">
                        open,ck套餐：
                      </span>
                      只能即时售后。
                    </div>
                    <div style={{ color: "red" }}>
                      <span
                        className="pack-intro-text-title"
                        style={{ color: "red" }}
                      >
                        提示：
                      </span>
                      本站号码均为新号,如需老号请与客服联系。
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-details-item project-details-item-center">
                <div className="project-details-item-title">选择类型：</div>
                <div className="project-details-item-types">
                  {thaliData?.money &&
                    thaliData?.money.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            // setScanOpenShow(false);
                            changeActive(index);
                            setWeeklyCardShow(false);
                          }}
                          className={
                            active === index
                              ? "project-details-item-types-item project-details-item-types-item-active"
                              : "project-details-item-types-item"
                          }
                        >
                          {item.Device_name}
                          {active === index && (
                            <img
                              src={thaliActive}
                              alt=""
                              className="project-details-icon"
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              {thaliData.is_game === 1 && activeWeeklyCard && (
                <div className="project-details-item project-details-item-center">
                  <div className="project-details-item-title"></div>
                  <div className="project-details-item-thali-info">
                    <span style={{ color: "red" }}>{activeWeeklyCard}</span>
                  </div>
                </div>
              )}
              {/* activeWeeklyCard && */}
              {/* {thaliInfo.id === 317 && (
                <>
                  <div className="project-details-item project-details-item-center">
                    <div className="project-details-item-title">等级：</div>
                    <div className="project-details-item-thali-info">
                      <Radio.Group
                        onChange={(even) =>
                          setWeeklyCardShow(even.target.value)
                        }
                        value={weeklyCardShow}
                      >
                        <Radio value={true}>15级</Radio>
                        <Radio value={false}>无等级要求</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </>
              )} */}
              {thaliData?.money &&
                thaliData?.money[active]?.Device_id !== "4" && (
                  <div className="project-details-item project-details-item-center">
                    <div className="project-details-item-title">类型：</div>
                    <div className="project-details-item-thali-info">
                      <Radio.Group
                        onChange={(even) => {
                          console.log(thaliData);
                          setScanOpenShow(even.target.value);
                        }}
                        value={scanOpenShow}
                      >
                        <Radio value={false}>扫码</Radio>

                        <Radio value={true}>小程序</Radio>
                      </Radio.Group>
                      <span style={{ color: "red" }}>
                        W账号，扫码一天只能扫两次
                        {scanOpenShow &&
                          "，code有效期20分钟，失效之后请重新扫码提code"}
                      </span>
                    </div>
                  </div>
                )}
              <div className="project-details-item project-details-item-center">
                <div className="project-details-item-title">库存：</div>
                <div className="project-details-item-thali-info">
                  <Input
                    value={inventory}
                    suffix="个"
                    style={{ width: "472px", height: "36px" }}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="project-details-item project-details-item-center">
                <div className="project-details-item-title">单价：</div>
                <div className="project-details-item-thali-info">
                  <Input
                    value={price}
                    prefix="￥"
                    suffix="元"
                    style={{ width: "472px", height: "36px" }}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="project-details-item project-details-item-center">
                <div className="project-details-item-title">分组：</div>
                <div className="project-details-item-thali-info">
                  <Select
                    showSearch
                    value={groupId}
                    style={{ width: "156px" }}
                    placeholder="选择分组 "
                    onChange={(value) => setGroupId(value)}
                    filterOption={(inputValue, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(inputValue.toLowerCase()) >= 0
                    }
                    allowClear
                  >
                    {groupList &&
                      groupList.map((item) => {
                        return (
                          <Option key={item.Device_gid} value={item.Device_gid}>
                            {item.Device_Name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
                <div
                  className="project-details-item-thali-info-add"
                  onClick={() => setShowAddGroup(true)}
                >
                  新增分组
                </div>
              </div>
              <div className="project-details-item project-details-item-center">
                <div className="project-details-item-title">数量：</div>
                <div className="project-details-item-thali-info">
                  <Input
                    value={num}
                    onChange={(even) => setNum(even.target.value)}
                    placeholder="请输入数量"
                    style={{ width: "200px", height: "36px" }}
                  />
                </div>
              </div>
            </div>
            <div className="total-amount">
              <div className="total-amount-item">
                <div className="total-amount-item-left">
                  <img
                    src={thaliData?.Device_url}
                    alt=""
                    className="total-amount-item-path"
                  />
                  <span className="total-amount-item-left-text">
                    {thaliData?.Device_name || "-"}
                  </span>
                </div>
              </div>
              <div className="total-amount-item">
                <div className="total-amount-item-left">套餐类型：</div>
                <div className="total-amount-item-right">{projectName}</div>
              </div>
              <div className="total-amount-item">
                <div className="total-amount-item-left">购买数量：</div>
                <div className="total-amount-item-right">{num || "0"}</div>
              </div>
              <div className="total-amount-item">
                <div className="total-amount-item-left">商品总价：</div>
                <div className="total-amount-item-right">
                  ￥{totalNum && totalNum.toFixed(2)}
                </div>
              </div>
              {userInfo?.discount && userInfo?.discount !== 1 && (
                <div className="total-amount-item" style={{ color: "red" }}>
                  <div className="total-amount-item-left">当前折扣：</div>
                  <div className="total-amount-item-right">
                    {Number(userInfo?.discount) * 10}折
                  </div>
                </div>
              )}
              <div className="total-amount-bor"></div>
              <div className="total-amount-price">
                <span>应付金额：</span>
                <span className="total-amount-price-text">
                  ￥{shouldNum && shouldNum.toFixed(2)}
                </span>
              </div>
              <Popconfirm
                title="提示"
                description={() => {
                  if (thaliInfo.id === 386) {
                    if (thaliData?.pack_id[active].package_id === 10006) {
                      return `您购买的是CK账号?`;
                    }
                  }
                  return `您购买的是${scanOpenShow ? "小程序" : "扫码"}账号?`;
                }}
                onConfirm={() => placeOrder()}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  type="primary"
                  style={{ width: "375px", height: "50px" }}
                >
                  立即购买
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="添加分组"
        width={500}
        open={showAddGroup}
        destroyOnClose
        onOk={() => {
          setGroup();
        }}
        onCancel={() => {
          setShowAddGroup(false);
          setAddGroup("");
        }}
      >
        <Spin spinning={addGroupLoading}>
          <div
            style={{
              padding: "30px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Input
              value={addGroup}
              onChange={(even) => {
                setAddGroup(even.target.value);
              }}
              style={{ width: "300px" }}
            />
          </div>
        </Spin>
      </Modal>
      <Modal
        title="投保须知条款"
        width={792}
        open={insuranceTerms}
        footer={null}
        destroyOnClose
        onCancel={() => setInsuranceTerms(false)}
      >
        <Insurance />
      </Modal>
      <Modal
        title="是否生成订单"
        width={400}
        open={orderModal}
        destroyOnClose
        onOk={() => generateOrder()}
        onCancel={() => setOrderModal(false)}
      ></Modal>
    </Spin>
  );
}
