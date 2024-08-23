/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Spin, Select, InputNumber, message, Button } from "antd";
import useAppStore from "../../../store";

import { getProjectPackList } from "../../../api/project";
import { setAddOpen } from "../../../api/open";
import { getPackDetail } from "../../../api/thali";
import { areaList } from "../../../utils/area";

import "./CreateTaskModal.less";

const { Option } = Select;

export default function CreateTaskModal({ taskWxCancel }) {
  const location = useLocation();
  const userInfo = useAppStore((state) => state.userInfo);
  //   项目详细的信息
  const [projectDetail, setProjectDetail] = useState({});
  const [taskLoading, setTaskLoading] = useState(false);
  //项目的数组
  const [packList, setPackList] = useState([]);
  const [modalState, setModalState] = useState({
    project: null, //项目
    num: null, //数量
    areaCode: null, //地区
  });

  useEffect(() => {
    const getPackList = async () => {
      setTaskLoading(true);
      let { code, data, msg } = await getProjectPackList({ is_qq: "2" });
      message.destroy();
      if (code === 200) {
        setPackList([...data?.price]);
        const { state } = location;
        if (state?.app_id && state?.num) {
          setModalState({
            project: state?.app_id,
            num: state?.num,
            areaCode: null, //地区
          });
        }
      } else {
        message.error(msg);
      }
      setTaskLoading(false);
    };
    getPackList();
  }, []);

  useEffect(() => {
    async function getDetails() {
      let index =
        packList &&
        packList.findIndex((item) => item.wx_app_id === modalState.project);

      setTaskLoading(true);
      let result = await getPackDetail({
        price_id: packList[index]?.id,
        app_id: packList[index]?.wx_app_id,
        type: "2",
        is_qq: "2",
      });
      const { code, data, msg } = result || {};
      message.destroy();
      if (code === 200) {
        let some =
          data?.pack_id &&
          data?.pack_id.some((item) => item.package_id === 10006);
        if (!some) {
          message.error("该项目没有此套餐，请联系客服开通");
        }
        setProjectDetail({ ...data });
      } else {
        message.error(msg);
      }
      setTaskLoading(false);
    }
    if (modalState.project) {
      getDetails();
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [modalState.project]);

  const filterOption = (input, option) => {
    return (option?.children ?? "").toLowerCase().includes(input.toLowerCase());
  };

  const inventory = useMemo(() => {
    let availableNum = 0;
    if (projectDetail.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.package_id === 10006
      );
      availableNum = projectDetail?.pack_id[index]?.availableNum;
    }
    return availableNum;
  }, [projectDetail]);

  const totalPrice = useMemo(() => {
    let price = 0;
    const { discount } = userInfo;
    if (projectDetail.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.name === "CK"
      );
      if (projectDetail?.pack_id[index]?.price && modalState.num) {
        price = Number(projectDetail?.pack_id[index]?.price) * modalState.num;
      }
    }
    return price * Number(discount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDetail, modalState.num]);

  const unitPrice = useMemo(() => {
    let price = 0;
    if (projectDetail.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.name === "CK"
      );
      price = projectDetail?.pack_id[index]?.price;
    }
    return price;
  }, [projectDetail]);

  //创建
  const comBtn = async () => {
    const { id } = projectDetail;
    message.destroy();
    if (!modalState.num) {
      return message.error("任务最低数量为1");
    }
    let parma = {
      name: projectDetail?.app_name,
      price_id: projectDetail?.id,
      num: modalState.num + "",
      is_op: 2,
      is_qq: 2,
    };
    if (projectDetail?.url) {
      // const w = window.open("about:blank");
      // w.location.href = projectDetail?.url;
      message.destroy();
      return message.error("请联系客服");
    }
    if (projectDetail?.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.package_id === 10006
      );
      parma.package_id = projectDetail?.pack_id[index]?.package_id;
    } else {
      return;
    }
    if (id === 386 && !modalState.areaCode) {
      return message.error("请选择区域");
    }
    parma.city_code = modalState.areaCode + "";
    // parma.city_code = "10006";
    setTaskLoading(true);
    let result = await setAddOpen({ ...parma });
    const { code, msg } = result || {};
    if (code === 200) {
      setModalState({
        project: null,
        num: "",
        areaCode: null,
      });
      setProjectDetail({});
      message.success("创建成功");
      taskWxCancel("comfig");
    } else {
      message.error(msg);
    }
    setTaskLoading(false);
  };

  return (
    <>
      <Spin spinning={taskLoading}>
        <div className="create-task-item">
          <span>项目：</span>
          <Select
            value={modalState.project}
            style={{ width: "160px" }}
            placeholder="请选择项目"
            optionFilterProp="children"
            showSearch
            onChange={(value) =>
              setModalState((data) => ({ ...data, project: value, num: "1" }))
            }
            filterOption={filterOption}
          >
            {packList &&
              packList.map((item, index) => {
                return (
                  <Option key={index} value={item.wx_app_id}>
                    {item.app_name}
                  </Option>
                );
              })}
          </Select>
        </div>
        <div className="create-task-item">
          <span>数量：</span>
          <InputNumber
            value={modalState.num}
            style={{ width: "200px" }}
            onChange={(even) =>
              setModalState((data) => ({ ...data, num: even }))
            }
            placeholder="请输入数量"
          />
        </div>
        {projectDetail?.id === 386 && (
          <div className="create-task-item">
            <span>区域：</span>
            <Select
              value={modalState.areaCode}
              style={{ width: "160px" }}
              placeholder="请选择区域"
              optionFilterProp="children"
              showSearch
              onChange={(value) =>
                setModalState((data) => ({ ...data, areaCode: value }))
              }
              filterOption={filterOption}
            >
              {areaList &&
                areaList.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          </div>
        )}

        <div className="create-task-item">
          <span>库存：</span>
          <span className="create-task-item-price">{inventory || 0}</span>
        </div>

        <div className="create-task-item">
          <span>单价：</span>
          <span className="create-task-item-price">{unitPrice || 0}</span>
        </div>
        {userInfo?.discount && userInfo?.discount !== 1 && (
          <div className="create-task-item" style={{ color: "red" }}>
            <span>折扣：</span>
            <span className="create-task-item-price">
              {userInfo?.discount}折
            </span>
          </div>
        )}
        <div className="create-task-item">
          <span>总价：</span>
          <span className="create-task-item-price">
            {(totalPrice && totalPrice.toFixed(2)) || 0}
          </span>
        </div>

        <div className="create-task-item create-task-item-justify">
          <Button onClick={() => taskWxCancel()}>取消</Button>
          <Button
            type="primary"
            style={{ marginLeft: "20px" }}
            onClick={comBtn}
          >
            确认
          </Button>
        </div>
      </Spin>
    </>
  );
}
