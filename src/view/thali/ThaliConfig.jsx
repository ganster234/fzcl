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
// import thaliSelect from "../../assets/image/thali/thali-select.png";
// import thaliSelectActive from "../../assets/image/thali/thali-select-active.png";
// import thaliSelectShare from "../../assets/image/thali/thali-select-share.png";

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
  const [weeklyCardShow, setWeeklyCardShow] = useState(-1); //选中周卡的15级号
  const [scanOpenShow, setScanOpenShow] = useState(false); //选中open还是扫码账号
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
  const getDetail = async () => {
    const { appId, id } = thaliInfo;
    if (!appId && !id) {
      return;
    }
    setThaliConfigLoading(true);
    let result = await getPackDetail({ price_id: id, app_id: appId });
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      //初始化
      setThaliData({ ...data });
    } else {
      message.error(msg);
    }
    setThaliConfigLoading(false);
  };
  // 获取分组
  const getGroupList = async () => {
    let result = await getGroupListNoPage();
    message.destroy();
    if (result?.code === 200) {
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

  // const purchase = () => {
  //   if (
  //     thaliData &&
  //     thaliData.pack_id &&
  //     thaliData.pack_id[active].name &&
  //     (thaliData.pack_id[active].name.includes("周卡") ||
  //       thaliData.pack_id[active].name.includes("月卡"))
  //   ) {
  //     setSelectShow(true);
  //   } else {
  //     message.destroy();
  //     return message.error("目前只有月卡和周卡支持购买保险");
  //   }
  // };

  // 计算获取价格单价
  const price = useMemo(() => {
    let num = 0;
    if (thaliData.pack_id && thaliData.pack_id[active]) {
      num = thaliData.pack_id[active]?.price;
    }
    return num;
  }, [active, thaliData]);

  const activeWeeklyCard = useMemo(() => {
    let show = null;
    if (thaliData?.pack_id && thaliData?.pack_id[active]) {
      // if (thaliData?.pack_id[active].package_id === 10001) {
      //   // 信用分大于等于300
      //   show = "";
      //   setWeeklyCardShow(true);
      // } else if (thaliData?.pack_id[active].package_id === 10013) {
      //   // 信用分大于等于300,该账号只有您单独使用
      //   show = "";
      //   setWeeklyCardShow(true);
      // }
    }

    return show;
  }, [active]);

  // //获取保险金额
  // const insurePrice = useMemo(() => {
  //   let num = 0;
  //   if (
  //     thaliData.pack_id &&
  //     thaliData.pack_id[active] &&
  //     (thaliData.pack_id[active].name.includes("周卡") ||
  //       thaliData.pack_id[active].name.includes("月卡"))
  //   ) {
  //     if (userInfo?.insure) {
  //       num = thaliData.pack_id[active]?.price * Number(userInfo?.insure);
  //     }
  //   }
  //   return num;
  // }, [active, thaliData]);
  //计算获取类型
  const projectName = useMemo(() => {
    let num = 0;
    // if (
    //   thaliData &&
    //   thaliData.pack_id &&
    //   thaliData.pack_id[active].name &&
    //   (thaliData.pack_id[active].name.includes("周卡") ||
    //     thaliData.pack_id[active].name.includes("月卡"))
    // ) {
    //   setSelectShow(true);
    // } else {
    //   setSelectShow(false);
    // }
    if (thaliData.pack_id && thaliData.pack_id[active]) {
      num = thaliData.pack_id[active]?.name;
    }
    return num;
  }, [active, thaliData]);

  // availableNum计算获取库存
  useEffect(() => {
    const is_op = scanOpenShow ? 1 : 0;
    if (thaliData?.pack_id) {
      setThaliConfigLoading(true);
      getkucun({
        is_op,
        is_qq: 1,
        priceId: thaliData.id,
        package_id: thaliData?.pack_id[active]?.package_id,
        is_shiming: "-1",
        score: "-1",
        is_fifteen: "-1",
      }).then((res) => {
        setThaliConfigLoading(false);
        if (res.code === 200) {
          setinventory(res.data);
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

  //insureNum保险
  // const insureNum = useMemo(() => {
  //   let insureNum = 0.0;
  //   if (num && num > 0 && insureActive) {
  //     insureNum = num * (insurePrice * insureActive);
  //   }
  //   return insureNum;
  // }, [num, insureActive, active, thaliData]);

  // 应付金额
  const shouldNum = useMemo(() => {
    let totalNumber = 0;
    const { discount } = userInfo;
    // activeWeeklyCard && 王者15级号加1元
    if (weeklyCardShow && thaliInfo.id === 317) {
      if (num && num > 0 && price && price > 0) {
        // if (selectShow) {
        //   let discountPrice = num * price * Number(discount);
        //   totalNumber = discountPrice + Number(num); //num * (insurePrice * insureActive)
        // } else {
        totalNumber = num * price * Number(discount) + Number(num);
        // }
      }
    } else {
      if (num && num > 0 && price && price > 0) {
        // if (selectShow) {
        //   let discountPrice = num * price * Number(discount);
        //   totalNumber = discountPrice; //num * (insurePrice * insureActive)
        // } else {
        totalNumber = num * price * Number(discount);
        // }
      }
    }

    return totalNumber;
  }, [num, price, selectShow, weeklyCardShow]); //insureActive,

  const backPage = () => {
    setThaliInfo({});
    navigate(-1);
  };
  //下单
  const placeOrder = async () => {
    // thaliData项目id
    const { id, pack_id, app_id } = thaliData;
    message.destroy();
    if (!id) {
      return;
    }
    const { package_id } = pack_id[active];
    let available = 0;
    if (thaliData.id === 317 && pack_id[active].package_id === 10001) {
      if (weeklyCardShow) {
        available = pack_id[active]?.achieve_availableNum;
      } else {
        available = pack_id[active]?.availableNum;
      }
    } else {
      available = pack_id[active]?.availableNum;
    }
    if (!package_id) {
      return;
    }

    if (!num) {
      console.log(available);
      return message.error("请输入购买数量");
    }
    if (
      scanOpenShow ||
      pack_id[active]?.package_id === "10007" ||
      pack_id[active]?.package_id === "10012"
    ) {
      navigate("/layouts/thali/open", {
        state: { app_id: app_id, num: num },
      });
      return;
    }
    if (
      pack_id[active]?.name &&
      pack_id[active]?.package_id === "10006" &&
      app_id
    ) {
      navigate("/layouts/thali/ck", {
        state: { app_id: app_id, num: num },
      });
      return;
    }

    let param = {
      priceId: id + "", //项目id
      packageId: package_id + "", //套餐id
      groupid: groupId ? groupId + "" : 0, //分组id
      count: num, //下单数量
      is_insure: selectShow ? "1" : "0", //0不投保 1投保
      is_fifteen: weeklyCardShow ? weeklyCardShow : '-1', //是否15级
    };
    if (
      thaliInfo.id === 317 &&
      (pack_id[active]?.package_id === 10001 ||
        pack_id[active]?.package_id === 10013)
    ) {
      param.weeklyCardShow = 1;
    }
    setThaliConfigLoading(true);
    let result = await getPlaceOrder(param);
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      message.success("购买成功");
      setOrderDetail([...data?.orderIdList]);
      getDetail();
      setOrderModal(true);
    } else {
      message.error(msg);
    }
    setThaliConfigLoading(false);
  };
  //新增分组
  const setGroup = async () => {
    if (!addGroup) {
      message.destroy();
      return message.error("请输入新增分组名");
    }
    setAddGroupLoading(true);
    let result = await postAddGroup({ name: addGroup });
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
    let orderStrList = "";
    orderDetail &&
      orderDetail.forEach((item) => {
        orderStrList += item.order_id + "----" + item.account + "\n";
      });
    exportRaw("订单列表", orderStrList, true);
    setOrderDetail([]);
    setOrderModal(false);
  };
  //切换类型选中项
  const changeActive = (index) => {
    setActive(index);
    if (thaliData?.pack_id[index]?.package_id === "10006") {
      setcondition(false);
    } else {
      setcondition(true);
    }
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
                  {thaliData?.app_name}
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
                      <span style={{ color: "red" }}>售后时效: 10小时</span>
                    </div>
                    <div>
                      <span className="pack-intro-text-title">周卡套餐：</span>
                      首次扫码失败会自动返点，四天内出现复扫失败可以售后，超时无售后。
                      <span style={{ color: "red" }}>售后时效: 4天</span>
                    </div>
                    <div>
                      <span className="pack-intro-text-title">月卡套餐：</span>
                      首次扫码失败会自动返点，十五天内出现复扫失败可以售后，超时无售后。
                      <span style={{ color: "red" }}>售后时效: 15天</span>
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
                  {thaliData?.pack_id &&
                    thaliData?.pack_id.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setScanOpenShow(false);
                            changeActive(index);
                            setWeeklyCardShow(false);
                          }}
                          className={
                            active === index
                              ? "project-details-item-types-item project-details-item-types-item-active"
                              : "project-details-item-types-item"
                          }
                        >
                          {item.name}
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

              {/* {thaliInfo.id === 317 &&  (
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
                        <Radio value={1}>15级</Radio>
                        <Radio value={-1}>无等级要求</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </>
              )} */}
              { (
                <div className="project-details-item project-details-item-center">
                  <div className="project-details-item-title">类型：</div>
                  <div className="project-details-item-thali-info">
                    <Radio.Group
                      onChange={(even) => setScanOpenShow(even.target.value)}
                      value={scanOpenShow}
                    >
                      <Radio value={true}>open</Radio>
                      <Radio value={false}>扫码</Radio>
                    </Radio.Group>
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
                          <Option key={item.id} value={item.id}>
                            {item.group_name}
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
                    src={thaliData?.logo_path}
                    alt=""
                    className="total-amount-item-path"
                  />
                  <span className="total-amount-item-left-text">
                    {thaliData?.app_name || "-"}
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
                  return `您购买的是${scanOpenShow ? "open" : "扫码"}账号?`;
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
